import { Select, useMantineColorScheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Graph,
  Loading,
  Stats,
  RecentFollowersTable,
  RecentPostTable,
} from "../components";
import { useAnalytics } from "../hooks/post-hook";
import useStore from "../store/store";

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
          Analytics
        </p>
        <Select
          // label='Range'
          defaultValue="28 days"
          placeholder="Filter"
          data={["7 days", "28 days", "90 days", "365 days"]}
          onChange={(val) => setNumberOfDays(val?.split(" ")[0])}
          w={isMobile && 110}
        />
      </div>

      <Stats dt={data} />

      <div className="w-full py-8">
        <p className="py-5 text-base font-medium ">
          View Stats for last {numOfDays} days
        </p>
        <Graph dt={data?.viewStats} />
      </div>

      <div className="w-full py-8">
        <p className="py-5 text-base font-medium ">
          Followers Stats for last {numOfDays} days
        </p>
        <Graph dt={data?.followersStats} />
      </div>

      <div className="flex gap-6 flex-col md:flex-row py-5">
        {/* Recent Followerst */}{" "}
        <div className="w-full md:w-1/3 flex flex-col">
          <span
            className={`${
              theme ? "text-white" : "text-slate-600"
            } py-5 text-base font-medium`}
          >
            Recent 5 Followers
          </span>
          <RecentFollowersTable data={data?.last5Followers} theme={theme} />
        </div>
        {/* TopFiveContent */}
        <div className="w-full md:w-2/3 flex flex-col ">
          <span
            className={`${
              theme ? "text-white" : "text-slate-600"
            } py-5 text-base font-medium`}
          >
            Recent 5 Content
          </span>
          <RecentPostTable data={data?.last5Posts} theme={theme} />
        </div>
      </div>

      <Loading visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default Analytics;
