import Markdown from "markdown-to-jsx";
import React from "react";
// import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Grid, Menu, Button, Text, rem } from "@mantine/core";
// icon tabler
import {
  IconCirclesRelation,
  IconPencil,
  IconDots,
  IconSettings,
  IconChevronDown,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
} from "@tabler/icons-react";
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
      md:flex-row border `}
    >
      <div className="w-full md:w-full flex flex-col gap-3 py-[5px] px-[20px]  ">
        <h6 className=" text-[1.5rem] font-semibold text-[#0782c5] dark:text-white text-justify">
          {trip?.tripName.slice(0, 60) + "..."}
        </h6>
        <div className=" flex gap-2 flex-col mt[-10px]">
          <span>{trip?.city?.slice(0, 60) + "..."}</span>

          <span className="text-sm text-gray-600">
            {new Date(trip?.startDate).toLocaleDateString("vi-VN")} -
            {new Date(trip?.endDate).toLocaleDateString("vi-VN")} (
            {diffDays === 0 ? "1 ngày" : `${diffDays} ngày`})
          </span>

          <span className="flex">
            <span className="bg-[#0782c5] border-[#0782c5] border rounded-full w-[24px] h-[24px] p-[2px]    ">
              <IconCirclesRelation
                stroke={2}
                className="text-[white] mt-[1px] h-[17px] w-[17px] "
              />
            </span>
            <span className="ml-[10px]">
              <Link className="text-[#0782c5]">Chia sẻ </Link>
            </span>
          </span>
        </div>

        {/* <div className="flex-1 overflow-hidden text-gray-600 dark:text-slate-500 text-[1rem] text-justify">
          <Markdown options={{ wrapper: "article" }}>


          </Markdown>
        </div> */}

        {/* <div className="flex gap-2">


        </div> */}

        {/* <Link
          to={`/trip/${trip._id}`}
          className="flex items-center gap-2 text-black dark:text-white"
        >
          <span className="underline">Chỉnh sửa chuyến đi</span>
          <AiOutlineArrowRight />
        </Link> */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <span className="flex">
              <span className="bg-transparent border-[#0782c5] border rounded-full w-[24px] h-[24px] p-[2px]    ">
                <IconPencil
                  stroke={2}
                  className="text-[#0782c5] mt-[1px] h-[17px] w-[17px] "
                />
              </span>
              <span className="ml-[10px]">
                <Link to={`/trip/${trip._id}`} className="text-[#0782c5]">
                  Chỉnh sửa chuyến đi
                </Link>
              </span>
            </span>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button className="flex bg-transparent hover:bg-transparent">
                  <span className="bg-transparent border-[#0782c5] border rounded-full w-[24px] h-[24px] p-[2px]    ">
                    <IconDots
                      stroke={2}
                      className="text-[#0782c5] mt-[1px] h-[17px] w-[17px] "
                    />
                  </span>
                  <span className="ml-[10px]">
                    <div className="text-[#0782c5] flex items-center">
                      Chỉnh sửa chuyến đi{" "}
                      <IconChevronDown
                        stroke={2}
                        className="text-[#0782c5] ml-1   mt-[1px] h-[17px] w-[17px] "
                      />
                    </div>
                  </span>
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconSettings style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconMessageCircle
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                >
                  Messages
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconPhoto style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Gallery
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconSearch style={{ width: rem(14), height: rem(14) }} />
                  }
                  rightSection={
                    <Text size="xs" c="dimmed">
                      ⌘K
                    </Text>
                  }
                >
                  Search
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconArrowsLeftRight
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                >
                  Transfer my data
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={
                    <IconTrash style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Delete my account
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
  );
};

export default TripCard;
