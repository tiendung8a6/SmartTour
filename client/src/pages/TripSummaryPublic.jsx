import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Container,
  GridCol,
  Timeline,
  Badge,
  NumberFormatter,
} from "@mantine/core";
import useStore from "../store";
import { getSingleTrip } from "../utils/apiCalls";
import { Text } from "@mantine/core";
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
  IconPlane,
  IconCar,
  IconBuildingSkyscraper,
  IconBed,
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
  IconCurrencyDong,
} from "@tabler/icons-react";

const TripSummaryPublic = () => {
  const { setIsLoading } = useStore();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const startDate = new Date(trip?.startDate);
  const endDate = new Date(trip?.endDate);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

  // Function to calculate total estimated price and actual price
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
        _id: item._id,
        type: item.type,
        planName: item.planName,
        estimatedPrice: item.estimatedPrice,
        actualPrice: item.actualPrice,
        time: item.startDate,
        typeTime: "start",
        startTime: item.startTime,
        startAddress: item.startAddress,
      });
    }
    if (item.endDate) {
      timelineData.push({
        _id: item._id,
        type: item.type, // Add type for end events
        planName: item.planName,
        estimatedPrice: item.estimatedPrice,
        actualPrice: item.actualPrice,
        time: item.endDate,
        typeTime: "end",
        endTime: item.endTime,
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

  const currentDate = new Date(); // Lấy ngày hiện tại
  let itemsUntilCurrentDate = 0;
  const currentDateStr = new Date().toLocaleDateString("vi-VN");

  console.log(`Ngày hiện tại: ${currentDateStr}`);

  timelineData.forEach((item) => {
    const itemDate = new Date(item.time);
    // Nếu ngày của item nhỏ hơn hoặc bằng ngày hiện tại
    if (itemDate <= currentDate) {
      itemsUntilCurrentDate++; // Tăng tổng số mục
    }
  });
  console.log(
    `Tổng số mục từ ngày đầu đến ngày hiện tại (${currentDateStr}): ${itemsUntilCurrentDate}`
  );

  // console.log(`Tổng số mục trong ngày trước đó tính từ ngày hiện tại (${currentDate}) lùi về trước: ${totalItemsInPreviousDay}`);

  // console.log(`Tổng số mục trong ngày trước đó tính từ ngày hiện tại (${currentDate}) lùi về trước: ${totalItemsInPreviousDay}`);
  const isPassperItem = itemsUntilCurrentDate - 1;
  return (
    <div className="m-[50px] h-fit">
      <Link to="/trip">
        <Button
          className="border-none hover:text-[#0782c5] hover:bg-transparent dark:bg-inherit"
          leftSection={<IconArrowLeft className="text-[#0782c5]" size={30} />}
          variant="default"
          color="#0782c5"
          size="md"
        >
          <span className="text-[#0782c5]">Trở lại danh sách chuyến đi</span>
        </Button>
      </Link>

      <div className="w-full md:flex md:flex-row gap-8 items-center rounded">
        <div className="w-full md:w-full flex flex-col gap-3 py-[5px] px-[20px]">
          <h6 className="text-[1.5rem] font-semibold dark:text-white text-justify">
            <span>
              <div>{trip?.tripName.slice(0, 70)}</div>
            </span>
          </h6>
          <div className="flex gap-2 flex-col mt-[10px] dark:text-gray-300">
            <span>{trip?.city?.slice(0, 100)}</span>

            <span className="text-sm text-gray-600 dark:text-gray-500">
              {trip?.total?.slice(0, 100)}
            </span>

            <span className="text-sm text-gray-600 dark:text-gray-500">
              {new Date(trip?.startDate).toLocaleDateString("vi-VN")} -{" "}
              {new Date(trip?.endDate).toLocaleDateString("vi-VN")} (
              {diffDays === 0 ? "1 ngày" : `${diffDays} ngày`})
            </span>

            <div className="flex gap-1 text-sm text-gray-600 dark:text-gray-500">
              Tổng chi phí dự kiến:
              <NumberFormatter
                thousandSeparator="."
                decimalSeparator=","
                value={totalEstimatedPrice}
              />
              <span>
                <IconCurrencyDong
                  style={{ width: rem(15), height: rem(15) }}
                  stroke={1.5}
                />
              </span>
            </div>

            <div className="flex gap-1 text-sm text-gray-600 dark:text-gray-500">
              Tổng chi phí thực tế:
              <NumberFormatter
                thousandSeparator="."
                decimalSeparator=","
                value={totalActualPrice}
              />
              <IconCurrencyDong
                style={{ width: rem(15), height: rem(15) }}
                stroke={1.5}
              />
            </div>

            <span className="text-sm">
              <Badge
                size="md"
                variant="light"
                color={
                  trip?.status === true
                    ? "rgba(31, 105, 13, 1)"
                    : "rgba(207, 2, 125, 1)"
                }
              >
                {trip?.status === true ? "Công khai" : "Chỉ mình tôi"}
              </Badge>
            </span>
          </div>
        </div>

        <div className="w-full h-auto md:h-64 md:w-1/4 lg:w-[380px] hidden md:block">
          <img
            src={trip?.image}
            alt={trip?.tripName}
            className="object-cover w-full md:h-[100%] rounded"
          />
        </div>
      </div>

      {/* Time line */}

      <Grid className="ml-[30px] mt-[200px]">
        <Grid.Col span={{ base: 12, md: 6, lg: 9 }}>
          <Timeline
            color="cyan"
            radius="xl"
            active={isPassperItem}
            bulletSize={45}
          >
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
                currentDate === new Date(item.time).toLocaleDateString("vi-VN");

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
                        <IconBed stroke={2} className="" />
                      ) : item.type === "activity" ? (
                        <IconWalk stroke={2} className="" />
                      ) : item.type === "flights" ? (
                        <IconPlane stroke={2} className="" />
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
                        {/* {`${item.planName} - ${item.typeTime === "start" ? "Start" : "End"}`}  */}
                        <br />
                      </div>
                    </div>
                  )}

                  {showNewDate && (
                    <div
                      className={`bg-[#dee2e6] h-[50px] mt-[-85px] ml-[-100px] p-3 rounded-[100px]
                          ${
                            isCurrentDate
                              ? "bg-cyan-800 text-white"
                              : isPassedDate
                              ? "bg-cyan-800 text-white"
                              : "text-black"
                          }`}
                    >
                      <span className=" ml-5">
                        {new Date(item.time).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  )}

                  <Grid className="mt-[30px] flex">
                    {/* <br /> */}
                    {/* <div ></div> */}
                    <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
                      <div>
                        <span className="text-xl font-medium text-[#0d4d84f4] dark:text-sky-500">
                          {`${item.planName} ${
                            item.typeTime === "start"
                              ? "(Hoạt động bắt đầu )"
                              : "(Hoạt động kết thúc)"
                          } `}
                        </span>
                      </div>
                      <span className="">
                        {item.typeTime === "start" ? (
                          <p className="my-5">
                            Ngày:{" "}
                            {new Date(item.time).toLocaleDateString("vi-VN")}
                          </p>
                        ) : (
                          <p className="my-5">
                            Ngày:{" "}
                            {new Date(item.time).toLocaleDateString("vi-VN")}
                          </p>
                        )}
                      </span>

                      <span>
                        {item.typeTime === "start" && item.startTime && (
                          <p className="my-5 ">Thời gian: {item.startTime}</p>
                        )}
                      </span>
                      <span>
                        {item.typeTime === "start" && item.estimatedPrice && (
                          <p className="my-5">
                            Chi phí dự kiến:{" "}
                            <NumberFormatter
                              thousandSeparator="."
                              decimalSeparator=","
                              value={item.estimatedPrice}
                            />{" "}
                            VND
                          </p>
                        )}
                      </span>
                      <span>
                        {item.typeTime === "start" && item.actualPrice && (
                          <p className="my-5">
                            Chi phí thực tế:{" "}
                            <NumberFormatter
                              thousandSeparator="."
                              decimalSeparator=","
                              value={item.actualPrice}
                            />{" "}
                            VND
                          </p>
                        )}
                      </span>
                      <span>
                        {item.typeTime === "start" && item.startAddress && (
                          <p className="my-5">Địa chỉ: {item.startAddress}</p>
                        )}
                      </span>
                      <span>
                        {item.typeTime === "end" && item.endTime && (
                          <p className="my-5">Thời gian: {item.endTime}</p>
                        )}
                      </span>
                      <span>
                        {item.typeTime === "end" && item.estimatedPrice && (
                          <p className="my-5">
                            Chi phí dự kiến:{" "}
                            <NumberFormatter
                              thousandSeparator="."
                              decimalSeparator=","
                              value={item.estimatedPrice}
                            />{" "}
                            VND
                          </p>
                        )}
                      </span>
                      <span>
                        {item.typeTime === "end" && item.actualPrice && (
                          <p className="my-5">
                            Chi phí thực tế:{" "}
                            <NumberFormatter
                              thousandSeparator="."
                              decimalSeparator=","
                              value={item.actualPrice}
                            />{" "}
                            VND
                          </p>
                        )}
                      </span>

                      <span>
                        {item.typeTime === "end" && item.endAddress && (
                          <p className="my-5">Địa chỉ: {item.endAddress}</p>
                        )}
                      </span>

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
  );
};

export default TripSummaryPublic;
