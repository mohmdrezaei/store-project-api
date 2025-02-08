const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");


router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/create", categoryController.createCategory);
router.delete("/:id" ,categoryController.deleteCategory )

module.exports = router;
