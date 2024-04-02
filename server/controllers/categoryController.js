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
