import React from "react";
import { Link } from "react-router-dom";

const BlogSections = () => {
  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto md:px-8">
        <div className="items-center gap-x-12 sm:px-4 md:px-0 lg:flex">
          <div className="flex-1 sm:hidden lg:block">
            <img
              src="https://www.shutterstock.com/image-photo/blog-blogging-homepage-social-media-600nw-381746308.jpg"
              className="md:max-w-lg sm:rounded-lg"
              alt=""
            />
          </div>
          <div className="max-w-xl px-4 space-y-3 mt-6 sm:px-0 md:mt-0 lg:max-w-2xl">
            <h3 className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-400">
              Chia sẽ trải nghiệm
            </h3>
            <p className="text-gray-800 text-3xl font-semibold sm:text-4xl dark:text-white">
              Chia sẻ những kinh nghiệm đáng giá từ cộng đồng của chúng tôi
            </p>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Chúng tôi tạo ra nơi cho bạn để chia sẻ và khám phá những câu
              chuyện thú vị từ cộng đồng. Hãy cùng nhau tìm hiểu về những trải
              nghiệm đặc biệt, những địa điểm mới, và những lời khuyên hữu ích
              khi du lịch.
            </p>
            <Link
              to="/blog"
              className="inline-flex gap-x-1 items-center text-indigo-600 hover:text-indigo-500 duration-150 font-medium dark:text-indigo-400"
            >
              Khám Phá
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSections;
