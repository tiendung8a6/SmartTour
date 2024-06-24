import React from "react";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="flex items-center flex-col justify-center lg:flex-row py-28 px-6 md:px-24 md:py-20 lg:py-30 gap-16 lg:gap-28">
      <div className="w-full lg:w-1/2">
        <img
          className="hidden lg:block"
          src="https://i.ibb.co/v30JLYr/Group-192-2.png"
          alt="Giao dịch thất bại"
        />
      </div>
      <div className="w-full lg:w-1/2">
        <h1 className="py-4 text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
          Rất tiếc! Giao dịch của bạn không thể hoàn tất
        </h1>
        <p className="py-4 text-base text-gray-800 text-justify dark:text-gray-400">
          Đã xảy ra lỗi trong quá trình xử lý. Có thể do vấn đề với phương thức
          thanh toán của bạn hoặc sự cố tạm thời.
        </p>
        <p className="py-2 text-base text-gray-800 text-justify dark:text-gray-400">
          Chúng tôi xin lỗi vì sự bất tiện này! Vui lòng thử lại hoặc truy cập
          trang liên hệ của chúng tôi để được trợ giúp thêm.
        </p>
        <button className="w-full lg:w-auto my-4 font-bold text-lg border rounded-md px-1 sm:px-16 py-5 bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:ring-opacity-50">
          <Link to="/">Quay về trang chủ</Link>
        </button>
      </div>
    </div>
  );
};

export default Cancel;
