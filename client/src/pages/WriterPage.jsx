import React, { useEffect, useState } from "react";
import { FaUserCheck } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Profile from "../assets/profile.png";
import {
  Button,
  Card,
  Pagination,
  PopularPosts,
  PopularWriters,
} from "../components";
import { usePopularPost, usePosts } from "../hooks/post_hooks";
import useStore from "../store";
import { formatNumber } from "../utils";
import { followWriter, getWriterInfo } from "../utils/apiCalls";

const WriterPage = () => {
  const { user } = useStore();
  const { id } = useParams();
  const [writer, setWriter] = useState(null);

  const { posts, numOfPages, setPage } = usePosts({
    writerId: id,
  });
  const popular = usePopularPost();

  const handlePageChange = (page) => {
    setPage(page);
  };

  const fetchWriter = async () => {
    try {
      const res = await getWriterInfo(id);

      setWriter(res || null);
    } catch (error) {
      console.error("Error fetching writer or popular content:", error);
    }
  };

  const handleFollow = async () => {
    const res = await followWriter(id, user?.token);

    if (res?.success === true) {
      await fetchWriter();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchWriter();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };

    fetchData();
  }, [id]);

  const followerIds = writer?.followers?.map((f) => f?.followerId);

  if (!writer)
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-lg text-slate-500">Không tìm thấy tác giả</span>
      </div>
    );

  return (
    <div className="px-0 2xl:px-20 ">
      <div className="w-full md:h-60 flex flex-col gap-5 items-center md:flex-row bg-gradient-to-r from-sky-800 via-cyan-700 to-indigo-500 dark:bg-gradient-to-r dark:from-[#020b19] dark:via-[#071b3e] dark:to-[#020b19]  mt-5 mb-10 rounded-md p-5 md:px-20">
        <img
          src={writer?.image || Profile}
          alt="Writer"
          className="w-48 h-48 rounded-full border-4 border-slate-400 object-cover"
        />
        <div className="w-full h-full flex flex-col gap-y-5 md:gap-y-8  items-center justify-center">
          <h2 className="text-white text-4xl 2xl:text-5xl font-bold">
            {writer?.name}
          </h2>

          <div className="flex gap-10">
            <div className="flex flex-col items-center">
              <p className="text-gray-200 text-2xl font-semibold">
                {formatNumber(writer?.followers?.length ?? 0)}
              </p>
              <span className="text-gray-300">Người theo dõi</span>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-gray-200 text-2xl font-semibold">
                {formatNumber(posts?.length ?? 0)}
              </p>
              <span className="text-gray-300">Bài đăng</span>
            </div>
          </div>

          {user?.token && id !== user.user._id && (
            <div>
              {!followerIds?.includes(user?.user?._id) ? (
                <Button
                  label="Theo dõi"
                  onClick={() => handleFollow()}
                  styles="text-slate-800 text-semibold md:-mt-4 px-6 py-1 rounded-full bg-white"
                />
              ) : (
                <div className="flex items-center justify-center gap-2 text-white text-semibold md:-mt-4 px-6 py-1 rounded-full border">
                  <span>Đã theo dõi</span>
                  <FaUserCheck />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-10 2xl:gap-20">
        {/* LEFT */}
        <div className="w-full md:w-2/3 flex flex-col gap-y-28 md:gap-y-14">
          {posts?.length === 0 ? (
            <div className="w-full h-full py-8 flex  justify-center">
              <span className="text-lg text-slate-500">Không có bài đăng</span>
            </div>
          ) : (
            <>
              {posts?.map((post, index) => (
                <Card key={post?._id + index} post={post} />
              ))}

              <div className="w-full flex items-cemter justify-center">
                <Pagination
                  totalPages={numOfPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
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

export default WriterPage;
