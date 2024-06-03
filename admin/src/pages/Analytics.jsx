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
  RecentPostTable,
  Chart,
  DoughnutChart,
  Transactions,
  Accounts,
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
          // label='Range'
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
            Tổng phương thức thanh toán {numOfDays} ngày qua
          </p>
          <DoughnutChart dt={data?.paymentStats} />
        </div>

        <div className="w-full md:w-2/3">
          <p className="py-5 text-base font-medium text-center">
            Tổng thanh toán {numOfDays} ngày qua
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

      <div className="flex flex-col-reverse md:flex-row gap-0 md:gap-10 2xl:gap-10">
        <div className="py-8 w-full md:w-2/3">
          <p
            className={`${
              theme ? "text-white" : "text-gray-600"
            } text-2xl 2xl:text-3xl font-semibold`}
          >
            Latest Transactions
          </p>
          <Transactions />
        </div>

        <div className="mt-20 md:mt-0 py-5 md:py-8 md:w-1/3">
          <p className="text-2xl 2xl:text-3xl font-semibold text-gray-600 dark:text-gray-500">
            Accounts
          </p>
          {/* <span className="text-sm text-gray-600 dark:text-gray-500">
            View all your accounts
          </span> */}
          <Accounts />
        </div>
      </div>

      <div className="flex gap-6 flex-col md:flex-row py-5">
        {/* TopFiveContent */}
        <div className="w-full md:w-2/3 flex flex-col ">
          <span
            className={`${
              theme ? "text-white" : "text-slate-600"
            } py-5 text-base font-medium`}
          >
            Bài viết gần đây
          </span>
          <RecentPostTable data={data?.last5Posts} theme={theme} />
        </div>

        {/* Recent Followerst */}
        <div className="w-full md:w-1/3 flex flex-col">
          <span
            className={`${
              theme ? "text-white" : "text-slate-600"
            } py-5 text-base font-medium`}
          >
            Người theo dõi gần đây
          </span>
          <RecentFollowersTable data={data?.last5Followers} theme={theme} />
        </div>
      </div>

      <Loading visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default Analytics;
