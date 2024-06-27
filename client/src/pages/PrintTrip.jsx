import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Container, GridCol, Timeline } from "@mantine/core";
import useStore from "../store";
import { getSingleTrip } from "../utils/apiCalls";
import { Grid, Menu, rem } from "@mantine/core";
import { IconArrowLeft, IconCirclePlus } from "@tabler/icons-react";

import {
  IconGitBranch,
  IconGitPullRequest,
  IconGitCommit,
  IconMessageDots,
  IconCirclesRelation,
  IconPencil,
  IconDots,
  IconPrinter,
  IconChevronDown,
  IconSearch,
  IconPhoto,
  IconDownload,
  IconTrash,
  IconArrowsLeftRight,
  IconPlaneInflight,
  IconCar,
  IconBuildingSkyscraper,
  IconTrain,
  IconParkingCircle,
  IconWalk,
  IconNote,
  IconBrandZoom,
  IconMusic,
  IconToolsKitchen2,
  IconMasksTheater,
  IconEditCircle,
  IconCampfire,
} from "@tabler/icons-react";
const handleClickPrint = () => {
  // Khi người dùng click vào nút, kích hoạt sự kiện Ctrl + P
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "p") {
      // Thực hiện hành động của bạn ở đây, ví dụ: in trang
      window.print();
    }
  });
};
const PrintTrip = () => {
  const { setIsLoading } = useStore();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const startDate = new Date(trip?.startDate);
  const endDate = new Date(trip?.endDate);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const fetchTrip = async () => {
    try {
      setIsLoading(true);
      const data = await getSingleTrip(id);
      setTrip(data || []);
    } catch (error) {
      console.error("Error fetching trip or popular content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTrip();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [id]);

  const timelineData = [];

  if (!trip) {
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-xl text-slate-500">Đang tải...</span>
      </div>
    );
  }

  if (trip && trip.plans && trip.plans.length > 0) {
    console.log(trip.plans);
  } else {
    console.log("No plans found");
    console.log(trip);
  }

  trip.plans.forEach((item) => {
    if (item.startDate) {
      timelineData.push({
        type: item.type,
        planName: item.planName,
        time: item.startDate,
        typeTime: "start",
        startTime: item.startTime,
        estimatedPrice: item.estimatedPrice,
        startAddress: item.startAddress,
      });
    }
    if (item.endDate) {
      timelineData.push({
        planName: item.planName,
        time: item.endDate,
        typeTime: "end",
        endTime: item.endTime,
        type: item.type, // Add type for end events
        actualPrice: item.actualPrice,
        endAddress: item.endAddress,
      });
    }
  });

  // Sắp xếp timelineData theo thời gian và loại
  timelineData.sort((a, b) => {
    const dateA = new Date(a.time); // date a là mốc bắt dầu
    const dateB = new Date(b.time); // date b  là mốc kết thúc

    // So sánh theo ngày đầu tiên
    if (dateA.getTime() === dateB.getTime()) {
      // Nếu cùng ngày, so sánh theo giờ
      const hourA =
        a.typeTime === "start"
          ? parseInt(a.startTime.split(":")[0])
          : parseInt(a.endTime.split(":")[0]);
      const minuteA =
        a.typeTime === "start"
          ? parseInt(a.startTime.split(":")[1])
          : parseInt(a.endTime.split(":")[1]);
      const hourB =
        b.typeTime === "start"
          ? parseInt(b.startTime.split(":")[0])
          : parseInt(b.endTime.split(":")[0]);
      const minuteB =
        b.typeTime === "start"
          ? parseInt(b.startTime.split(":")[1])
          : parseInt(b.endTime.split(":")[1]);

      // So sánh theo giờ và phút
      if (hourA === hourB) {
        return minuteA - minuteB;
      } else {
        return hourA - hourB;
      }
    } else {
      return dateA - dateB;
    }
  });

  let currentDate = null;
  let itemsInCurrentDay = 0;
  let totalItemsInPreviousDay = 0;

  timelineData.forEach((item, index) => {
    const itemDate = new Date(item.time).toLocaleDateString("vi-VN");

    if (itemDate !== currentDate) {
      if (currentDate !== null) {
        console.log(`Ngày ${currentDate}: ${itemsInCurrentDay} mục`);
        totalItemsInPreviousDay += itemsInCurrentDay;
      }
      currentDate = itemDate;
      itemsInCurrentDay = 0;
    }

    itemsInCurrentDay++;

    if (index === timelineData.length - 1) {
      console.log(`Ngày ${currentDate}: ${itemsInCurrentDay} mục`);
      totalItemsInPreviousDay += itemsInCurrentDay;
    }
  });

  totalItemsInPreviousDay -= 1; // Trừ đi một để loại bỏ ngày hiện tại
  console.log(`Tổng số mục trong ngày trước đó: ${totalItemsInPreviousDay}`);
  const isPassperItem = totalItemsInPreviousDay - 1;

  const calculateTotalPrices = () => {
    let totalEstimatedPrice = 0;
    let totalActualPrice = 0;

    trip?.plans?.forEach((plan) => {
      totalEstimatedPrice += plan.estimatedPrice || 0;
      totalActualPrice += plan.actualPrice || 0;
    });

    return { totalEstimatedPrice, totalActualPrice };
  };

  const { totalEstimatedPrice, totalActualPrice } = calculateTotalPrices();

  return (
    <div className="m-[50px] h-fit">
      <Link to="/trip">
        <Button
          className=" border-none hover:text-[#0782c5] hover:bg-transparent dark:bg-inherit"
          leftSection={<IconArrowLeft className="text-[#0782c5]" size={30} />}
          variant="default"
          color="#0782c5"
          size="md"
        >
          <span className="text-[#0782c5] dark:text-sky-500">
            Trở lại danh sách chuyến đi
          </span>
        </Button>
      </Link>
      <br></br>

      <Button
        leftSection={<IconPrinter size={30} />}
        className="ml-4 mt-5"
        onClick={(event) => event.preventDefault(window.print())}
        variant="light"
        size="xl"
        radius="md"
      >
        In chuyến đi
      </Button>

      {/* in nội dung dới đây */}

      <div>
        <div className="w-full md:flex md:flex-row gap-8 items-center rounded">
          <div className="w-full md:w-full flex flex-col gap-3 py-[5px] px-[20px] mt-3">
            <h6 className="text-[1.5rem] font-semibold dark:text-white text-justify">
              <span>
                <div>{trip?.tripName}</div>
              </span>
            </h6>
            <div className="flex gap-2 flex-col dark:text-gray-200">
              <span>{trip?.city}</span>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                {trip?.total}
              </span>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(trip?.startDate).toLocaleDateString("vi-VN")} -
                {new Date(trip?.endDate).toLocaleDateString("vi-VN")} (
                {diffDays === 0 ? "1 ngày" : `${diffDays} ngày`})
              </span>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tổng chi phí dự kiến: {formatCurrency(totalEstimatedPrice)}
              </span>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tổng chi phí thực tế: {formatCurrency(totalActualPrice)}
              </span>
            </div>
          </div>

          {/* <Link
          to={`/trip/${trip._id}`}
          className="w-full h-auto md:h-64 md:w-1/4 lg:w-[380px] hidden md:block"
        >
          <img
            src={trip?.image}
            alt={trip?.tripName}
            className="object-cover w-full md:h-[100%] rounded"
          />
        </Link> */}
        </div>

        <Grid className="ml-[30px] mt-[150px]">
          <Grid.Col span={{ base: 12, md: 6, lg: 9 }}>
            <Timeline color="" radius="xl" bulletSize={45}>
              {timelineData.map((item, index) => {
                // Kiểm tra xem có cần hiển thị ngày mới không
                const showNewDate =
                  index === 0 ||
                  new Date(item.time).toDateString() !==
                    new Date(timelineData[index - 1].time).toDateString();

                // Kiểm tra xem phần tử hiện tại có phải là phần tử đầu tiên của một ngày không
                const isFirstItemOfDay =
                  index === 0 ||
                  new Date(item.time).toDateString() !==
                    new Date(timelineData[index - 1].time).toDateString();

                // Kiểm tra xem phần tử hiện tại có phải là phần tử cuối cùng của một ngày không
                const isLastItemOfDay =
                  index < timelineData.length - 1 &&
                  new Date(item.time).toDateString() !==
                    new Date(timelineData[index + 1].time).toDateString();

                const currentDate = new Date().toLocaleDateString("vi-VN");
                const isCurrentDate =
                  currentDate ===
                  new Date(item.time).toLocaleDateString("vi-VN");

                // const passedDate = new Date(item.time).toLocaleDateString("vi-VN") < currentDate;
                // const isPassedDate = passedDate === new Date(item.time).toLocaleDateString("vi-VN");
                const passedDate = new Date(item.time) < new Date();
                const isPassedDate = passedDate;
                return (
                  <Timeline.Item
                    key={index}
                    bullet={
                      <div className="">
                        {item.type === "lodging" ? (
                          <IconBuildingSkyscraper stroke={2} className="" />
                        ) : item.type === "activity" ? (
                          <IconWalk stroke={2} className="" />
                        ) : item.type === "flights" ? (
                          <IconPlaneInflight stroke={2} className="" />
                        ) : item.type === "car" ? (
                          <IconCar stroke={2} className="" />
                        ) : item.type === "theater" ? (
                          <IconMasksTheater stroke={2} className="" />
                        ) : item.type === "camp" ? (
                          <IconCampfire stroke={2} className="" />
                        ) : item.type === "concert" ? (
                          <IconMusic stroke={2} className="" />
                        ) : item.type === "note" ? (
                          <IconNote stroke={2} className="" />
                        ) : item.type === "parking" ? (
                          <IconParkingCircle stroke={2} className="" />
                        ) : item.type === "rail" ? (
                          <IconTrain stroke={2} className="" />
                        ) : item.type === "restaurant" ? (
                          <IconToolsKitchen2 stroke={2} className="" />
                        ) : (
                          <IconCirclePlus stroke={2} className="" />
                        )}
                      </div>
                    }
                  >
                    {isFirstItemOfDay && (
                      <div className="">
                        <div
                          className={`text-transparent h-2 ${
                            isLastItemOfDay ? "none" : ""
                          }`}
                        >
                          {/* {`${item.planName} - ${item.typeTime === "start" ? "Start" : "End"}`}  */}{" "}
                          <br />
                        </div>
                      </div>
                    )}

                    {showNewDate && (
                      <div
                        className={`bg-[#dee2e6] h-[50px] mt-[-85px] ml-[-100px] p-3 dark:bg-gray-600 dark:text-white	
                          ${isCurrentDate ? "" : isPassedDate ? "" : ""}`}
                      >
                        <span>
                          {new Date(item.time).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    )}

                    <Grid className="mt-[30px] flex">
                      {/* <br /> */}
                      {/* <div ></div> */}
                      <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
                        {`${item.planName} ${
                          item.typeTime === "start"
                            ? "(Hoạt động bắt đầu )"
                            : "(Hoạt động kết thúc)"
                        } `}

                        {item.typeTime === "start" ? (
                          <p>
                            {new Date(item.time).toLocaleDateString("vi-VN")}{" "}
                          </p>
                        ) : (
                          <p>
                            {new Date(item.time).toLocaleDateString("vi-VN")}{" "}
                          </p>
                        )}
                        {item.typeTime === "start" && item.startTime && (
                          <p> Thời gian bắt đầu : {item.startTime}</p>
                        )}
                        {item.typeTime === "end" && item.endTime && (
                          <p>Thời gian kết thúc : {item.endTime}</p>
                        )}
                        {item.typeTime === "start" && item.estimatedPrice && (
                          <p>
                            {" "}
                            Chi phí dự kiến :{" "}
                            {formatCurrency(item.estimatedPrice)}
                          </p>
                        )}
                        {item.typeTime === "end" && item.actualPrice && (
                          <p>
                            Chi phí thực tế : {formatCurrency(item.actualPrice)}
                          </p>
                        )}
                        {item.typeTime === "start" && item.startAddress && (
                          <p> Địa chỉ : {item.startAddress}</p>
                        )}
                        {item.typeTime === "end" && item.endAddress && (
                          <p>Địa chỉ : {item.endAddress}</p>
                        )}
                        {/* Thêm hai thẻ <br> nếu là phần tử cuối cùng của một ngày */}
                        {isLastItemOfDay && (
                          <>
                            <br />
                            <br />
                          </>
                        )}
                      </Grid.Col>
                    </Grid>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
};

export default PrintTrip;
