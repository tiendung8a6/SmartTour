import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Grid } from "@mantine/core";
import useStore from "../store";
import { getSingleTrip } from "../utils/apiCalls";
import {
  IconArrowLeft,
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
} from "@tabler/icons-react";
const PlansCreate = () => {
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

  if (!trip)
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-xl text-slate-500">Loading...</span>
      </div>
    );

  return (
    <div className="mx-10 mt-5">
      <Link to={`/trip/${trip._id}`}>
        <Button
          className="border-none hover:text-[#0782c5] hover:bg-transparent flex justify-start ml-[-20px] "
          leftSection={<IconArrowLeft className="text-[#0782c5]" size={30} />}
          variant="default"
          color="#0782c5"
          size="md"
        >
          <span className="text-[#0782c5]">Trở Lại Tóm tắt chuyến đi</span>
        </Button>
      </Link>
      <div className="text-xl font-medium mt-5">
        {" "}
        Lập kế hoạch cho {trip?.tripName} vào ngày{" "}
        {new Date(trip?.startDate).toLocaleDateString("vi-VN")}
        {/* {new Date(trip?.endDate).toLocaleDateString("vi-VN")} (
        {diffDays === 0 ? "1 ngày" : `${diffDays} ngày`}) */}
      </div>
      <h4 className="mt-8 text-lg font-medium ">Phổ biến nhất</h4>
      <Grid className="mt-5">
        <Grid.Col span={{ base: 12, md: 4, lg: 2 }}>
          <Link
            to={`/trip/${trip._id}/activity/create`}
            className="p-4 border rounded-full flex bg-gray-50"
          >
            <IconWalk stroke={2} className="ml-[10px] text-[#41b7cb] " />
            <span className="ml-[10px] text-[#0782c5] font-semibold ">
              {" "}
              Hoạt động
            </span>
          </Link>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4, lg: 2 }}>
          <Link
            to={`/trip/${trip._id}/activity/create`}
            className="p-4 border rounded-full flex bg-gray-50"
          >
            <IconPlaneInflight
              stroke={2}
              className="ml-[10px] text-[#41b7cb] "
            />
            <span className="ml-[10px] text-[#0782c5] font-semibold ">
              {" "}
              Chuyến bay
            </span>
          </Link>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4, lg: 2 }}>
          <Link
            to={`/trip/${trip._id}/lodging/create`}
            className="p-4 border rounded-full flex bg-gray-50"
          >
            <IconBuildingSkyscraper
              stroke={2}
              className="ml-[10px] text-[#41b7cb] "
            />
            <span className="ml-[10px] text-[#0782c5] font-semibold ">
              {" "}
              Khách sạn{" "}
            </span>
          </Link>
        </Grid.Col>
      </Grid>

      <h4 className="mt-8 text-lg font-medium ">Kế hoạch khác</h4>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 2 }} className="mt-5">
          <Link
            to={`/trip/${trip._id}/activity/create`}
            className="p-4 border rounded-full flex bg-gray-50"
          >
            <IconCar stroke={2} className="ml-[10px] text-[#41b7cb] " />
            <span className="ml-[10px] text-[#0782c5] font-semibold ">
              {" "}
              Thuê ô tô
            </span>
          </Link>{" "}
          <br />
          <Link
            to={`/trip/${trip._id}/activity/create`}
            className="p-4 border rounded-full flex bg-gray-50"
          >
            <IconMasksTheater
              stroke={2}
              className="ml-[10px] text-[#41b7cb] "
            />
            <span className="ml-[10px] text-[#0782c5] font-semibold ">
              {" "}
              Hát kịch
            </span>
          </Link>{" "}
          <br />
          <Link
            to={`/trip/${trip._id}/activity/create`}
            className="p-4 border rounded-full flex bg-gray-50"
          >
            <IconBrandZoom stroke={2} className="ml-[10px] text-[#41b7cb] " />
            <span className="ml-[10px] text-[#0782c5] font-semibold ">
              {" "}
              Cuộc họp
            </span>
          </Link>{" "}
          <br />
          <Link
            to={`/trip/${trip._id}/activity/create`}
            className="p-4 border rounded-full flex bg-gray-50"
          >
            <IconMusic stroke={2} className="ml-[10px] text-[#41b7cb] " />
            <span className="ml-[10px] text-[#0782c5] font-semibold ">
              {" "}
              Hòa nhạc
            </span>
          </Link>{" "}
          <br />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 2 }} className="mt-5">
          <Link
            to={`/trip/${trip._id}/activity/create`}
            className="p-4 border rounded-full flex bg-gray-50"
          >
            <IconNote stroke={2} className="ml-[10px] text-[#41b7cb] " />
            <span className="ml-[10px] text-[#0782c5] font-semibold ">
              {" "}
              Ghi chú
            </span>
          </Link>{" "}
          <br />
          <Link
            to={`/trip/${trip._id}/activity/create`}
            className="p-4 border rounded-full flex bg-gray-50"
          >
            <IconParkingCircle
              stroke={2}
              className="ml-[10px] text-[#41b7cb] "
            />
            <span className="ml-[10px] text-[#0782c5] font-semibold ">
              {" "}
              Bãi đậu xe
            </span>
          </Link>{" "}
          <br />
          <Link
            to={`/trip/${trip._id}/activity/create`}
            className="p-4 border rounded-full flex bg-gray-50"
          >
            <IconTrain stroke={2} className="ml-[10px] text-[#41b7cb] " />
            <span className="ml-[10px] text-[#0782c5] font-semibold ">
              {" "}
              Đường sắt
            </span>
          </Link>{" "}
          <br />
          <Link
            to={`/trip/${trip._id}/activity/create`}
            className="p-4 border rounded-full flex bg-gray-50"
          >
            <IconToolsKitchen2
              stroke={2}
              className="ml-[10px] text-[#41b7cb] "
            />
            <span className="ml-[10px] text-[#0782c5] font-semibold ">
              {" "}
              Nhà hàng
            </span>
          </Link>{" "}
          <br />
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default PlansCreate;
