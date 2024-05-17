import { Button, TextInput, useMantineColorScheme, Grid } from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { LoadingClient } from "../components";
import { useCreateLodgingPlan } from "../hooks/client-hook";
import useStore from "../store";
import { DateInput } from "@mantine/dates";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ActionIcon, rem } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { IconClock, IconArrowLeft } from "@tabler/icons-react";
import React from "react";
import { useParams } from "react-router-dom";
import { getSingleTrip } from "../utils/apiCalls";
const NewLodging = () => {
  const { colorScheme } = useMantineColorScheme();
  const { id } = useParams();
  const { user } = useStore();
  const [visible, { toggle }] = useDisclosure(false);
  const { isPending, mutate } = useCreateLodgingPlan(id, toast, user?.token);
  const [planName, setPlanName] = useState(null);
  const [startAddress, setStartAddress] = useState(null);
  const [info, setInfo] = useState(null);
  const [phone, setPhone] = useState(null);
  const [web, setWeb] = useState(null);
  const [email, setEmail] = useState(null);
  const [number, setNumber] = useState(null);
  const [describe, setDescribe] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const theme = colorScheme === "dark";

  const { setIsLoading } = useStore();
  const [trip, setTrip] = useState(null);

  const pickerStartTimeControl = (
    <ActionIcon
      className="text-[#107ac5]"
      size={30}
      variant="subtle"
      color="gray"
      onClick={() => startTimeRef.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={3} />
    </ActionIcon>
  );
  const pickerEndTimeControl = (
    <ActionIcon
      className="text-[#107ac5]"
      size={30}
      variant="subtle"
      color="gray"
      onClick={() => endTimeRef.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={3} />
    </ActionIcon>
  );
  const handleSubmit = async () => {
    if (!planName) {
      toast.error("Vui lòng nhập tên chỗ ở.");
      return;
    }
    if (!startDate) {
      toast.error("Vui lòng chọn ngày nhận phòng.");
      return;
    }
    if (!endDate) {
      toast.error("Vui lòng chọn ngày trả phòng.");
      return;
    }
    if (endDate < startDate) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng.");
      return;
    }
    if (!startTime) {
      toast.error("Vui lòng chọn thời gian nhận phòng.");
      return;
    }
    if (!endTime) {
      toast.error("Vui lòng chọn thời gian trả phòng.");
      return;
    }
    if (endDate.getTime() === startDate.getTime()) {
      if (endTime <= startTime) {
        toast.error(
          "Thời gian trả phòng phải sau thời gian nhận phòng nếu trong cùng một ngày."
        );
        return;
      }
    }
    setIsLoading(true);
    mutate({
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      startAddress,
      info,
      phone,
      web,
      email,
      number,
      describe,
    });
  };

  const fetchTrip = async () => {
    try {
      const data = await getSingleTrip(id);

      setTrip(data || []);
    } catch (error) {
      console.error("Error fetching trip or popular content:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (id) {
      fetchTrip();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [id]);
  return (
    <div className="px-[100px] mb-10">
      <Link to={`/trip/${trip?._id}/plans/create`}>
        <Button
          className="border-none hover:text-[#0782c5] hover:bg-transparent flex justify-start ml-[-20px] "
          leftSection={<IconArrowLeft className="text-[#0782c5]" size={30} />}
          variant="default"
          color="#0782c5"
          size="md"
        >
          <span className="text-[#0782c5]">Quay Lại</span>
        </Button>
      </Link>
      <p
        className={`${
          theme ? "text-white" : "text-slate-700"
        } text-2xl font-semibold mt-4`}
      >
        Thêm chỗ ở
      </p>
      <br />

      <Grid className="">
        <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-[20px] mt-[-5px]">
            <TextInput
              withAsterisk
              label="Tên chỗ ở"
              className="w-full flex-1"
              placeholder="Nhập tên chỗ ở"
              onChange={(e) => setPlanName(e.target.value)}
            />
          </div>

          <Grid className="mt-[24px]">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
                <DateInput
                  leftSection={
                    <IconCalendarEvent className="text-[#107ac5]" size={24} />
                  }
                  clearable
                  withAsterisk
                  label="Ngày nhận phòng"
                  className="w-full flex-1"
                  placeholder="Chọn ngày nhận phòng"
                  minDate={new Date(trip?.startDate)}
                  maxDate={new Date(trip?.endDate)}
                  valueFormat="DD/MM/YYYY"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full ">
                <TimeInput
                  ref={startTimeRef}
                  label="Thời gian nhận phòng"
                  leftSection={pickerStartTimeControl}
                  withAsterisk
                  // description="Input description"
                  placeholder="Chọn thời gian nhận phòng"
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </Grid.Col>
          </Grid>

          <Grid className="mt-[5px]">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
                <DateInput
                  leftSection={
                    <IconCalendarEvent className="text-[#107ac5]" size={24} />
                  }
                  clearable
                  withAsterisk
                  label="Ngày trả phòng"
                  className="w-full flex-1"
                  placeholder="Chọn ngày trả phòng"
                  valueFormat="DD/MM/YYYY"
                  minDate={new Date(trip?.startDate)}
                  maxDate={new Date(trip?.endDate)}
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                />
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full ">
                <TimeInput
                  ref={endTimeRef}
                  label="Thời gian trả phòng"
                  leftSection={pickerEndTimeControl}
                  withAsterisk
                  // description="Input description"
                  placeholder="Chọn thời gian trả phòng"
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </Grid.Col>
          </Grid>

          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5  mb-[20px] mt-[5px]">
            <TextInput
              // withAsterisk
              label="Địa chỉ"
              className="w-full flex-1"
              placeholder="Nhập địa chỉ"
              value={startAddress}
              onChange={(e) => setStartAddress(e.target.value)}
            />
          </div>

          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5  mb-[20px] mt-[24px]">
            <TextInput
              // withAsterisk
              label="Điện thoại"
              className="w-full flex-1"
              placeholder="Nhập điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5  mb-[20px] mt-[24px]">
            <TextInput
              // withAsterisk
              label="Trang Web "
              className="w-full flex-1"
              placeholder="Nhập trang web"
              value={web}
              onChange={(e) => setWeb(e.target.value)}
            />
          </div>

          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5  mb-[20px] mt-[24px]">
            <TextInput
              // withAsterisk
              label="Email"
              className="w-full flex-1"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5  mb-[20px] mt-[24px]">
            <TextInput
              // withAsterisk
              label="Thông tin thêm"
              className="w-full flex-1"
              placeholder="Nhập thông tin "
              value={info}
              onChange={(e) => setInfo(e.target.value)}
            />
          </div>
          <div className="mt-[25px] text-lg	text-black	">
            <p
              className={`${
                theme ? "text-white" : "text-slate-700"
              } text-base	 font-semibold`}
            >
              Thông Tin Phòng
            </p>
            <div className="w-[50%] flex flex-col md:flex-row flex-wrap gap-5  mb-[20px] mt-[15px]">
              <TextInput
                // withAsterisk
                label="Số phòng"
                className="w-full flex-1"
                placeholder="Nhập số phòng"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col md:flex-row flex-wrap gap-5  mb-[20px] mt-[24px]">
              <TextInput
                // withAsterisk
                label="Mô tả phòng"
                className="w-full flex-1"
                placeholder="Nhập mô tả phòng"
                value={describe}
                onChange={(e) => setDescribe(e.target.value)}
              />
            </div>
          </div>
        </Grid.Col>
      </Grid>

      <div className="flex justify-start gap-3">
        <div className=" flex items-end justify-start mt-6">
          <Link to="/trip/">
            <Button variant="outline" color="Red" size="md" radius="md">
              Hủy
            </Button>
          </Link>
        </div>

        <div className=" flex items-end justify-start mt-6">
          <Button
            variant="filled"
            color="indigo"
            size="md"
            radius="md"
            onClick={() => handleSubmit()}
          >
            Lưu
          </Button>
        </div>
      </div>

      <LoadingClient visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default NewLodging;
