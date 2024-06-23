import mongoose from "mongoose";
import Comments from "../models/commentModel.js";
import Followers from "../models/followers.js";
import Posts from "../models/postModel.js";
import Users from "../models/userModel.js";
import Views from "../models/viewsModel.js";
import Categories from "../models/categoryModel.js";
import Trips from "../models/tripModel.js";
import Order from "../models/orderModel.js";

export const createPost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { desc, img, title, slug, cat } = req.body;

    if (!(desc || img || title || cat)) {
      return next("Tất cả các trường là bắt buộc.");
    }

    // Tìm id của category dựa trên tên category được cung cấp từ request body
    const category = await Categories.findOne({ label: cat });

    if (!category) {
      return next("Không tìm thấy danh mục");
    }

    const post = await Posts.create({
      user: userId,
      desc,
      img,
      title,
      slug,
      // Sử dụng id của category để tạo post mới
      cat: category._id,
    });

    res.status(200).json({
      success: true,
      message: "Bài viết được đăng thành công",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updatePostStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const post = await Posts.findByIdAndUpdate(id, { status }, { new: true });

    res.status(200).json({
      sucess: true,
      message: "Cập nhật trạng thái thành công",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { desc, title, img, cat } = req.body;

    const updatedFields = {};
    if (desc) updatedFields.desc = desc;
    if (title) updatedFields.title = title;
    if (img) updatedFields.img = img;
    if (cat) updatedFields.cat = cat;

    const post = await Posts.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Bài viết được cập nhật thành công",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const { cat, writerId } = req.query;

    let query = { status: true };

    if (cat) {
      query.cat = cat;
    } else if (writerId) {
      query.user = writerId;
    }

    let queryResult = Posts.find(query)
      .populate({
        path: "user",
        select: "name image -password",
      })
      .populate({
        path: "cat",
        select: "label color",
      })
      .sort({ _id: -1 });

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    //records count
    const totalPost = await Posts.countDocuments(queryResult);

    const numOfPage = Math.ceil(totalPost / limit);

    queryResult = queryResult.skip(skip).limit(limit);

    const posts = await queryResult;

    res.status(200).json({
      success: true,
      totalPost,
      data: posts,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Posts.findById(postId)
      .populate({
        path: "user",
        select: "name image -password",
      })
      .populate({
        path: "cat",
        select: "label color",
      });

    const newView = await Views.create({
      user: post?.user,
      post: postId,
    });

    post.views.push(newView?._id);

    await Posts.findByIdAndUpdate(postId, post);

    res.status(200).json({
      success: true,
      message: "Thành công",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
export const getPopularContents = async (req, res, next) => {
  try {
    const posts = await Posts.aggregate([
      {
        $match: {
          status: true,
        },
      },
      {
        $project: {
          title: 1,
          slug: 1,
          img: 1,
          cat: 1,
          views: { $size: "$views" },
          createdAt: 1,
        },
      },
      {
        $sort: { views: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const writers = await Users.aggregate([
      {
        $match: {
          accountType: { $ne: "User" },
        },
      },
      {
        $project: {
          name: 1,
          image: 1,
          followers: { $size: "$followers" },
        },
      },
      {
        $sort: { followers: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Thành công",
      data: { posts, writers },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const postComments = await Comments.find({ post: postId })
      .populate({
        path: "user",
        select: "name image -password",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      sucess: true,
      message: "Thành công",
      data: postComments,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const commentPost = async (req, res, next) => {
  try {
    const { desc } = req.body;
    const { userId } = req.body.user;
    const { id } = req.params;

    if (desc === null) {
      return res.status(404).json({ message: "Nội dung là bắt buộc." });
    }

    const newComment = new Comments({ desc, user: userId, post: id });

    await newComment.save();

    //updating the post with the comments id
    const post = await Posts.findById(id);

    post.comments.push(newComment._id);

    const updatedPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.status(201).json({
      success: true,
      message: "Bình luận bài viết thành công",
      newComment,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const deletePost = async (req, res, next) => {
  // Admin Only can delete post
  try {
    // const { userId } = req.bosy.user;
    const { id } = req.params;

    await Posts.findOneAndDelete({ _id: id });

    // Delete comments
    await Comments.deleteMany({ post: id });
    res.status(200).json({
      success: true,
      message: "Đã xoá thành công bài viết",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id, postId } = req.params;

    await Comments.findByIdAndDelete(id);

    //removing comment id from post
    const result = await Posts.updateOne(
      { _id: postId },
      { $pull: { comments: id } }
    );

    if (result.modifiedCount > 0) {
      res
        .status(200)
        .json({ success: true, message: "Xóa bình luận thành công" });
    } else {
      res
        .status(404)
        .json({ message: "Không tìm thấy bài viết hoặc bình luận" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const stats = async (req, res, next) => {
  try {
    const { query } = req.query;

    const numofDays = Number(query) || 28;

    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - numofDays);

    const totalPosts = await Posts.find({
      createdAt: { $gte: startDate, $lte: currentDate },
    }).countDocuments();

    const totalTrips = await Trips.find({
      createdAt: { $gte: startDate, $lte: currentDate },
    }).countDocuments();

    const totalUsers = await Users.find({
      createdAt: { $gte: startDate, $lte: currentDate },
    }).countDocuments();

    const totalOrder = await Order.aggregate([
      {
        $match: { createdAt: { $gte: startDate, $lte: currentDate } },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalPrice",
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    const postStats = await Posts.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          Total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const paymentStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: currentDate },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: "$payments", // Nhóm theo phương thức thanh toán (VNPAY hoặc STRIPE)
          Total: { $sum: "$totalPrice" }, // Tính tổng giá tiền của các đơn hàng
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id", // Đổi tên _id thành name
          value: "$Total", // Đổi tên Total thành value
        },
      },
    ]);

    const tripsStats = await Trips.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          Total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const orderStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: currentDate },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          Total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const last5Trips = await Trips.find()
      .populate({
        path: "user",
        select: "-password",
      })
      .limit(5)
      .sort({ createdAt: -1 });

    const last5Orders = await Order.find({ paymentStatus: "paid" })
      .populate({
        path: "user",
        select: "-password",
      })
      .sort({ createdAt: -1 })
      .limit(5);

    const top5UsersByPoints = await Users.find().sort({ points: -1 }).limit(5);

    const last5Posts = await Posts.find()
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "cat",
        select: "label color",
      })
      .limit(5)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Dữ liệu thống kê được tải thành công",
      totalPosts,
      totalTrips,
      totalUsers,
      totalOrder: totalOrder[0].total,
      orderStats,
      postStats,
      tripsStats,
      paymentStats,
      last5Trips,
      last5Orders,
      last5Posts,
      top5UsersByPoints,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getFollowers = async (req, res, next) => {
  const { userId } = req.body.user;

  try {
    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const result = await Users.findById(userId).populate({
      path: "followers",
      options: { sort: { _id: -1 }, limit: limit, skip: skip },
      populate: {
        path: "followerId",
        select: "-password",
      },
    });

    const totalFollowers = await Users.findById(userId);

    const numOgPages = Math.ceil(totalFollowers?.followers?.length / limit);

    res.status(200).json({
      data: result?.followers,
      total: totalFollowers?.followers?.length,
      numOgPages,
      page,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getPostContent = async (req, res, next) => {
  try {
    let queryResult = Posts.find()
      .sort({
        _id: -1,
      })
      .populate({
        path: "cat",
        select: "label color",
      })
      .populate({
        path: "user",
        select: "-password",
      });

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //records count
    const totalPost = await Posts.countDocuments();
    const numOfPage = Math.ceil(totalPost / limit);

    queryResult = queryResult.skip(skip).limit(limit);
    const posts = await queryResult;

    res.status(200).json({
      success: true,
      message: "Nội dung bài viết được tải thành công",
      totalPost,
      data: posts,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getMyPost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    let queryResult = Posts.find({ user: userId })
      .sort({
        _id: -1,
      })
      .populate({
        path: "cat",
        select: "label color",
      });

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    //records count
    const totalPost = await Posts.countDocuments({ user: userId });
    const numOfPage = Math.ceil(totalPost / limit);

    queryResult = queryResult.skip(skip).limit(limit);

    const posts = await queryResult;

    res.status(200).json({
      success: true,
      message: "Nội dung bài viết được tải thành công",
      totalPost,
      data: posts,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getOneFollower = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await Users.findById(id).populate({
      path: "followers",
      select: "followerId",
      options: { sort: { _id: -1 } },
      populate: {
        path: "followerId",
        select:
          "name email image accountType followers updatedAt updatedAt -password",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteFollower = async (req, res, next) => {
  try {
    const { id, writerId } = req.params;

    // Xóa bản ghi trong bảng Followers dựa vào id
    await Followers.findByIdAndDelete(id);

    // Xóa followerId khỏi mảng followers trong bảng Users
    const updatedUser = await Users.findByIdAndUpdate(
      writerId,
      {
        $pull: { followers: id },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Xóa người theo dõi thành công",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const deleteClientComment = async (req, res, next) => {
  try {
    const { id, postId } = req.params;

    await Comments.findByIdAndDelete(id);

    //removing comment id from post
    const result = await Posts.updateOne(
      { _id: postId },
      { $pull: { comments: id } }
    );

    if (result.modifiedCount > 0) {
      res
        .status(200)
        .json({ success: true, message: "Xóa bình luận thành công" });
    } else {
      res
        .status(404)
        .json({ message: "Không tìm thấy bài viết hoặc bình luận" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
