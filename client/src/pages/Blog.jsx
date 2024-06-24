import React from "react";
import { Link } from "react-router-dom";
import {
  Banner,
  Card,
  Pagination,
  PopularPosts,
  PopularWriters,
} from "../components";
import { usePopularPost, usePosts } from "../hooks/post_hooks";
import { CATEGORIES } from "../utils/dummyData";

const Blog = () => {
  const { posts, numOfPages, setPage } = usePosts({
    writerId: "",
  });
  const popular = usePopularPost();

  const handlePageChange = (val) => {
    setPage(val);
  };

  const randomIndex = Math.floor(Math.random() * posts?.length);

  if (posts?.length < 1)
    return (
      <div className="w-full h-full py-8 flex items-center justify-center dark:text-white">
        <span className="text-lg text-slate-500">Chưa có bài viết</span>
      </div>
    );

  return (
    <div className="py-10 2xl:py-5">
      <Banner post={posts[randomIndex]} />

      <div className="px-0 lg:pl-20 2xl:px-20 ">
        {/* Categories */}
        <div className="mt-6 md:mt-0">
          <p className="text-2xl font-semibold text-gray-600 dark:text-white">
            Danh mục nổi bật
          </p>
          <div className="w-full flex flex-wrap py-10 gap-8">
            {CATEGORIES.map((cat) => (
              <Link
                to={`/blog/category?cat=${cat?._id}`}
                className={`flex items-center justify-center gap-3 border border-gray-400 dark:border-gray-600 rounded-full text-gray-700 dark:text-white font-semibold text-base px-4 py-2 cursor-pointer`}
                key={cat._id}
              >
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Blog Post */}
        <div className="w-full flex flex-col md:flex-row gap-10 2xl:gap-20">
          {/* LEFT */}
          <div className="w-full md:w-2/3 flex flex-col gap-y-28 md:gap-y-14">
            {posts?.map((post, index) => (
              <Card key={post?._id} post={post} index={index} />
            ))}

            <div className="w-full flex items-center justify-center">
              <Pagination
                totalPages={numOfPages}
                onPageChange={handlePageChange}
              />
            </div>
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
    </div>
  );
};

export default Blog;
