import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../utils/dummyData";
import moment from "moment";

const PopularPosts = ({ posts }) => {
  const Card = ({ post }) => {
    let catColor = "";
    let catLabel = "";
    CATEGORIES.map((cat) => {
      if (cat._id === post?.cat) {
        catColor = cat?.color;
        catLabel = cat?.label;
      }
      return null;
    });

    return (
      <div className="flex gap-2 items-center">
        <img
          src={post?.img}
          alt={post?.user?.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="w-full flex flex-col gap-1">
          <span
            style={{ backgroundColor: `${catColor}` }}
            className="w-fit rounded-full px-2 py-0.5 text-white text-[12px] 2xl:text-sm"
          >
            {catLabel}
          </span>
          <Link
            to={`/blog/${post?.slug}/${post?._id}`}
            className="text-black dark:text-white text-justify"
          >
            {post?.title.slice(0, 80) + "..."}
          </Link>
          <div className="flex gap-2 text-sm">
            <span className="font-medium">{post?.user?.name}</span>
            <span className="text-gray-700 dark:text-slate-400">
              Ngày {moment(post?.createdAt).format("LL")}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <p className="text-xl font-bold -mb-3 text-gray-700 dark:text-slate-200">
        Các bài viết phổ biến
      </p>
      {posts?.map((post, id) => (
        <Card post={post} key={id} />
      ))}
    </div>
  );
};

export default PopularPosts;
