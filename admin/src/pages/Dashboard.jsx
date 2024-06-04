import { useMantineColorScheme } from "@mantine/core";
import React, { useEffect } from "react";
import { Toaster, toast } from "sonner";
import {
  GraphA,
  Loading,
  RecentFollowersTable,
  RecentPostsTable,
  Stats,
} from "../components";

import { useAnalytics } from "../hooks/post-hook";
import useStore from "../store/store";

const Dashboard = () => {
  const { colorScheme } = useMantineColorScheme();

  const { user } = useStore();
  const { data, isPending, mutate } = useAnalytics(toast, user?.token);
  const theme = colorScheme === "dark";

  const fetchData = () => {
    mutate();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <Stats dt={data} />

      <div className="w-full py-8">
        <p className="py-5 text-base font-medium ">
          View Stats for last 28 days
        </p>
        <GraphA dt={data?.viewStats} />
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
          <RecentPostsTable data={data?.last5Posts} theme={theme} />
        </div>
      </div>

      <Loading visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default Dashboard;
