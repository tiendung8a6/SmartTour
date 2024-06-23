import Markdown from "markdown-to-jsx";
import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import moment from "moment";

const Card = ({ post, index }) => {
  return (
    <div
      key={post?._id}
      className={`w-full flex flex-col gap-8 items-center rounded 
     md:flex-row
        `}
      //  ${index / 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}
    >
      <Link
        to={`/blog/${post?.slug}/${post._id}`}
        className="w-full h-auto md:h-64 md:w-2/4 "
      >
        <img
          src={post?.img}
          alt={post?.title}
          className="object-cover w-full h-full rounded"
        />
      </Link>

      <div className="w-full md:w-2/4 flex flex-col gap-3">
        <div className="flex gap-2">
          <span className="text-sm text-gray-600 dark:text-slate-400">
            Ngày {moment(post?.createdAt).format("LL")}
          </span>
          <span
            style={{ backgroundColor: `${post?.cat?.color}` }}
            className="w-fit rounded-full px-2 py-0 text-white text-[12px] 2xl:text-sm"
          >
            {post?.cat?.label}
          </span>
        </div>

        <h6 className="text-xl 2xl:text-3xl font-semibold text-black dark:text-white text-justify">
          {post?.title.slice(0, 60) + "..."}
        </h6>

        <div className="flex-1 overflow-hidden text-gray-600 dark:text-gray-400 text-sm text-justify">
          <Markdown options={{ wrapper: "article" }}>
            {post?.desc?.slice(0, 200) + "..."}
          </Markdown>
        </div>

        <Link
          to={`/blog/${post?.slug}/${post._id}`}
          className="flex items-center gap-2 text-black dark:text-white"
        >
          <span className="underline">Đọc thêm</span> <AiOutlineArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Card;
