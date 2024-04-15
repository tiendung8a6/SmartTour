import Markdown from "markdown-to-jsx";
import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";

const TripCard = ({ trip, index }) => {
  const startDate = new Date(trip?.startDate);
  const endDate = new Date(trip?.endDate);

  // Tính số ngày từ startDate đến endDate
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div
      key={trip?._id}
      className={`w-full flex flex-col gap-8 items-center rounded 
     md:flex-row
        `}
      //  ${index / 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}
    >
      <Link
        to={`/trip/${trip._id}`}
        className="w-full h-auto md:h-64 md:w-2/4 "
      >
        <img
          src={trip?.image}
          alt={trip?.tripName}
          className="object-cover w-full h-full rounded"
        />
      </Link>

      <div className="w-full md:w-2/4 flex flex-col gap-3">
        <h6 className="text-xl 2xl:text-3xl font-semibold text-black dark:text-white text-justify">
          {trip?.tripName.slice(0, 60) + "..."}
        </h6>
        <div className="flex-1 overflow-hidden text-gray-600 dark:text-slate-500 text-sm text-justify">
          <Markdown options={{ wrapper: "article" }}>
            {trip?.city?.slice(0, 60) + "..."}
          </Markdown>
        </div>

        <div className="flex gap-2">
          <span className="text-sm text-gray-600">
            {new Date(trip?.startDate).toLocaleDateString("vi-VN")} -
            {new Date(trip?.endDate).toLocaleDateString("vi-VN")} (
            {diffDays === 0 ? "1 ngày" : `${diffDays} ngày`})
          </span>
        </div>

        <Link
          to={`/trip/${trip._id}`}
          className="flex items-center gap-2 text-black dark:text-white"
        >
          <span className="underline">Chỉnh sửa chuyến đi</span>
          <AiOutlineArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default TripCard;
