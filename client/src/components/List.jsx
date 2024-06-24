import React, { useState, useEffect } from "react";
import MainList from "./MainList";
import Loader from "./Loader";
import { Image } from "@mantine/core";

const List = ({ data, isLoading, child, filter }) => {
  const [elRef, setElRef] = useState([]);

  useEffect(() => {
    const ref = Array(33)
      .fill()
      .map((_, i) => elRef[i] || React.createRef());
    setElRef(ref);
  }, [data]);

  return (
    <div>
      <MainList filter={filter} />
      <div className="" style={{ height: "150vh", overflowY: "hidden" }}>
        {isLoading ? (
          <div className="inset-x-0 top-0">
            <Loader />
          </div>
        ) : (
          <div
            className="px-4 py-2 pt-3 overflow-y-scroll "
            style={{ maxWidth: "100%", height: "100%" }}
          >
            {data && data.length > 0 ? (
              data.map((el, index) => {
                const photo = el.photo ? el.photo : "";
                const img = photo.images ? photo.images : "";
                const newaddress = el.address ? el.address.split(",") : null;

                if (!el.name) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    className="card mb-3 shadow"
                    style={{ width: "100%" }}
                    ref={elRef[index]}
                  >
                    <Detail
                      img={img}
                      newaddress={newaddress}
                      el={el}
                      refProp={elRef[index]}
                      index={index}
                      child={child}
                    />
                  </div>
                );
              })
            ) : (
              <div className="text-center text-xl font-bold text-gray-500 mt-4 dark:text-gray-300">
                500 | Hệ thống hiện đang bảo trì. Vui lòng thử lại sau !
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Detail = ({ el, img, newaddress, child, refProp, index }) => {
  if (index == Number(child)) {
    refProp?.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <div
      className={`flex ${
        index == Number(child) ? "border-b-4 border-blue-500" : ""
      }`}
    >
      <div className="group mx-2 grid max-w-screen-lg grid-cols-1 space-x-8 overflow-hidden rounded-lg border text-gray-700 shadow transition hover:shadow-lg sm:mx-auto sm:grid-cols-5">
        <a
          className="col-span-2 text-left text-gray-700 hover:text-gray-800"
          href={el.web_url}
          target="_blank"
          rel="noreferrer"
        >
          <div className="w-full h-auto md:h-[275px] md:w-1/4 lg:w-[380px] hidden md:block ">
            <Image
              src={img.medium ? img.medium.url : img.small.url}
              alt={"Ảnh địa điểm"}
              className="object-cover w-full md:h-[100%] rounded"
            />
          </div>
        </a>
        <div className="pl-10 col-span-3 flex flex-col space-y-3 pr-8 text-left">
          <a
            className="mt-3 overflow-hidden text-2xl font-semibold hover:text-gray-900 dark:text-white"
            href={el.web_url}
            target="_blank"
            rel="noreferrer"
          >
            {el.name}
          </a>
          <div className="flex text-sm text-gray-600 items-center">
            <span className="flex-shrink-0 mr-1 text-sky-500 flex items-center">
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
                className="inline h-4 w-4 icon icon-tabler icons-tabler-outline icon-tabler-map-pin"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
              </svg>
            </span>
            <span className="dark:text-gray-400">
              {el.address ? el.address : "Đang cập nhật"}.{" "}
            </span>
          </div>

          <div className="flex text-sm text-gray-600 items-center">
            <span className="flex-shrink-0 mr-1 text-sky-500 flex items-center">
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
                className="inline h-4 w-4 icon icon-tabler icons-tabler-outline icon-tabler-phone"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
              </svg>
            </span>
            <span className="dark:text-gray-400">
              {el.phone ? el.phone : "Đang cập nhật"}
            </span>
          </div>

          <div className="text-sm text-gray-600" href="#">
            <span className="font-semibold text-gray-500 dark:text-gray-200">
              Xếp hạng:{" "}
            </span>
            <span className="dark:text-gray-400">
              {" "}
              {el.ranking ? el.ranking : "Đang cập nhật"}
            </span>
          </div>

          <div className="flex flex-col text-gray-700 sm:flex-row">
            <div className="flex h-fit space-x-2 text-sm font-medium">
              <div className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">
                {el.open_now_text === "Open Now" || !el.is_closed
                  ? "Mở cửa"
                  : "Đóng cửa"}
              </div>
              <div className="rounded-full bg-orange-100 px-2 py-0.5 text-orange-700">
                {Math.floor(
                  el.distance
                    ? el.distance
                    : el.distance_string
                    ? el.distance_string
                    : 0
                ) < 1
                  ? 1
                  : Math.floor(
                      el.distance
                        ? el.distance
                        : el.distance_string
                        ? el.distance_string
                        : 0
                    )}{" "}
                km
              </div>
              <div className="flex gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-yellow-700">
                {Math.floor(el.hotel_class ? el.hotel_class : el.rating)}
                <Star />({el.num_reviews})
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center ">
            <span className="flex place-items-center text-sm gap-1">
              <p className="text-red-500">
                {el.price
                  ? el.price
                  : el.offer_group
                  ? el.offer_group.lowest_price
                  : "Đang cập nhật"}
              </p>
              {/* <Money />   //API đã có sắn  */}
            </span>
            <a
              href={el.website || el.web_url}
              target="_blank"
              rel="noreferrer"
              className="my-5 rounded-md px-5 py-2 text-center transition hover:scale-105 bg-sky-600 text-white sm:ml-auto"
            >
              Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;

const Money = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-currency-dong"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 19h12" />
      <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
      <path d="M16 16v-12" />
      <path d="M17 5h-4" />
    </svg>
  );
};

const Star = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-star-fill mt-[1px]"
      viewBox="0 0 16 16"
    >
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </svg>
  );
};
