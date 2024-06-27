import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Timeline, Badge, NumberFormatter } from "@mantine/core";
import useStore from "../store";
import { getSingleTrip } from "../utils/apiCalls";
import { Grid, Menu, rem } from "@mantine/core";
import { IconArrowLeft, IconCirclePlus } from "@tabler/icons-react";
import {
  IconCirclesRelation,
  IconPencil,
  IconDots,
  IconPrinter,
  IconChevronDown,
  IconDownload,
  IconTrash,
  IconPlane,
  IconCar,
  IconBed,
  IconTrain,
  IconParkingCircle,
  IconWalk,
  IconNote,
  IconMusic,
  IconToolsKitchen2,
  IconMasksTheater,
  IconCampfire,
  IconCurrencyDong,
} from "@tabler/icons-react";
import { useDeletePlan } from "../hooks/plan-hook";
import { Toaster, toast } from "sonner";
import { ConfirmDialog, LoadingClient } from "../components";
import { useDisclosure } from "@mantine/hooks";

const TripSummary = () => {
  const { setIsLoading, user } = useStore();
  const { id } = useParams();
  const useDelete = useDeletePlan(toast, user?.token);
  const [trip, setTrip] = useState(null);
  const startDate = new Date(trip?.startDate);
  const endDate = new Date(trip?.endDate);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const [type, setType] = useState(null);
  const [selected, setSelected] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

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

  const handleActions = () => {
    switch (type) {
      case "delete":
        useDelete.mutate(selected);
        break;
      default:
        break;
    }
    setIsConfirmDialogOpen(false);
  };

  const handlePerformAction = (val, id, status) => {
    setSelected(id);
    setType(val);
    setIsConfirmDialogOpen(true);
  };

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

  //Bổ xung check điều kiện Đăng nhập và Đúng kế hoạch của tôi
  const isUserValid = user?.user?._id === trip?.user?._id;
  if (!trip) {
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-lg text-slate-500">Đang tải...</span>
      </div>
    );
  }
  // Check token
  if (!user?.token) {
    return (
      <div className="w-full h-full py-[100px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-black text-gray-500">404</h1>
          <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Đã có lỗi xảy ra
          </p>
          <p className="mt-4 text-gray-500 font-medium dark:text-gray-300">
            Vui lòng đăng nhập.
          </p>
          <Link
            to="/sign-in"
            className="mt-6 inline-block rounded bg-sky-600 px-5 py-3 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }
  // Check user
  if (!isUserValid) {
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-lg text-slate-500">
          Đây không phải kế hoạch của bạn
        </span>
      </div>
    );
  }
  return (
    <>
      <div className="m-[50px] h-fit">
        <Link to="/trip">
          <Button
            className="border-none hover:text-[#0782c5] hover:bg-transparent dark:bg-inherit"
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

        <div className="w-full md:flex md:flex-row gap-8 items-center rounded">
          <div className="w-full md:w-full flex flex-col gap-3 py-[5px] px-[20px]">
            <h6 className="text-[1.5rem] font-semibold dark:text-white text-justify">
              <span>
                <div className="dark:text-white">
                  {trip?.tripName.slice(0, 70)}
                </div>
              </span>
            </h6>
            <div className="flex gap-2 flex-col mt-[10px]">
              <span className="dark:text-gray-300">
                {trip?.city?.slice(0, 100)}
              </span>

              <span className="text-sm text-gray-600 dark:text-gray-300">
                {trip?.total?.slice(0, 100)}
              </span>

              <span className="text-sm text-gray-600 dark:text-gray-300">
                {new Date(trip?.startDate).toLocaleDateString("vi-VN")} -{" "}
                {new Date(trip?.endDate).toLocaleDateString("vi-VN")} (
                {diffDays === 0 ? "1 ngày" : `${diffDays} ngày`})
              </span>

              <div className="flex gap-1 text-sm text-gray-600 dark:text-gray-300">
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

              <div className="flex gap-1 text-sm text-gray-600 dark:text-gray-300 ">
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
                      ? "rgb(8, 153, 30)"
                      : "rgba(194, 21, 125, 1)"
                  }
                >
                  {trip?.status === true ? "Công khai" : "Chỉ mình tôi"}
                </Badge>
              </span>
              <span className="flex">
                <span className="bg-[#0782c5] border-[#0782c5] border rounded-full w-[24px] h-[24px] p-[2px]">
                  <IconCirclesRelation
                    stroke={2}
                    className="text-[white] m-[1px] h-[17px] w-[17px]"
                  />
                </span>
                <span className="ml-[10px]">
                  <Link className="text-[#0782c5] font-medium text-sm">
                    Chia sẻ
                  </Link>
                </span>
              </span>
            </div>
            <Grid>
              <Grid.Col
                span={{ base: 12, md: 6, lg: 3 }}
                className="flex items-center"
              >
                <span className="flex items-center">
                  <span className="bg-transparent border-[#0782c5] border rounded-full w-[24px] h-[24px] p-[2px]">
                    <IconPencil
                      stroke={2}
                      className="text-[#0782c5] mt-[1px] ml-0.5px  h-[17px] w-[17px]"
                    />
                  </span>
                  <span className="ml-[10px] ">
                    <Link
                      to={`/trip/${trip._id}/edit`}
                      className="text-[#0782c5] flex items-center font-medium text-sm"
                    >
                      Chỉnh sửa chuyến đi
                    </Link>
                  </span>
                </span>
              </Grid.Col>
              <Grid.Col
                span={{ base: 12, md: 6, lg: 3 }}
                className="ml-[-19px]"
              >
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button className="flex bg-transparent hover:bg-transparent">
                      <span className="bg-transparent border-[#0782c5] border rounded-full w-[24px] h-[24px] p-[2px]">
                        <IconDots
                          stroke={2}
                          className="text-[#0782c5] mt-[1px] ml-[0.5px]  h-[17px] w-[17px]"
                        />
                      </span>
                      <span className="ml-[10px] ">
                        <div className="text-[#0782c5] flex items-center font-medium text-sm">
                          Lựa chọn khác
                          <IconChevronDown
                            stroke={2}
                            className="text-[#0782c5] ml-1 mt-[1px] h-[17px] w-[17px]"
                          />
                        </div>
                      </span>
                    </Button>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Chức năng</Menu.Label>
                    <Menu.Item
                      leftSection={
                        <IconPrinter
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                      className="text-[#0782c5] flex items-center"
                    >
                      <Link
                        to={`/trip/${trip._id}/print`}
                        className="text-[#0782c5] flex items-center "
                      >
                        In chuyến đi
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      leftSection={
                        <IconDownload
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                      className="text-[#0782c5] flex items-center"
                    >
                      Tải chuyến đi
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Label>Cẩn trọng</Menu.Label>
                    <Menu.Item
                      color="red"
                      leftSection={
                        <IconTrash
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                    >
                      Xóa chuyến đi
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Grid.Col>
            </Grid>
          </div>

          <Link
            to={`/trip/${trip._id}`}
            className="w-full h-auto md:h-64 md:w-1/4 lg:w-[380px] hidden md:block"
          >
            <img
              src={trip?.image}
              alt={trip?.tripName}
              className="object-cover w-full md:h-[100%] rounded"
            />
          </Link>
        </div>

        <Link
          to={`/trip/${trip._id}/plans/create`}
          className="flex mx-auto h-[50px] w-fit p-4 shadow-xl border rounded-full dark:border-sky-500 text-[#0782c5]"
        >
          <span className="flex justify-center mt-[-3px] dark:text-sky-500 ">
            <IconCirclePlus stroke={2} className="mr-1" />
            Thêm kế hoạch
          </span>
        </Link>

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
                        <span className=" ml-5 dark:text-white">
                          {new Date(item.time).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    )}

                    <Grid className="mt-[30px] flex">
                      <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
                        <Link
                          to={`/trip/${trip?._id}/${item?.type}/${item?._id}/view`}
                        >
                          <span className="text-xl font-medium text-[#0d4d84f4] dark:text-sky-500">
                            {`${item.planName} ${
                              item.typeTime === "start"
                                ? "(Hoạt động bắt đầu )"
                                : "(Hoạt động kết thúc)"
                            } `}
                          </span>
                        </Link>
                        <span className="dark:text-gray-200">
                          {item.typeTime === "start" ? (
                            <p className="my-5 ">
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

                        <span className="dark:text-gray-200">
                          {item.typeTime === "start" && item.startTime && (
                            <p className="my-5 ">Thời gian: {item.startTime}</p>
                          )}
                        </span>
                        <span className="dark:text-gray-200">
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
                        <span className="dark:text-gray-200">
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
                        <span className="dark:text-gray-200">
                          {item.typeTime === "start" && item.startAddress && (
                            <p className="my-5">Địa chỉ: {item.startAddress}</p>
                          )}
                        </span>
                        <span className="dark:text-gray-200">
                          {item.typeTime === "end" && item.endTime && (
                            <p className="my-5">Thời gian: {item.endTime}</p>
                          )}
                        </span>
                        <span className="dark:text-gray-200">
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
                        <span className="dark:text-gray-200">
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

                        <span className="dark:text-gray-200">
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
                      <Grid.Col
                        span={{ base: 12, md: 6, lg: 4 }}
                        className="mt-[-10px] flex justify-end"
                      >
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <Button className="flex bg-transparent hover:bg-transparent">
                              <span className="bg-transparent border-[#0782c5] border rounded-full w-[24px] h-[24px] p-[2px]">
                                <IconDots
                                  stroke={2}
                                  className="text-[#0782c5] mt-[1px] ml-[0.5px]  h-[17px] w-[17px]"
                                />
                              </span>
                              <span className="ml-[10px] ">
                                <div className="text-[#0782c5] flex items-center font-medium text-sm">
                                  Lựa chọn khác
                                  <IconChevronDown
                                    stroke={2}
                                    className="text-[#0782c5] ml-1 mt-[1px] h-[17px] w-[17px]"
                                  />
                                </div>
                              </span>
                            </Button>
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={
                                <IconPencil
                                  style={{ width: rem(14), height: rem(14) }}
                                />
                              }
                              className="text-[#0782c5] flex items-center"
                            >
                              <Link
                                to={`/trip/${trip?._id}/${item?.type}/${item?._id}/edit`}
                              >
                                Chỉnh sửa kế hoạch
                              </Link>
                            </Menu.Item>

                            <Menu.Divider />

                            <Menu.Item
                              color="red"
                              leftSection={
                                <IconTrash
                                  style={{ width: rem(14), height: rem(14) }}
                                />
                              }
                              onClick={() =>
                                handlePerformAction("delete", item._id)
                              }
                            >
                              Xóa kế hoạch
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Grid.Col>
                    </Grid>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </Grid.Col>
        </Grid>
        <LoadingClient />
        <Toaster richColors />
      </div>

      {!isOpening && !opened && (
        <ConfirmDialog
          message="Bạn có chắc muốn xóa kế hoạch này không?"
          opened={isConfirmDialogOpen}
          close={() => setIsConfirmDialogOpen(false)}
          handleClick={handleActions}
        />
      )}
    </>
  );
};

export default TripSummary;
