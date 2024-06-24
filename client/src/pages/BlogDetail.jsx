import Markdown from "markdown-to-jsx";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PopularPosts, PopularWriters, PostComments } from "../components";
import { usePopularPost } from "../hooks/post_hooks";
import useStore from "../store";
import { getSinglePost } from "../utils/apiCalls";
import moment from "moment";

const BlogDetail = () => {
  const { setIsLoading } = useStore();

  const { id } = useParams();
  const [post, setPost] = useState(null);
  const popular = usePopularPost();

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const data = await getSinglePost(id);

      setPost(data || []);
    } catch (error) {
      console.error("Error fetching post or popular content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [id]);

  if (!post)
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-xl text-slate-500">Đang tải...</span>
      </div>
    );

  return (
    <div className="w-full  px-0 md:px-10 py-8 2xl:px-20">
      <div className="w-full flex flex-col-reverse md:flex-row gap-2 gap-y-5 items-center">
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white">
            {post?.title}
          </h1>

          <div className="w-full flex items-center ">
            <span className="flex-1 text-sky-600 font-semibold">
              {post?.cat?.label}
            </span>

            <span className="flex flex-1 items-baseline text-2xl font-medium text-slate-700 dark:text-gray-300">
              {post?.views?.length}
              <span className="pl-2 text-base text-sky-600"> Lượt xem</span>
            </span>
          </div>

          <Link to={`/blog/writer/${post?.user?._id}`} className="flex gap-3">
            <img
              src={post?.user?.image}
              alt={post?.user?.name}
              className="object-cover w-12 h-12  rounded-full"
            />
            <div className="">
              <p className="text-slate-800 dark:text-white font-medium">
                {post?.user?.name}
              </p>
              <span className="text-slate-600 dark:text-gray-400">
                Ngày {moment(post?.createdAt).format("LL")}
              </span>
            </div>
          </Link>
        </div>
        <img
          src={post?.img}
          alt={post?.title}
          className="w-full md:w-1/2 h-auto md:h-[360px] 2xl:h-[460px] rounded object-contain"
        />
      </div>

      <div className="w-full flex flex-col md:flex-row gap-10 2xl:gap-x-28 mt-10">
        {/* LEFT */}
        <div className="w-full md:w-2/3 flex flex-col text-black dark:text-gray-200">
          {post?.desc && (
            <Markdown
              options={{ wrapper: "article" }}
              className="leading-[3rem] text-base 2xl:text-[20px]"
            >
              {post?.desc}
            </Markdown>
          )}

          {/* COMMENTS SECTION */}
          <div className="w-full">{<PostComments postId={id} />}</div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/4 flex flex-col gap-y-12">
          {/* POPULAR POSTS */}
          <PopularPosts posts={popular?.posts} />

          {/* POPULAR WRITERS */}
          <PopularWriters data={popular?.writers} />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
