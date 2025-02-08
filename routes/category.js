const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");




router.get("/", categoryController.getCategories);

router.post("/create",categoryController.createCategory);

module.exports = router;