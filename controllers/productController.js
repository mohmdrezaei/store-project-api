const { Category } = require("../models/category.js");
const { Product } = require("../models/product.js");

const pLimit = require("p-limit");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_cloud_name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
});

exports.getAllProducts = async (req, res) => {
  const products = await Product.find().populate("category");
  try {
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res
      .status(500)
      .json({ message: "The product with the given ID was not found" });
  }
  res.status(200).send(product);
};

exports.createProduct = async (req, res) => {
  try {
    // بررسی وجود و صحت فیلدهای ورودی
    const {
      name,
      price,
      description,
      brand,
      category,
      CountInStock,
      rating,
      images,
    } = req.body;

    if (
      !name ||
      !price ||
      !description ||
      !brand ||
      !category ||
      !CountInStock ||
      !images
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res
        .status(400)
        .json({ message: "Images must be a non-empty array!" });
    }

    // بررسی وجود دسته‌بندی
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Invalid Category!" });
    }

    // آپلود تصاویر به Cloudinary
    const limit = pLimit(2); // محدودیت همزمانی آپلود

    const uploadImage = async (image) => {
      try {
        const result = await cloudinary.uploader.upload(image);
        return result;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return null;
      }
    };

    const imagesToUpload = images.map((image) =>
      limit(() => uploadImage(image))
    );
    const uploadStatus = await Promise.all(imagesToUpload);

    // بررسی موفقیت‌آمیز بودن آپلود تصاویر
    const successfulUploads = uploadStatus.filter((item) => item !== null);
    if (successfulUploads.length === 0) {
      return res
        .status(500)
        .json({ error: "All image uploads failed!", status: false });
    }

    // استخراج URL تصاویر آپلود شده
    const imgUrl = successfulUploads.map((item) => item.secure_url);

    // ایجاد محصول
    const product = new Product({
      name,
      price,
      description,
      images: imgUrl,
      brand,
      category,
      CountInStock,
      rating: rating || 0, // اگر rating وجود نداشت، مقدار پیش‌فرض ۰ قرار داده می‌شود
    });

    const savedProduct = await product.save();
    res
      .status(201)
      .json({ data: savedProduct, message: "Product created successfully!" });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteProduct = async (req, res) => {
  const deleteProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deleteProduct) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  return res.status(200).json({
    message: "Product is deleted",
    success: true,
  });
};



exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      brand,
      category,
      CountInStock,
      rating,
      images,
    } = req.body;

    if (!req.params.id) {
      return res.status(400).json({ message: "Product ID is required!", success: false });
    }

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ message: "Images are required and should be an array!", success: false });
    }

    // آپلود تصاویر به Cloudinary
    const limit = pLimit(2); // محدودیت همزمانی آپلود

    const uploadImage = async (image) => {
      try {
        const result = await cloudinary.uploader.upload(image);
        return result;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return null;
      }
    };

    const imagesToUpload = images.map((image) => limit(() => uploadImage(image)));
    const uploadStatus = await Promise.all(imagesToUpload);

    // بررسی موفقیت‌آمیز بودن آپلود تصاویر
    const successfulUploads = uploadStatus.filter((item) => item !== null);
    if (successfulUploads.length === 0) {
      return res.status(500).json({ error: "All image uploads failed!", status: false });
    }

    // استخراج URL تصاویر آپلود شده
    const imgUrl = successfulUploads.map((item) => item.secure_url);

    // ایجاد محصول
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        images: imgUrl,
        brand,
        category,
        CountInStock,
        rating: rating || 0,
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "The product can not be updated!",
        success: false,
      });
    }

    res.status(200).json({
      product,
      message: "The product is updated!",
      success: true,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
