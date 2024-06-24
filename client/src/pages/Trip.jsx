import React from "react";
import { Link } from "react-router-dom";
import { Tabs, rem } from "@mantine/core";
import MyTripsPanel from "./MyTripsPanel";
import PublicTripsPanel from "./PublicTripsPanel";
// Icon
import { IconLuggage, IconAirBalloon } from "@tabler/icons-react";

const Trip = () => {
  return (
    <div className="py-10 2xl:py-5">
      <div className="px-0 lg:pl-20 2xl:px-20 ">
        <Tabs color="teal" background="red" defaultValue="first">
          <Tabs.List>
            <Tabs.Tab
              value="first"
              leftSection={
                <IconLuggage style={{ width: rem(15), height: rem(15) }} />
              }
              className="dark:text-white dark:hover:bg-slate-700"
            >
              Chuyến đi của tôi
            </Tabs.Tab>
            <Tabs.Tab
              value="second"
              color="blue"
              leftSection={
                <IconAirBalloon style={{ width: rem(15), height: rem(15) }} />
              }
              className="dark:text-white dark:hover:bg-slate-700"
            >
              Chuyến đi công khai
            </Tabs.Tab>
          </Tabs.List>

          {/* CHUYẾN ĐI CỦA TÔI */}
          <Tabs.Panel value="first" pt="xs">
            <MyTripsPanel />
          </Tabs.Panel>

          <Tabs.Panel value="second" pt="xs">
            <PublicTripsPanel />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default Trip;
