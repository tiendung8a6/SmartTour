import mongoose from "mongoose";
import Categories from "../models/categoryModel.js";
import Posts from "../models/postModel.js";

export const createCategory = async (req, res, next) => {
  try {
    const { label, color } = req.body;

    if (!label || !color) {
      return res.status(400).json({
        success: false,
        message: "Label and color are required fields.",
      });
    }

    const existingCategory = await Categories.findOne({ label });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }

    const category = await Categories.create({ label, color });

    res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getCategory = async (req, res, next) => {
  try {
    let queryResult = Categories.find().sort({
      _id: -1,
    });

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //records count
    const totalCategories = await Categories.countDocuments();
    const numOfPage = Math.ceil(totalCategories / limit);

    queryResult = queryResult.skip(skip).limit(limit);

    const categories = await queryResult;

    res.status(200).json({
      success: true,
      message: "Categories loaded successfully",
      totalCategories,
      data: categories,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res, next) => {
  // Admin Only can delete
  try {
    const { id } = req.params;

    const postsWithCategory = await Posts.findOne({ cat: id });

    if (postsWithCategory) {
      return res.status(400).json({
        success: false,
        message: "Category is being used in posts",
      });
    }

    await Categories.findOneAndDelete({ _id: id });

    res.status(200).json({
      success: true,
      message: "Deleted category successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getCategories = async (req, res, next) => {
  try {
    // Truy vấn tất cả và sắp xếp theo thời gian tạo
    const categories = await Categories.find({ status: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const getPostsByCategory = async (req, res, next) => {
  try {
    const { catId } = req.params;

    const posts = await Posts.find({ cat: catId })
      .populate({
        path: "user",
        select: "name image -password",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully by category ID",
      data: posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, color } = req.body;

    const existingCategory = await Categories.findOne({ label });
    if (existingCategory && existingCategory._id.toString() !== id) {
      return res.status(400).json({
        success: false,
        message: "Category with this label already exists.",
      });
    }

    const updatedFields = {};
    if (label) updatedFields.label = label;
    if (color) updatedFields.color = color;

    const category = await Categories.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
export const updateCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const category = await Categories.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    await Posts.updateMany({ cat: id }, { status });

    res.status(200).json({
      success: true,
      message: "Category status updated successfully",
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
