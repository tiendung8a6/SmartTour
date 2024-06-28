import React from "react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  return (
    <div className="justify-center items-center px-2 py-4 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
        <div className="flex flex-col mb-16 sm:text-center sm:mb-0">
          <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
            <h2 className="max-w-lg dark:text-white mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
              Du lịch mọi nơi với gói đăng kí phù hợp
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 md:text-lg">
              Mua các gói Bạc, Vàng, Kim Cương để nhận ngay điểm, mở rộng quyền
              truy cập và tận hưởng đặc quyền độc đáo trong cộng đồng.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch md:grid-cols-3 md:gap-8">
        <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 sm:px-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-sky-500">
              Gói Bạc
            </h2>

            <p className="mt-2 text-gray-700 dark:text-gray-400">
              Truy cập kế hoạch của người dùng khác và tham gia cộng đồng với
              các tiện ích cơ bản.
            </p>

            <p className="mt-2 sm:mt-4">
              <strong className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                {formatCurrency(100000)}
              </strong>

              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                /Gói
              </span>
            </p>

            <Link
              className="mt-4 block rounded border border-sky-600 px-12 py-3 text-center text-sm font-medium text-sky-600 dark:hover:text-white focus:outline-none focus:ring active:text-sky-500 sm:mt-6"
              to="/pricing/checkout/silver"
            >
              Mua ngay
            </Link>
          </div>

          <div className="p-6 sm:px-8">
            <p className="text-lg font-medium text-gray-900 sm:text-xl dark:text-gray-100">
              Bao gồm:
            </p>

            <ul className="mt-2 space-y-2 sm:mt-4">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-sky-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  100 Điểm{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-sky-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  Xem kế hoạch công khai{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-sky-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  Email hỗ trợ{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-red-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  Trở thành hội viên{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-red-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  Hỗ trợ 24/7{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-red-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  Nhóm chat hội viên{" "}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="divide-y divide-gray-200 rounded-2xl border-2 border-sky-600 shadow-sm">
          <div className="p-6 sm:px-8">
            <div className="hidden md:block w-32 absolute top-[330px] left-0 right-0 mx-auto px-3 py-2 rounded-full border shadow-md bg-white text-center text-gray-700 text-sm font-semibold">
              Phổ Biến Nhất
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-sky-500">
              Gói Vàng
            </h2>

            <p className="mt-2 text-gray-700 dark:text-gray-400">
              Nâng cao trải nghiệm với ưu tiên và truy cập mở rộng đến nội dung
              và sự kiện cộng đồng.
            </p>

            <p className="mt-2 sm:mt-4">
              <strong className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                {formatCurrency(200000)}
              </strong>

              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                /Gói
              </span>
            </p>

            <Link
              className="mt-4 block rounded border border-sky-600 bg-sky-600 px-12 py-3 text-center text-sm font-medium text-white dark:hover:text-white hover:text-white hover:bg-sky-800 focus:outline-none focus:ring sm:mt-6"
              to="/pricing/checkout/gold"
            >
              Mua ngay
            </Link>
          </div>

          <div className="p-6 sm:px-8">
            <p className="text-lg font-medium text-gray-900 sm:text-xl dark:text-sky-100">
              Bao gồm:
            </p>

            <ul className="mt-2 space-y-2 sm:mt-4">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-sky-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300 ">
                  {" "}
                  200 Điểm
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-sky-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  {" "}
                  Xem kế hoạch công khai{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-sky-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  {" "}
                  Email hỗ trợ{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-sky-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  {" "}
                  Trở thành hội viên{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-red-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  {" "}
                  Hỗ trợ 24/7
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-red-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  {" "}
                  Nhóm chat hội viên{" "}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 sm:px-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-sky-500">
              Gói Kim Cương
            </h2>

            <p className="mt-2 text-gray-700 dark:text-gray-400">
              Trải nghiệm đỉnh cao với mọi đặc quyền và ưu tiên cao cấp nhất
              trong cộng đồng.
            </p>

            <p className="mt-2 sm:mt-4">
              <strong className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                {formatCurrency(300000)}
              </strong>

              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                /Gói
              </span>
            </p>

            <Link
              className="mt-4 block rounded border border-sky-600 px-12 py-3 text-center text-sm font-medium text-sky-600 dark:hover:text-white focus:outline-none focus:ring active:text-sky-500 sm:mt-6"
              to="/pricing/checkout/diamond"
            >
              Mua ngay
            </Link>
          </div>

          <div className="p-6 sm:px-8">
            <p className="text-lg font-medium text-gray-900 sm:text-xl dark:text-gray-100">
              Bao gồm:
            </p>

            <ul className="mt-2 space-y-2 sm:mt-4">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-sky-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  350 Điểm
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-sky-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  {" "}
                  Xem kế hoạch công khai{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-sky-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  {" "}
                  Email hỗ trợ{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-sky-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  {" "}
                  Trở thành hội viên{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-sky-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  {" "}
                  Hỗ trợ 24/7
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-sky-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700 dark:text-gray-300">
                  {" "}
                  Nhóm chat hội viên{" "}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
