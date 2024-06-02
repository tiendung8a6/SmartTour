import React from "react";
import { Link } from "react-router-dom";
import { TripCard, Pagination } from "../components";
import { useTrips } from "../hooks/trip_hooks";
import {
  Tabs,
  TextInput,
  rem,
  Grid,
  Button,
  ActionIcon,
  Badge,
  Card,
  Image,
  Avatar,
  Text,
  Group,
} from "@mantine/core";
import classes from "./PublicTripCard.module.css";
import { getPublicTrips } from "../utils/apiCalls";
import { useEffect, useState } from "react";
import moment from "moment";

// Icon
import {
  IconPlus,
  IconSearch,
  IconPlaneTilt,
  IconBed,
  IconCar,
  IconSoup,
  IconCalendarStats,
  IconMapPinCheck,
  IconShip,
  IconWalk,
  IconParkingCircle,
  IconTrain,
  IconLuggage,
  IconAirBalloon,
  IconArrowRight,
} from "@tabler/icons-react";
import {} from "@tabler/icons-react";
const PublicTripsPanel = () => {
  const { trips, numOfPages, setPage } = useTrips();

  const handlePageChange = (val) => {
    setPage(val);
  };

  const [publicTrip, setPublicTrip] = useState(null);

  const fetchPublicTrip = async () => {
    try {
      const data = await getPublicTrips();

      setPublicTrip(data || []);
    } catch (error) {
      console.error("Error fetching trip or popular content:", error);
    } finally {
    }
  };

  useEffect(() => {
    //Fix Bug API được gọi nhiều lần
    const fetchPublicTrip = async () => {
      try {
        const data = await getPublicTrips();
        setPublicTrip(data || []);
      } catch (error) {
        console.error("Error fetching trip or popular content:", error);
      }
    };

    fetchPublicTrip();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  // console.log("publicTrip", publicTrip);

  if (publicTrip?.length < 1)
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-lg text-slate-500">
          Chưa có chuyến đi nào được công khai
        </span>
      </div>
    );

  return (
    <div>
      <div className="mt-6 md:mt-0">
        <div className="w-full flex justify-center items-center flex-wrap py-5 gap-7">
          {/* <Link
            to={`/trip/create`}
            className={`flex items-center justify-center gap-3  dark:border-gray-600  text-[#0782c5] dark:text-white font-semibold text-base  mt-[-10px] cursor-pointer`}
          >
            <span className="border rounded-full border-[#0782c5]">
              <IconPlus stroke={2} />
            </span>
            Thêm chuyến đi
          </Link> */}
          <TextInput
            className="w-[30%]"
            placeholder="Tìm kiếm"
            radius="xl"
            size="md"
            rightSectionPointerEvents="none"
            rightSectionWidth={42}
            leftSection={
              <IconSearch
                stroke={2}
                style={{ width: rem(16), height: rem(16) }}
              />
            }
            rightSection={
              <ActionIcon size={32} radius="xl" variant="filled">
                <IconArrowRight
                  style={{ width: rem(18), height: rem(18) }}
                  stroke={1.5}
                />
              </ActionIcon>
            }
          />
        </div>
      </div>
      <div className="w-full lg:w-full md:w-full flex flex-col gap-y-28 md:gap-y-14">
        {publicTrip?.map((publicTrip, index) => (
          <Card withBorder radius="md" p={0} className={classes.card}>
            <Group wrap="nowrap" gap={0}>
              <Link
                to={`/trip/${publicTrip._id}`}
                className="w-full h-auto md:h-64 md:w-1/4 lg:w-[380px] hidden md:block "
              >
                <img
                  src={publicTrip?.image}
                  alt={publicTrip?.image}
                  className="object-cover w-full md:h-[100%] rounded"
                />
              </Link>
              <div className={classes.body}>
                {/* <Text tt="uppercase" c="dimmed" fw={700} size="xs">
                  
                </Text> */}
                <Badge w="fit-content" variant="light" size="md">
                  {publicTrip?.city}
                </Badge>
                <Text className={classes.title} mt="xs" mb="md">
                  {publicTrip?.tripName}
                </Text>
                <Group wrap="nowrap" gap="xs">
                  <Group gap="xs" wrap="nowrap">
                    <Avatar
                      size={30}
                      src={publicTrip?.user?.image}
                      alt="Ảnh cá nhân"
                    />
                    <Text size="sm">{publicTrip?.user?.name}</Text>
                  </Group>
                  <Text size="xs" c="dimmed">
                    •
                  </Text>
                  <Text size="xs" c="dimmed">
                    {moment(publicTrip?.createdAt).format("L")}
                  </Text>
                </Group>
              </div>
            </Group>
          </Card>
        ))}

        <div className="w-full flex items-center justify-center">
          <Pagination totalPages={numOfPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
};

export default PublicTripsPanel;
