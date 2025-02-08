const {Category } =require("../models/category")
const pLimit = require("p-limit");
const cloudinary = require('cloudinary').v2;

// پیکربندی Cloudinary
cloudinary.config({
   cloud_name: process.env.cloudinary_Config_cloud_name,
   api_key: process.env.cloudinary_Config_api_key,
   api_secret: process.env.cloudinary_Config_api_secret,
});

const getCategories =async (req , res)=>{
    const categoryList = await Category.find()
 
    if(!categoryList) {
     res.status(500).json({success:false})
    }
 
    res.send(categoryList)
 }

 const createCategory =async (req, res) => {
   try {
     const limit = pLimit(2);
 
     // آپلود تصاویر به Cloudinary
     const imagesToUpload = req.body.images.map((image) => {
       return limit(async () => {
         const result = await cloudinary.uploader.upload(image);
         return result;
       });
     });
 
     const uploadStatus = await Promise.all(imagesToUpload);
 
     // بررسی موفقیت‌آمیز بودن آپلود تصاویر
     if (!uploadStatus || uploadStatus.length === 0) {
       return res.status(500).json({
         error: "Image upload failed!",
         status: false,
       });
     }
 
     // استخراج URL تصاویر آپلود شده
     const imgUrl = uploadStatus.map((item) => item.secure_url);
 
     // ایجاد دسته‌بندی جدید
     let category = new Category({
       name: req.body.name,
       images: imgUrl,
       color: req.body.color,
     });
 
     // ذخیره دسته‌بندی در دیتابیس
     category = await category.save();
 
     // پاسخ موفقیت‌آمیز
     res.status(201).json(category);
   } catch (err) {
     // مدیریت خطاها
     console.error("Error in /create route:", err);
     res.status(500).json({
       error: err.message || "Internal Server Error",
       success: false,
     });
   }
 }

 module.exports ={
    getCategories,
    createCategory
 }