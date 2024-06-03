import { Table, Badge } from "@mantine/core";
import moment from "moment";
import "moment/locale/vi";
import { formatNumber, getInitials } from "../utils";

export const RecentPostTable = ({ data, theme }) => {
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
  const tableData = data?.map((el) => (
    <Table.Tr
      key={el?._id}
      className={theme ? "text-gray-400" : "text-slate-600"}
    >
      <Table.Td className="flex gap-2 items-center">
        {
          <img
            src={el?.img}
            alt={el?.title}
            className="w-10 h-10 rounded-full object-conver"
          />
        }
        <div>
          <p className="text-base text-black">{el?.title}</p>
          <span className="text-[10px] text-sky-600">
            <Badge w="fit-content" variant="light" size="md" color="blue">
              {el?.cat?.label}
            </Badge>
          </span>
        </div>
      </Table.Td>
      <Table.Td>{el?.user?.email}</Table.Td>
      <Table.Td>{moment(el?.createdAt).fromNow()}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr className="bg-gray-600 text-white">
          <Table.Th>Tiêu đề</Table.Th>
          <Table.Th>Tác giả</Table.Th>
          <Table.Th>Ngày đăng</Table.Th>
        </Table.Tr>
      </Table.Thead>
      {data?.length === 0 && (
        <Table.Caption>Không tìm thấy dữ liệu nào.</Table.Caption>
      )}
      <Table.Tbody>{tableData}</Table.Tbody>
    </Table>
  );
};

export const RecentFollowersTable = ({ data, theme }) => {
  const tableData = data?.map(({ _id, createdAt, followerId: follower }) => (
    <Table.Tr key={_id} className={theme ? "text-gray-400" : "text-slate-600"}>
      <Table.Td className="flex gap-2 items-center">
        {follower?.image ? (
          <img
            src={follower.image}
            alt={follower.name}
            className="w-10 h-10 rounded-full object-conver"
          />
        ) : (
          <p className="w-10 h-10 rounded-full flex justify-center items-center bg-indigo-700 text-white">
            {getInitials(follower.name)}
          </p>
        )}
        <div>
          <p className="text-base  ">{follower.name}</p>
          <div className="flex gap-3 items-center">
            <span className="text-xs text-sky-600">{follower.accountType}</span>
            {follower.followers?.length > 0 && (
              <span className="text-sm text-slate-600 font-bold">
                {formatNumber(follower.followers?.length)}
              </span>
            )}
          </div>
        </div>
      </Table.Td>
      <Table.Td>{moment(createdAt).fromNow()}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr className="bg-gray-600 text-white">
          <Table.Th>Tên</Table.Th>
          <Table.Th>Ngày theo dõi</Table.Th>
        </Table.Tr>
      </Table.Thead>
      {data?.length === 0 && (
        <Table.Caption>Không tìm thấy dữ liệu nào.</Table.Caption>
      )}
      <Table.Tbody>{tableData}</Table.Tbody>
    </Table>
  );
};
