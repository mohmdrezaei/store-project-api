const { Category } = require('../models/category.js');
const Product = require('../models/Product.js');

exports.getAllProducts = async (req, res) => {
    const products = await Product.find().populate('category');
    try {
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.createProduct = async (req, res) => {

    const category = await Category.findById(req.body.category);

    if (!category) {
        return res.status(404).json({ message: "Invalid Category!" });
    }
   let product = new Product(req.body);

    try {
        const data = await product.save();
        res.status(201).json({data , message : "Product created successfully!"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}