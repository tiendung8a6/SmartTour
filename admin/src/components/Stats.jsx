import { Group, Paper, SimpleGrid, Text } from "@mantine/core";
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";
import { BsPostcardHeart } from "react-icons/bs";
import { FaUsers, FaFly } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";

import { formatNumber } from "../utils";
const icons = {
  post: BsPostcardHeart,
  trips: FaFly,
  order: GiReceiveMoney,
  users: FaUsers,
};

const formatCurrency = (value) => {
  const valueInMillions = value / 1000000;
  return `${valueInMillions.toFixed(1)} triệu`;
};

export const Stats = ({ dt }) => {
  const data = [
    {
      title: "TỔNG TIỀN GIAO DỊCH (VND)",
      icon: "order",
      value: formatCurrency(dt?.totalOrder ?? 0),
      diff: +39,
    },
    {
      title: "KẾ HOẠCH",
      icon: "trips",
      value: formatNumber(dt?.totalTrips ?? 0),
      diff: +26,
    },
    {
      title: "BÀI VIẾT",
      icon: "post",
      value: formatNumber(dt?.totalPosts ?? 0),
      diff: +15,
    },
    {
      title: "NGƯỜI DÙNG",
      icon: "users",
      value: formatNumber(dt?.totalUsers ?? 0),
      diff: -5,
    },
  ];

  const stats = data?.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text className={"capitalize text-sm "}>{stat.title}</Text>
          <Icon className={""} size="1.4rem" stroke={1.5} />
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text className={"text-2xl 2xl:text-4xl font-semibold "}>
            {stat.value}
          </Text>
          <Text
            c={stat.diff > 0 ? "teal" : "red"}
            fz="sm"
            fw={500}
            className={"font-medium"}
          >
            <span>{stat?.diff}%</span>
            <DiffIcon size="1rem" stroke={1.5} />
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          So với tháng trước
        </Text>
      </Paper>
    );
  });

  return <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>;
};
