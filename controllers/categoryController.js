const { Category } = require("../models/category");
const pLimit = require("p-limit");
const cloudinary = require("cloudinary").v2;

// پیکربندی Cloudinary
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_cloud_name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
});

const getCategories = async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }

  res.send(categoryList);
};

const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res
      .status(500)
      .json({ message: "The category with the given ID was not found" });
  }
  res.status(200).send(category);
};

const createCategory = async (req, res) => {
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
};

const deleteCategory = async (req , res)=>{
  const deletedCategory = await Category.findByIdAndDelete(req.params.id)

  if(!deletedCategory) {
    res.status(404).json({
      message : "Category not found!",
      success : false
    })
  }

  res.status(200).json({
    message: "Category Deleted",
    success : true
  })
}

module.exports = {
  getCategories,
  createCategory,
  getCategoryById,
  deleteCategory
};
