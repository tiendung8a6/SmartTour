import React, { useState } from "react";
import { Link } from "react-router-dom";

const Feature2 = () => {
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-arrows-shuffle"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M18 4l3 3l-3 3" />
          <path d="M18 20l3 -3l-3 -3" />
          <path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" />
          <path d="M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3" />
        </svg>
      ),
      title: "Chi Tiết và Linh Hoạt",
      desc: "Tổ chức mọi thứ một cách cẩn thận và linh hoạt, từ việc lựa chọn hoạt động phù hợp cho đến các lời khuyên về thời gian thích hợp và những điều cần biết khi đi du lịch.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-binary-tree-2"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M14 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" />
          <path d="M7 14a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" />
          <path d="M21 14a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" />
          <path d="M14 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" />
          <path d="M12 8v8" />
          <path d="M6.316 12.496l4.368 -4.992" />
          <path d="M17.684 12.496l-4.366 -4.99" />
        </svg>
      ),
      title: "Thông Tin Đa Dạng",
      desc: "Nguồn thông tin đa dạng và phong phú. Từ những địa điểm tham quan lịch sử đến những quán ăn địa phương ngon miệng, từ cửa hàng mua sắm độc đáo đến những lời khuyên hữu ích.",
    },
  ];

  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 text-gray-600 gap-16 justify-between md:px-8 lg:flex">
        <div>
          <div className="max-w-xl space-y-3">
            <h3 className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-400">
              Tính năng
            </h3>
            <p className="text-gray-800 text-3xl font-semibold sm:text-4xl dark:text-gray-50">
              Lập Kế Hoạch Thông Minh với Trợ Lý Ảo
            </p>
            <p className="dark:text-gray-300">
              Tính năng Lập Kế Hoạch với Trợ Lý Ảo giúp tận hưởng hành trình một
              cách suôn sẻ và không bao giờ bỏ lỡ những điều thú vị dọc đường.
              Hãy để Trợ Lý Ảo dẫn đường và tạo ra kế hoạch tuyệt vời cho bạn.
            </p>
          </div>
          <div className="pt-4">
            <Link
              className="group px-4 py-2 text-indigo-600 font-medium bg-indigo-50 rounded-full inline-flex items-center"
              to="/travel-guide"
            >
              Khám phá ngay
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 ml-1 duration-150 group-hover:translate-x-"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
          <div className="mt-12 max-w-lg lg:max-w-none">
            <ul className="space-y-8">
              {features.map((item, idx) => (
                <li key={idx} className="flex gap-x-4">
                  <div className="flex-none w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg text-gray-800 font-semibold dark:text-sky-500">
                      {item.title}
                    </h4>
                    <p className="mt-3 dark:text-gray-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 lg:mt-0">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/smarttour-mern.appspot.com/o/1719545462962Screenshot%202024-06-28%20103042.png?alt=media&token=573ae5ab-4313-4d49-b4d6-eac9de1c469d"
            alt="AI hỗ trợ"
            className="w-full shadow-lg rounded-lg border"
          />
        </div>
      </div>
    </section>
  );
};

export default Feature2;
