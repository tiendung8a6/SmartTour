import { Select, useMantineColorScheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  GraphA,
  GraphB,
  Loading,
  Stats,
  RecentFollowersTable,
  RecentPostsTable,
  Chart,
  DoughnutChart,
  RecentTripsTable,
  RecentOrdersTable,
} from "../components";
import { useAnalytics } from "../hooks/post-hook";
import useStore from "../store/store";
import { IconFilterShare } from "@tabler/icons-react";
const Analytics = () => {
  const isMobile = useMediaQuery("(max-width: 50em)");

  const { colorScheme } = useMantineColorScheme();

  const { user } = useStore();
  const [numOfDays, setNumberOfDays] = useState(28);

  const { data, isPending, mutate } = useAnalytics(toast, user?.token);

  const theme = colorScheme === "dark";

  useEffect(() => {
    mutate(numOfDays);
  }, [numOfDays]);

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between mb-3">
        <p
          className={`${
            theme ? "text-white" : "text-slate-700"
          } flex-1 text-xl font-semibold text-slate-700`}
        >
          Thống kê
        </p>
        <Select
          // label=""
          defaultValue="28 ngày"
          placeholder="Filter"
          data={["7 ngày", "28 ngày", "90 ngày", "365 ngày"]}
          onChange={(val) => setNumberOfDays(val?.split(" ")[0])}
          w={isMobile && 110}
        />
      </div>

      <Stats dt={data} />

      <div className="w-full flex flex-col-reverse md:flex-row items-center gap-10 py-8">
        <div className="w-full md:w-1/3 flex flex-col items-center ">
          <p className="py-5 text-base font-medium ">
            Tổng tiền thanh toán trong {numOfDays} ngày qua
          </p>
          <DoughnutChart dt={data?.paymentStats} />
        </div>

        <div className="w-full md:w-2/3">
          <p className="py-5 text-base font-medium text-center">
            Thanh toán thành công trong {numOfDays} ngày qua
          </p>
          <Chart dt={data?.orderStats} />
        </div>
      </div>

      <div className="w-full py-8">
        <p className="py-5 text-base font-medium ">
          Bài viết đã đăng trong {numOfDays} ngày qua
        </p>
        <GraphA dt={data?.postStats} />
      </div>

      <div className="w-full py-8">
        <p className="py-5 text-base font-medium ">
          Kế hoạch đã lập trong {numOfDays} ngày qua
        </p>
        <GraphB dt={data?.tripsStats} />
      </div>

      <div className="flex gap-6 flex-col md:flex-row py-5">
        <div className="w-full md:w-2/3 flex flex-col">
          <span
            className={`${
              theme ? "text-white" : "text-slate-600"
            } py-5 text-base font-medium`}
          >
            Kế hoạch chuyến đi gần đây
          </span>
          <RecentTripsTable data={data?.last5Trips} theme={theme} />
        </div>

        <div className="w-full md:w-1/3 flex flex-col">
          <span
            className={`${
              theme ? "text-white" : "text-slate-600"
            } py-5 text-base font-medium`}
          >
            Giao dịch thanh toán thành công gần đây
          </span>
          <RecentOrdersTable data={data?.last5Orders} theme={theme} />
        </div>
      </div>

      <div className="flex gap-6 flex-col md:flex-row py-5">
        {/* Bài viết */}
        <div className="w-full md:w-2/3 flex flex-col ">
          <span
            className={`${
              theme ? "text-white" : "text-slate-600"
            } py-5 text-base font-medium`}
          >
            Bài viết gần đây
          </span>
          <RecentPostsTable data={data?.last5Posts} theme={theme} />
        </div>

        {/* Người dùng */}
        <div className="w-full md:w-1/3 flex flex-col">
          <span
            className={`${
              theme ? "text-white" : "text-slate-600"
            } py-5 text-base font-medium`}
          >
            Bảng xếp hạng người dùng
          </span>
          <RecentFollowersTable data={data?.top5UsersByPoints} theme={theme} />
        </div>
      </div>

      <Loading visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default Analytics;
