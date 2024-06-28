import { Table, useMantineColorScheme } from "@mantine/core";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Loading, Pagination } from "../components";
import { useFollowers } from "../hooks/followers_hook";
import useStore from "../store/store";
import { IconCoinBitcoin } from "@tabler/icons-react";
import { formatNumber, getInitials, updateURL } from "../utils";

const Followers = () => {
  moment.updateLocale("vi", {
    relativeTime: {
      future: "trong %s",
      past: "%s trước",
      s: "vài giây",
      ss: "%d giây",
      m: "1 phút",
      mm: "%d phút",
      h: "1 giờ",
      hh: "%d giờ",
      d: "1 ngày",
      dd: "%d ngày",
      M: "1 tháng",
      MM: "%d tháng",
      y: "1 năm",
      yy: "%d năm",
    },
  });
  moment.locale("vi");

  const { colorScheme } = useMantineColorScheme();

  const { user } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isPending, mutate } = useFollowers(toast, user?.token);
  const [page, setPage] = useState(searchParams.get("page") || 1);

  const theme = colorScheme === "dark";

  const fetchData = () => {
    updateURL({ page, navigate, location });
    mutate(page);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="w-full flex flex-col">
      <p
        className={`${
          theme ? "text-white" : "text-slate-700"
        } text-lg pb-1 font-semibold `}
      >
        Người theo dõi (
        <span className="text-sm">
          {"Danh sách: " + data?.total + " người"}
        </span>
        )
      </p>

      <Table highlightOnHover withTableBorder className="flex-1">
        <Table.Thead>
          <Table.Tr className="bg-black text-white">
            <Table.Th>Tên</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Điểm Thưởng</Table.Th>
            <Table.Th>Người Theo Dõi</Table.Th>
            <Table.Th>Ngày Theo Dõi</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {data?.data?.map(({ _id, followerId, createdAt }) => (
            <Table.Tr
              key={_id}
              className={theme ? "text-gray-400" : `text-slate-600`}
            >
              <Table.Td className="flex gap-2 items-center">
                {followerId?.image ? (
                  <img
                    src={followerId?.image}
                    alt={followerId?.name}
                    className="w-10 h-10 rounded-full object-conver"
                  />
                ) : (
                  <p className="w-10 h-10 rounded-full flex justify-center items-center bg-indigo-700 text-white">
                    {getInitials(followerId.name)}
                  </p>
                )}

                <p className="text-base">{followerId?.name}</p>
              </Table.Td>
              <Table.Td>
                <p
                // className={`${
                //   followerId?.accountType === "User"
                //     ? "bg-sky-800 text-sky-800"
                //     : "bg-blue-800 text-blue-800"
                // }  bg-opacity-30 font-semibold px-4 py-1 rounded-full w-fit`}
                >
                  {followerId?.email}
                </p>
              </Table.Td>
              <Table.Td>
                <div class="flex justify-start space-x-1 font-semibold">
                  <div className="flex items-center text-yellow-500">
                    <IconCoinBitcoin size="1rem" stroke={2} />
                  </div>
                  <div>{followerId?.points}</div>
                  <div>Điểm</div>
                </div>
              </Table.Td>
              <Table.Td>
                <div className="flex gap-1 items-center">
                  {formatNumber(followerId?.followers.length ?? 0)}
                </div>
              </Table.Td>
              <Table.Td>{moment(createdAt).fromNow()}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>

        {data?.data?.length < 1 && (
          <Table.Caption>Không tìm thấy dữ liệu nào.</Table.Caption>
        )}
      </Table>

      <div className="w-full mt-5 flex items-center justify-center">
        <Pagination
          total={data?.numOgPages}
          onChange={(value) => setPage(value)}
        />
      </div>

      <Loading visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default Followers;
