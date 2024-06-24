import React from "react";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <>
      <section className="relative z-10 bg-primary h-[90vh] flex items-center justify-center">
        <div className="container mx-auto">
          <div className="-mx-4 flex">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[800px] text-center">
                <h2 className=" dark:text-white mb-2 text-[40px] font-bold leading-none text-black sm:text-[80px] md:text-[100px] whitespace-nowrap">
                  THÀNH CÔNG
                </h2>
                <h4 className=" dark:text-white mb-3 text-[22px] font-bold leading-tight text-black">
                  Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
                </h4>
                <p className=" dark:text-gray-300 mb-8 text-lg text-black">
                  Giao dịch của bạn đã hoàn tất.
                </p>
                <Link
                  to="/"
                  className="dark:text-sky-50 dark:bg-sky-600 inline-block rounded-lg border border-black bg-gray-100 px-8 py-3 text-center text-base font-semibold text-black transition hover:bg-gray-200 hover:text-primary"
                >
                  Quay về trang chủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Success;
