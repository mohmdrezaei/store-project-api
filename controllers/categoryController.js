const {Category } =require("../models/category")
const getCategories =async (req , res)=>{
    const categoryList = await Category.find()
 
    if(!categoryList) {
     res.status(500).json({success:false})
    }
 
    res.send(categoryList)
 }

 module.exports ={
    getCategories
 }