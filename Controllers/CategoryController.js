const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const Category = require("../Model/category");
const SubCategory = require("../Model/subCategory");
app.use(cookieParser());

// category and subcategory routes

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
};

// Read All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

// Read Single Category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching category", error: error.message });
  }
};

// Update Category by ID
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true } // Returns the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated", updatedCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

// Delete Category by ID
const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted", deletedCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};

// Create SubCategory (Already Provided)
const createSubCategory = async (req, res) => {
  try {
    const { category_id, name } = req.body;
    const subcategory = new SubCategory({ category_id, name });
    await subcategory.save();
    res.status(201).json({ message: "Subcategory created", subcategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating subcategory", error: error.message });
  }
};

// Read All SubCategories
const getSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate("category_id"); // Fetch all subcategories with category details
    res.status(200).json(subcategories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subcategories", error: error.message });
  }
};

// Read Single SubCategory by ID
const getSubCategoryById = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id).populate(
      "category_id"
    );
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.status(200).json(subcategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subcategory", error: error.message });
  }
};

// Update SubCategory by ID
const updateSubCategory = async (req, res) => {
  try {
    const { category_id, name } = req.body;
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { category_id, name },
      { new: true } // Returns the updated document
    );

    if (!updatedSubCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res
      .status(200)
      .json({ message: "Subcategory updated", updatedSubCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating subcategory", error: error.message });
  }
};

// Delete SubCategory by ID
const deleteSubCategory = async (req, res) => {
  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSubCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res
      .status(200)
      .json({ message: "Subcategory deleted", deletedSubCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting subcategory", error: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
