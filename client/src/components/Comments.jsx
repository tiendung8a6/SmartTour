import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Profile from "../assets/profile.png";
import useStore from "../store";
import {
  deleteComment,
  getPostComments,
  postComments,
} from "../utils/apiCalls";
import Button from "./Button";
import moment from "moment";
import "moment/locale/vi";

const PostComments = ({ postId }) => {
  moment.updateLocale("vi", {
    relativeTime: {
      future: "trong %s",
      past: "%s trước",
      s: "vài giây",
      ss: "%d giây",
      m: "1 phút",
      mm: "%d phút",
      h: "1 giờ",
      hh: "%d giờ",
      d: "1 ngày",
      dd: "%d ngày",
      M: "1 tháng",
      MM: "%d tháng",
      y: "1 năm",
      yy: "%d năm",
    },
  });
  moment.locale("vi");

  const { user } = useStore();
  const [comments, setComments] = useState([]);
  const [desc, setDesc] = useState("");

  const fetchComments = async () => {
    const res = await getPostComments(postId);
    setComments(res);
  };

  const handlePostComment = async (e) => {
    e.preventDefault();

    const res = await postComments(postId, user?.token, {
      desc,
    });

    if (res?.success === true) {
      setDesc("");
      fetchComments();

      toast.success("Bình luận bài viết thành công");
    } else {
      toast.error("Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại");
    }
  };

  const handleDeleteComment = async (id) => {
    const res = await deleteComment(id, user?.token, postId);

    if (res?.success === true) {
      fetchComments();
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="w-full py-10">
      <p className="text-lg text-slate-700 dark:text-slate-400 mb-6">
        Bình luận bài viết
      </p>

      {user?.token ? (
        <form className="flex flex-col mb-6" onSubmit={handlePostComment}>
          <textarea
            name="desc"
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            required={true}
            placeholder="Nhập bình luận..."
            className="dark:text-gray-300 bg-transparent w-full p-2 border border-gray-300 focus:outline-none focus:border-blue-600  focus:ring-blue-600 rounded"
          ></textarea>

          <div className="w-full flex justify-end mt-2">
            <Button
              type={"submit"}
              onClick={() => {}}
              label="Bình luận"
              styles="bg-blue-600 text-white py-2 px-5 rounded"
            />
          </div>
        </form>
      ) : (
        <Link to="/sign-in" className="flex flex-col py-10 ">
          <Button
            label="Đăng nhập để bình luận"
            styles="flex items-center justify-center bg-white dark:bg-transparent text-black dark:text-gray-400 px-4 py-1.5 rounded-full border"
          />
        </Link>
      )}

      <div className="w-full h-full flex flex-col gap-10 2xl:gap-y-14 px-2 ">
        {comments?.length === 0 ? (
          <span className="text-base text-slate-600 dark:text-gray-300">
            Chưa có bình luận nào, hãy là người đầu tiên bình luận
          </span>
        ) : (
          comments?.map((el) => (
            <div key={el?._id} className="w-full flex gap-4 items-start ">
              <img
                src={el?.user?.image || Profile}
                alt={el?.user?.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="w-full -mt-2">
                <div className="w-full flex items-center gap-2">
                  <p className="text-slate-700 dark:text-gray-300 font-medium">
                    {el?.user?.name}
                  </p>
                  <span className="text-slate-700  dark:text-gray-400 text-xs italic">
                    {moment(el?.createdAt).fromNow()}
                  </span>
                </div>

                <div className="flex flex-col gap-2 dark:text-gray-400">
                  <span className="text-sm">{el?.desc}</span>

                  {user?.user?._id === el?.user?._id && (
                    <span
                      className="text-base text-red-600 dark:text-red-500 cursor-pointer"
                      onClick={() => handleDeleteComment(el?._id)}
                    >
                      Xóa
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Toaster richColors />
    </div>
  );
};

export default PostComments;
