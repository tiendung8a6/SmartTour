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
                <h2 className="mb-2 text-[40px] font-bold leading-none text-black sm:text-[80px] md:text-[100px] whitespace-nowrap">
                  THÀNH CÔNG
                </h2>
                <h4 className="mb-3 text-[22px] font-bold leading-tight text-black">
                  Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
                </h4>
                <p className="mb-8 text-lg text-black">
                  Giao dịch của bạn đã hoàn tất.
                </p>
                <Link
                  to="/"
                  className="inline-block rounded-lg border border-black bg-gray-100 px-8 py-3 text-center text-base font-semibold text-black transition hover:bg-gray-200 hover:text-primary"
                >
                  Quay về trang chủ
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-0 top-0 -z-10 flex h-full w-full items-center justify-between space-x-5 md:space-x-8 lg:space-x-14">
          <div className="h-full w-1/3 bg-gradient-to-t from-[#4063727c] to-[#C4C4C400]"></div>
          <div className="flex h-full w-1/3">
            <div className="h-full w-1/2 bg-gradient-to-b from-[#4c648065] to-[#C4C4C400]"></div>
            <div className="h-full w-1/2 bg-gradient-to-t from-[#47508070] to-[#C4C4C400]"></div>
          </div>
          <div className="h-full w-1/3 bg-gradient-to-b from-[#42467b37] to-[#C4C4C400]"></div>
        </div>
      </section>
    </>
  );
};

export default Success;
