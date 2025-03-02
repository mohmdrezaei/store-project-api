const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/" , productController.getAllProducts)
router.get("/:id" , productController.getProductById)
router.post("/create" ,productController.createProduct)
router.delete("/:id" ,productController.deleteProduct)
router.put("/:id" ,productController.updateProduct)

module.exports = router;