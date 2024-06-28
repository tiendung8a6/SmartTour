import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
      <div className="relative flex flex-col py-16 lg:pt-0 lg:flex-col lg:pb-0">
        <div className="flex flex-col items-start w-full max-w-xl px-4 mx-auto lg:px-8 lg:max-w-screen-xl">
          <div className="mb-16 lg:my-40 lg:max-w-lg lg:pr-5">
            <div className="max-w-xl mb-6">
              <div>
                <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-400">
                  Xin chào
                </p>
              </div>
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none dark:text-white">
                Cùng SmartTour,
                <br className="hidden md:block" />
                khám phá thế giới
                <span className="inline-block text-deep-purple-accent-400 dark:text-white">
                  một cách thông minh
                </span>
              </h2>
              <p className="text-base text-gray-700 md:text-lg dark:text-gray-300">
                Lên kế hoạch và tổ chức lịch trình du lịch không còn là vấn đề
                mất thời gian với SmartTour. Hệ thống tối ưu hóa và đề xuất lịch
                trình du lịch hiệu quả, giúp dễ dàng tạo và tùy chỉnh các lịch
                trình du lịch cá nhân hoặc nhóm một cách thông minh và tiện lợi.
              </p>
            </div>
            <div className="flex flex-col items-center md:flex-row">
              <Link
                to="/trip"
                className="inline-flex items-center justify-center w-full h-12 px-6 mb-3 font-medium tracking-wide text-white bg-sky-500	 transition duration-200 rounded shadow-md md:w-auto md:mr-4 md:mb-0 bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
              >
                Tham gia ngay
              </Link>
              <Link
                to="/policy"
                className="inline-flex items-center font-semibold text-gray-800 transition-colors duration-200 hover:text-deep-purple-accent-700 dark:text-white"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
        <div className="inset-y-0 right-0 w-full max-w-xl px-4 mx-auto lg:pl-8 lg:pr-0 lg:mb-0 lg:mx-0 lg:w-1/2 lg:max-w-full lg:absolute xl:px-0">
          <img
            className="object-cover w-full h-56 rounded shadow-lg lg:rounded-none lg:shadow-none sm:h-96 lg:h-full"
            src="https://www.anlamtravel.vn/storage/pagedata/100921/img/images/menu/2_1.jpg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Hero;
