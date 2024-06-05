import express from "express";
import {
  commentPost,
  createPost,
  deleteComment,
  deletePost,
  getComments,
  getFollowers,
  getPopularContents,
  getPost,
  getPostContent,
  getPosts,
  stats,
  updatePost,
  updatePostStatus,
  getOneFollower,
  deleteFollower,
  getMyPost,
  deleteClientComment,
} from "../controllers/postController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN ROUTES
router.post("/admin-analytics", userAuth, stats); //Thống kê
router.post("/admin-followers", userAuth, getFollowers);
router.post("/admin-content", userAuth, getPostContent);
router.post("/client-content", userAuth, getMyPost);

router.post("/create-post", userAuth, createPost);

// LIKE & COMMENT ON POST
router.post("/comment/:id", userAuth, commentPost);

// UPDATE POST
router.patch("/update-status/:id", userAuth, updatePostStatus);
router.patch("/update/:id", userAuth, updatePost);

// GET POSTS ROUTES
router.get("/", getPosts);
router.get("/popular", getPopularContents);
router.get("/:postId", getPost);
router.get("/comments/:postId", getComments);

// DELETE POSTS ROUTES
router.delete("/:id", userAuth, deletePost);
router.delete("/comment/:id/:postId", userAuth, deleteComment);
router.delete("/comment/client/:id/:postId", deleteClientComment); //Ko xác thực đăng nhập

router.post("/follower/:id", getOneFollower);
router.delete("/follower/:id/:writerId", userAuth, deleteFollower);

export default router;
