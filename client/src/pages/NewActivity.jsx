import { Button, TextInput, useMantineColorScheme, Grid } from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { LoadingClient } from "../components";
import { useCreatePlant } from "../hooks/client-hook";
import useStore from "../store";
import { uploadFile } from "../utils";
import { DateInput } from "@mantine/dates";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ActionIcon, rem } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import React from "react";
import { useParams } from "react-router-dom";

const NewActivity = () => {
  const { colorScheme } = useMantineColorScheme();
  const { id } = useParams();
  const { user } = useStore();
  const [visible, { toggle }] = useDisclosure(false);
  const { isPending, mutate } = useCreatePlant(id, toast, user?.token);
  const [planName, setPlanName] = useState(null);
  const [address, setAddress] = useState(null);
  const [info, setInfo] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const theme = colorScheme === "dark";

  const handleSubmit = async () => {
    if (!planName) {
      toast.error("planName is required.");
      return;
    }
    if (!address) {
      toast.error("address is required.");
      return;
    }
    if (!info) {
      toast.error("info is required.");
      return;
    }
    if (!startDate) {
      toast.error("startDate is required.");
      return;
    }
    if (!endDate) {
      toast.error("endDate is required.");
      return;
    }
    mutate({
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
    });
  };

  return (
    <div className="px-[100px] ">
      <Link to="/trip"> --- Quay Lại</Link>
      <p
        className={`${
          theme ? "text-white" : "text-slate-700"
        } text-lg pb-1 font-semibold `}
      >
        Thêm hoạt động
      </p>
      <br />

      <Grid className="">
        <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5 mt-6">
            <TextInput
              withAsterisk
              label="Tên Sự Kiện"
              className="w-full flex-1"
              placeholder="Tên Sự Kiện"
              onChange={(e) => setPlanName(e.target.value)}
            />
          </div>

          <Grid className="mt-6">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
                <DateInput
                  leftSection={
                    <IconCalendarEvent className="text-[#107ac5]" size={24} />
                  }
                  clearable
                  withAsterisk
                  label="Ngày Bắt Đầu"
                  className="w-full flex-1"
                  placeholder="Ngày Bắt Đầu"
                  minDate={new Date()}
                  valueFormat="DD/MM/YYYY"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
                <TimeInput
                  ref={startTimeRef}
                  label="Thời Gian Bắt Đầu"
                  withAsterisk
                  // description="Input description"
                  placeholder="Thời Gian Bắt Đầu"
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </Grid.Col>
          </Grid>
          <Grid className="mt-6">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
                <DateInput
                  leftSection={
                    <IconCalendarEvent className="text-[#107ac5]" size={24} />
                  }
                  clearable
                  withAsterisk
                  label="Ngày Kết Thúc"
                  className="w-full flex-1"
                  placeholder="Ngày Kết Thúc"
                  valueFormat="DD/MM/YYYY"
                  minDate={startDate}
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                />
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
                <TimeInput
                  ref={endTimeRef}
                  label="Thời Gian Kết Thúc"
                  withAsterisk
                  // description="Input description"
                  placeholder="Thời Gian Kết Thúc"
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </Grid.Col>
          </Grid>
          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5 mt-6">
            <TextInput
              withAsterisk
              label="address"
              className="w-full flex-1"
              placeholder="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5 mt-6">
            <TextInput
              withAsterisk
              label="info"
              className="w-full flex-1"
              placeholder="info"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
            />
          </div>
        </Grid.Col>
      </Grid>

      <div className="flex justify-start gap-3">
        <div className=" flex items-end justify-start mt-6">
          <Button
            variant="light"
            color="indigo"
            size="md"
            radius="md"
            onClick={() => handleSubmit()}
          >
            Lưu
          </Button>
        </div>

        <div className=" flex items-end justify-start mt-6">
          <Link to="/trip/">
            <Button variant="outline" color="Red" size="md" radius="md">
              Hủy
            </Button>
          </Link>
        </div>
      </div>

      <LoadingClient visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default NewActivity;
