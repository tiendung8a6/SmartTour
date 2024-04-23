import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Container } from "@mantine/core";
import useStore from "../store";
import { getSingleTrip } from "../utils/apiCalls";
import { Timeline, Text } from "@mantine/core";
import { Grid, Menu, rem } from "@mantine/core";
import { IconArrowLeft, IconCirclePlus } from "@tabler/icons-react";
import {
  IconGitBranch,
  IconGitPullRequest,
  IconGitCommit,
  IconMessageDots,
} from "@tabler/icons-react";

import {
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
} from "@tabler/icons-react";
const TripSummary = () => {
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
    <div className="m-[50px] h-fit">
      <Link to="/trip">
        <Button
          className="border-none hover:text-[#0782c5] hover:bg-transparent  "
          leftSection={<IconArrowLeft className="text-[#0782c5]" size={30} />}
          variant="default"
          color="#0782c5"
          size="md"
        >
          <span className="text-[#0782c5]">Trở Lại danh sách chuyến đi</span>
        </Button>
      </Link>
      <div
        className={`w-full flex flex-col gap-8 items-center rounded md:flex-row  `}
      >
        <div className="w-full md:w-full flex flex-col gap-3 py-[5px] px-[20px]  ">
          <h6 className=" text-[1.5rem] font-semibold dark:text-white text-justify">
            <span>
              <Link to={`/trip/${trip._id}`}>{trip?.tripName}</Link>
            </span>
          </h6>
          <div className=" flex gap-2 flex-col mt[-10px]">
            <span>{trip?.city?.slice(0, 60)}</span>

            <span className="text-sm text-gray-600">
              {new Date(trip?.startDate).toLocaleDateString("vi-VN")} -
              {new Date(trip?.endDate).toLocaleDateString("vi-VN")} (
              {diffDays === 0 ? "1 ngày" : `${diffDays} ngày`})
            </span>

            <span className="flex">
              <span className="bg-[#0782c5] border-[#0782c5] border rounded-full w-[24px] h-[24px] p-[2px]    ">
                <IconCirclesRelation
                  stroke={2}
                  className="text-[white] m-[1px] h-[17px] w-[17px] "
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
                <span className="bg-transparent border-[#0782c5] border rounded-full w-[24px] h-[24px] p-[2px]    ">
                  <IconPencil
                    stroke={2}
                    className="text-[#0782c5] m-[1px] h-[17px] w-[17px] "
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
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }} className="ml-[-19px]">
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button className="flex bg-transparent hover:bg-transparent ">
                    <span className="bg-transparent border-[#0782c5] border rounded-full w-[24px] h-[24px] p-[2px]    ">
                      <IconDots
                        stroke={2}
                        className="text-[#0782c5] mt-[1px] ml-[0.5px]  h-[17px] w-[17px] "
                      />
                    </span>
                    <span className="ml-[10px] ">
                      <div className="text-[#0782c5] flex items-center font-medium text-sm">
                        Lựa chọn khác
                        <IconChevronDown
                          stroke={2}
                          className="text-[#0782c5] ml-1 mt-[1px] h-[17px] w-[17px] "
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
                    In chuyến đi
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
                      <IconTrash style={{ width: rem(14), height: rem(14) }} />
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
          className="w-full h-auto md:h-64 md:w-1/4 lg:w-[380px] hidden md:block "
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
        className="flex mx-auto h-[50px] w-fit p-4 shadow-xl border rounded-full  text-[#0782c5]"
      >
        <span className="flex justify-center mt-[-3px]">
          <IconCirclePlus stroke={2} className="mr-1" />
          Thêm kế hoạch
        </span>
      </Link>
    </div>
  );
};

export default TripSummary;
