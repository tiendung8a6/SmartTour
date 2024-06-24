import React from "react";
import { Link } from "react-router-dom";
import { Pagination } from "../components";
import { useTrips } from "../hooks/trip_hooks";
import {
  TextInput,
  rem,
  ActionIcon,
  Badge,
  Card,
  Avatar,
  Text,
  Group,
  Space,
  Center,
  Pill,
  Image,
} from "@mantine/core";
import { IconView360 } from "@tabler/icons-react";
import classes from "./PublicTripCard.module.css";
import { getPublicTrips } from "../utils/apiCalls";
import { useEffect, useState } from "react";
import moment from "moment";
import { useActivateTrip } from "../hooks/client-hook";
import { ConfirmDialog, LoadingClient } from "../components";
import { useDisclosure } from "@mantine/hooks";
import { Toaster, toast } from "sonner";
import useStore from "../store";
import { getUser } from "../utils/apiCalls";

// Icon
import { IconSearch, IconArrowRight } from "@tabler/icons-react";
const PublicTripsPanel = () => {
  const { user } = useStore();

  const { trips, numOfPages, setPage } = useTrips();
  const [confirmActivation, setConfirmActivation] = useState(false);
  const [selected, setSelected] = useState("");
  const [type, setType] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const activateTrip = useActivateTrip(toast, user?.token);
  const [publicTrip, setPublicTrip] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const handlePageChange = (val) => {
    setPage(val);
  };

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
  console.log("publicTrip", publicTrip);
  console.log("getUser", userInfo);

  //TRUY VẤN DỮ NGƯỜI DÙNG --> Cập nhật Real-Time
  const fetchUser = async () => {
    try {
      const data = await getUser(user?.user?._id);

      setUserInfo(data || []);
    } catch (error) {
      console.error("Error fetching trip or popular content:", error);
    } finally {
    }
  };
  useEffect(() => {
    if (user?.user?._id) {
      fetchUser();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [user?.user?._id]);

  const handleActions = () => {
    switch (type) {
      case "activate":
        activateTrip.mutate(selected);
        break;

      default:
        break;
    }
    // fetchData();
    setIsConfirmDialogOpen(false);
  };

  const handlePerformAction = (val, id) => {
    setConfirmActivation(false);
    setSelected(id);
    setType(val);
    setIsConfirmDialogOpen(true);
  };

  if (publicTrip?.length < 1)
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-lg text-slate-500 dark:text-white">
          Chưa có chuyến đi nào được công khai
        </span>
      </div>
    );

  return (
    <div>
      <div className="mt-6 md:mt-0">
        <div className="w-full flex justify-center items-center flex-wrap py-5 gap-7">
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
            {userInfo?.viewedTrips.includes(publicTrip?._id) && (
              <div className="absolute top-0 right-0">
                <div className="w-32 h-8 absolute top-4 -right-8">
                  <div className="h-full w-full bg-sky-600 text-white text-base text-center leading-8 font-semibold transform rotate-45">
                    SỠ HỮU
                  </div>
                </div>
              </div>
            )}
            <Group className="dark:bg-[#05132b]" wrap="nowrap" gap={0}>
              <div className="w-full h-auto md:h-[275px] md:w-1/4 lg:w-[380px] hidden md:block ">
                <Image
                  src={publicTrip?.image}
                  alt={publicTrip?.image}
                  className="object-cover w-full md:h-[100%] rounded"
                />
              </div>

              <div className={classes.body}>
                <Badge w="fit-content" variant="light" size="md">
                  <p className="dark:text-teal-500"> {publicTrip?.city}</p>
                </Badge>
                <Text className={classes.title} mt="xs" mb="md">
                  <p className="dark:text-white">{publicTrip?.tripName}</p>
                </Text>
                <Group wrap="nowrap" gap="xs">
                  <Group gap="xs" wrap="nowrap">
                    <Avatar
                      size={30}
                      src={publicTrip?.user?.image}
                      alt="Ảnh cá nhân"
                    />
                    <Text size="sm">
                      <p className="dark:text-gray-100">
                        {publicTrip?.user?.name}
                      </p>
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed">
                    <p className="dark:text-gray-400">•</p>
                  </Text>
                  <Text size="xs" c="dimmed">
                    <p className="dark:text-gray-400">
                      {moment(publicTrip?.createdAt).format("L")}
                    </p>
                  </Text>
                </Group>

                <Space h="sm" />
                <Text
                  lineClamp={3}
                  tt="uppercase"
                  c="dimmed"
                  fw={700}
                  size="xs"
                >
                  <p className="dark:text-gray-400">
                    {publicTrip?.description}
                  </p>
                </Text>

                <Space h="sm" />
                <Group gap="xs">
                  {publicTrip?.hashtag.map((tag, index) => (
                    <Pill key={index} className="text-cyan-600">
                      <p className="dark:text-cyan-500">{tag}</p>
                    </Pill>
                  ))}
                </Group>

                <Space h="sm" />

                <Group gap="xs" wrap="nowrap">
                  <ActionIcon
                    variant="filled"
                    radius="xl"
                    aria-label="Settings"
                  >
                    <IconView360
                      style={{ width: "80%", height: "80%" }}
                      stroke={1.5}
                    />
                  </ActionIcon>

                  <Text
                    c="blue"
                    fw={500}
                    // size="sm"
                    class="cursor-pointer text-base"
                    onClick={() => {
                      const isViewed = userInfo?.viewedTrips.includes(
                        publicTrip?._id
                      );
                      if (isViewed) {
                        window.location.href = `/trip/${publicTrip._id}/public`;
                      } else {
                        handlePerformAction("activate", publicTrip?._id);
                      }
                    }}
                  >
                    Xem chuyến đi
                  </Text>
                </Group>
              </div>
            </Group>
          </Card>
        ))}
        {!confirmActivation && !opened && (
          <ConfirmDialog
            message="Để xem chuyến đi này bạn sẽ phải bị trừ 10 điểm. Bạn chắc chắc muốn thực hiện việc xem nó?"
            opened={isConfirmDialogOpen}
            close={() => setIsConfirmDialogOpen(false)}
            handleClick={handleActions}
          />
        )}
        {/* <LoadingClient visible={isPending} /> */}
        <Toaster richColors />
        <div className="w-full flex items-center justify-center">
          {/* <Pagination totalPages={numOfPages} onPageChange={handlePageChange} /> */}
        </div>
      </div>
    </div>
  );
};

export default PublicTripsPanel;
