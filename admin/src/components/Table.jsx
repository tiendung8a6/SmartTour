import { Table, Badge } from "@mantine/core";
import { IconCoinBitcoin } from "@tabler/icons-react";
import moment from "moment";
import "moment/locale/vi";
import { formatNumber, getInitials } from "../utils";

export const RecentTripsTable = ({ data, theme }) => {
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
      <Table.Td className="flex gap-2 items-center text-justify">
        {
          <img
            src={el?.image}
            alt={el?.tripName}
            className="w-10 h-10 object-conver"
          />
        }
        {el?.tripName}
      </Table.Td>
      <Table.Td>{el?.user?.email}</Table.Td>
      <Table.Td>{el?.city}</Table.Td>

      <Table.Td>
        {el?.status === true ? (
          <Badge fullWidth color="teal" size="lg">
            Công khai
          </Badge>
        ) : (
          <Badge fullWidth color="pink" size="lg">
            Đã ẩn
          </Badge>
        )}
      </Table.Td>

      <Table.Td>{moment(el?.createdAt).fromNow()}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr className="bg-black text-white">
          <Table.Th>Tên Chuyến Đi</Table.Th>
          <Table.Th>Tác Giả</Table.Th>
          <Table.Th>Thành Phố</Table.Th>
          <Table.Th>Trạng Thái</Table.Th>
          <Table.Th>Ngày Tạo</Table.Th>
        </Table.Tr>
      </Table.Thead>
      {data?.length === 0 && (
        <Table.Caption>Không tìm thấy dữ liệu nào.</Table.Caption>
      )}
      <Table.Tbody>{tableData}</Table.Tbody>
    </Table>
  );
};

export const RecentOrdersTable = ({ data, theme }) => {
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const tableData = data?.map((el) => (
    <Table.Tr
      key={el?._id}
      className={theme ? "text-gray-400" : "text-slate-600"}
    >
      <Table.Td>{el.orderNumber}</Table.Td>
      <Table.Td>
        {el?.payments === "VNPAY" ? (
          <Badge fullWidth color="blue" variant="light" size="lg">
            VNPAY
          </Badge>
        ) : (
          <Badge color="indigo" fullWidth variant="light" size="lg">
            STRIPE
          </Badge>
        )}
      </Table.Td>
      <Table.Td>{formatCurrency(el?.totalPrice)}</Table.Td>

      <Table.Td>{moment(el?.createdAt).fromNow()}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr className="bg-black text-white">
          <Table.Th>ID</Table.Th>
          <Table.Th>Phương Thức</Table.Th>
          <Table.Th>Giá Tiền</Table.Th>
          <Table.Th>Ngày Mua</Table.Th>
        </Table.Tr>
      </Table.Thead>
      {data?.length === 0 && (
        <Table.Caption>Không tìm thấy dữ liệu nào.</Table.Caption>
      )}
      <Table.Tbody>{tableData}</Table.Tbody>
    </Table>
  );
};

export const RecentPostsTable = ({ data, theme }) => {
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
          <p>{el?.title}</p>
          <span className="text-[10px] text-sky-600">
            <Badge w="fit-content" variant="light" size="md" color="blue">
              {el?.cat?.label}
            </Badge>
          </span>
        </div>
      </Table.Td>
      <Table.Td>{el?.user?.email}</Table.Td>
      <Table.Td>
        {el?.status === true ? (
          <Badge fullWidth color="teal" size="lg">
            Công khai
          </Badge>
        ) : (
          <Badge fullWidth color="pink" size="lg">
            Đã ẩn
          </Badge>
        )}
      </Table.Td>
      <Table.Td>{moment(el?.createdAt).fromNow()}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr className="bg-black text-white">
          <Table.Th>Tiêu Đề</Table.Th>
          <Table.Th>Tác Giả</Table.Th>
          <Table.Th>Trạng Thái</Table.Th>
          <Table.Th>Ngày Đăng</Table.Th>
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
  const tableData = data?.map((el) => (
    <Table.Tr
      key={el?._id}
      className={theme ? "text-gray-400" : "text-slate-600"}
    >
      <Table.Td className="flex gap-2 items-center">
        {el?.image ? (
          <img
            src={el.image}
            alt={el.name}
            className="w-10 h-10 rounded-full object-conver"
          />
        ) : (
          <p className="w-10 h-10 rounded-full flex justify-center items-center bg-indigo-700 text-white">
            {getInitials(el.name)}
          </p>
        )}
        <div>
          <p className="text-base  ">{el.name}</p>
          <div className="flex gap-3 items-center">
            <div class="flex justify-start space-x-1 font-semibold">
              <div className="flex items-center text-yellow-500">
                <IconCoinBitcoin size="1rem" stroke={2} />
              </div>
              <div>{el?.points}</div>
              <div>Điểm</div>
            </div>
          </div>
        </div>
      </Table.Td>
      <Table.Td className="text-center">
        {moment(el.createdAt).fromNow()}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr className="bg-black text-white">
          <Table.Th>Tên</Table.Th>
          <Table.Th>Ngày Lập Tài Khoản</Table.Th>
        </Table.Tr>
      </Table.Thead>
      {data?.length === 0 && (
        <Table.Caption>Không tìm thấy dữ liệu nào.</Table.Caption>
      )}
      <Table.Tbody>{tableData}</Table.Tbody>
    </Table>
  );
};
