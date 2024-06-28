import React from "react";
import { Link } from "react-router-dom";

const Stats = () => {
  return (
    <>
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-gray-800 text-3xl font-semibold sm:text-4xl dark:text-white">
            Khách hàng của chúng tôi luôn hài lòng
          </h3>
          <p className="mt-3 dark:text-gray-300">
            SmartTour luôn đặt sự hài lòng của khách hàng lên hàng đầu, điều này
            được thể hiện qua sự tin tưởng và phản hồi tích cực từ phía họ.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-full bg-teal-accent-400 sm:w-12 sm:h-12">
              <svg
                className="w-8 h-8 text-teal-900 sm:w-10 sm:h-10 dark:text-sky-500"
                stroke="currentColor"
                viewBox="0 0 52 52"
              >
                <polygon
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  points="29 13 14 29 25 29 23 39 38 23 27 23"
                />
              </svg>
            </div>
            <h6 className="text-4xl font-bold text-deep-purple-accent-400">
              765
            </h6>
            <p className="mb-2 font-bold text-md">Lượt truy cập</p>
            <p className="text-gray-700 dark:text-gray-400">
              SmartTour mang lại cho người dùng những trải nghiệm tuyệt vời nhất
              với số lượng truy cập đáng kinh ngạc.
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-full bg-teal-accent-400 sm:w-12 sm:h-12">
              <svg
                className="w-8 h-8 text-teal-900 sm:w-10 sm:h-10 dark:text-sky-500"
                stroke="currentColor"
                viewBox="0 0 52 52"
              >
                <polygon
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  points="29 13 14 29 25 29 23 39 38 23 27 23"
                />
              </svg>
            </div>
            <h6 className="text-4xl font-bold text-deep-purple-accent-400">
              300
            </h6>
            <p className="mb-2 font-bold text-md">Người dùng</p>
            <p className="text-gray-700 dark:text-gray-400">
              SmartTour thu hút một lượng lớn người dùng với giao diện thân
              thiện và dễ sử dụng.
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-full bg-teal-accent-400 sm:w-12 sm:h-12">
              <svg
                className="w-8 h-8 text-teal-900 sm:w-10 sm:h-10 dark:text-sky-500"
                stroke="currentColor"
                viewBox="0 0 52 52"
              >
                <polygon
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  points="29 13 14 29 25 29 23 39 38 23 27 23"
                />
              </svg>
            </div>
            <h6 className="text-4xl font-bold text-deep-purple-accent-400">
              91
            </h6>
            <p className="mb-2 font-bold text-md">Bài viết</p>
            <p className="text-gray-700 dark:text-gray-400">
              SmartTour ngày càng thu hút nhiều bài viết từ người dùng cho những
              chia sẻ hữu ích đến những trải nghiệm độc đáo và đầy cảm xúc.
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-full bg-teal-accent-400 sm:w-12 sm:h-12">
              <svg
                className="w-8 h-8 text-teal-900 sm:w-10 sm:h-10 dark:text-sky-500"
                stroke="currentColor"
                viewBox="0 0 52 52"
              >
                <polygon
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  points="29 13 14 29 25 29 23 39 38 23 27 23"
                />
              </svg>
            </div>
            <h6 className="text-4xl font-bold text-deep-purple-accent-400">
              52
            </h6>
            <p className="mb-2 font-bold text-md">Điểm đến </p>
            <p className="text-gray-700 dark:text-gray-400">
              SmartTour cung cấp cho người dùng một loạt các địa điểm du lịch đa
              dạng và phong phú
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stats;
