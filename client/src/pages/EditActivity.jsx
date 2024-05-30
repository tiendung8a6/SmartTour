import {
  Button,
  TextInput,
  useMantineColorScheme,
  Grid,
  Textarea,
  NumberInput,
  Tooltip,
} from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { LoadingClient } from "../components";
import { useUpdateActivityPlan } from "../hooks/client-hook";
import useStore from "../store";
import { DateInput } from "@mantine/dates";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ActionIcon, rem } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import {
  IconClock,
  IconArrowLeft,
  IconCurrencyDong,
} from "@tabler/icons-react";
import React from "react";
import { useParams } from "react-router-dom";
import { getSingleTrip, getSinglePlans } from "../utils/apiCalls";
import { Autocomplete } from "@react-google-maps/api";

const EditActivity = () => {
  const { colorScheme } = useMantineColorScheme();
  const { id, planId } = useParams();
  const { user, setIsLoading } = useStore();
  const [visible, { toggle }] = useDisclosure(false);
  const { isPending, mutate } = useUpdateActivityPlan(
    planId,
    toast,
    user?.token,
    id
  );
  const [planName, setPlanName] = useState(null);
  const [startAddress, setStartAddress] = useState(null);
  const [info, setInfo] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [actualPrice, setActualPrice] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const theme = colorScheme === "dark";

  const [trip, setTrip] = useState(null);

  //AuTo Fill GOOGLE
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        setStartAddress(place.formatted_address);
      }
    }
  };
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

  const handleChange = (setStateFunction) => (e) => {
    setStateFunction(e.target.value);
  };

  const handleSubmit = async () => {
    if (!planName) {
      toast.error("Vui lòng nhập tên sự kiện.");
      return;
    }
    if (!startDate) {
      toast.error("Vui lòng chọn ngày bắt đầu.");
      return;
    }
    if (!endDate) {
      toast.error("Vui lòng chọn ngày kết thúc.");
      return;
    }
    if (endDate < startDate) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }
    if (!startTime) {
      toast.error("Vui lòng chọn thời gian bắt đầu.");
      return;
    }
    if (!endTime) {
      toast.error("Vui lòng chọn thời gian kết thúc.");
      return;
    }
    if (endDate.getTime() === startDate.getTime()) {
      if (endTime <= startTime) {
        toast.error(
          "Thời gian kết thúc phải sau thời gian bắt đầu nếu cùng một ngày."
        );
        return;
      }
    }
    if (!startAddress) {
      toast.error("Vui lòng nhập địa chỉ.");
      return;
    }
    if (!estimatedPrice) {
      toast.error("Vui lòng nhập tổng chi phí dự kiến.");
      return;
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
      estimatedPrice,
      actualPrice,
    });
  };

  //TRUY VẤN DỮ LIỆU PLAN
  const fetchPlan = async () => {
    try {
      const data = await getSinglePlans(planId);

      if (data) {
        setPlanName(data.planName);
        setStartAddress(data.startAddress);
        setInfo(data.info);
        setEstimatedPrice(data.estimatedPrice);
        setActualPrice(data.actualPrice);
        setStartDate(new Date(data.startDate));
        setEndDate(new Date(data.endDate));
        setStartTime(data.startTime);
        setEndTime(data.endTime);
      }
    } catch (error) {
      console.error("Error fetching plan:", error);
    }
  };

  useEffect(() => {
    if (planId) {
      fetchPlan();
    }
  }, [planId]);

  //TRUY VẤN DỮ LIỆU TRIP
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
      <Link to={`/trip/${id}`}>
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
        } text-lg font-semibold mt-4`}
      >
        Chỉnh sửa hoạt động
      </p>
      <br />

      <Grid className="">
        <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-[20px] mt-[-5px]">
            <TextInput
              withAsterisk
              label="Tên sự kiện"
              className="w-full flex-1"
              placeholder="Nhập tên sự kiện"
              onChange={(e) => setPlanName(e.target.value)}
              value={planName}
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
                  label="Ngày bắt đầu"
                  className="w-full flex-1"
                  placeholder="Chọn ngày bắt đầu"
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
                  label="Thời gian bắt đầu"
                  leftSection={pickerStartTimeControl}
                  withAsterisk
                  // description="Input description"
                  placeholder="Chọn thời gian bắt đầu"
                  value={startTime}
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
                  label="Ngày kết thúc"
                  className="w-full flex-1"
                  placeholder="Chọn ngày kết thúc"
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
                  label="Thời gian kết thúc"
                  leftSection={pickerEndTimeControl}
                  withAsterisk
                  // description="Input description"
                  placeholder="Chọn thời gian kết thúc"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </Grid.Col>
          </Grid>

          <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceChanged}>
            <div className="w-full flex flex-col md:flex-row flex-wrap gap-5  mb-[20px] mt-[5px]">
              <TextInput
                withAsterisk
                label="Địa chỉ"
                className="w-full flex-1"
                placeholder="Nhập địa chỉ"
                value={startAddress}
                onChange={(e) => setStartAddress(e.target.value)}
                maxLength={255} // Giới hạn số lượng ký tự nhập vào
              />
            </div>
          </Autocomplete>

          <Grid className="mt-[24px]">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full">
                <NumberInput
                  withAsterisk
                  label="Tổng chi phí dự kiến"
                  placeholder="Nhập tổng giá tiền dự kiến"
                  allowDecimal={false}
                  clampBehavior="strict"
                  min={0}
                  max={100000000000}
                  thousandSeparator="."
                  decimalSeparator=","
                  rightSection={
                    <IconCurrencyDong
                      style={{ width: rem(20), height: rem(20) }}
                      stroke={1.5}
                    />
                  }
                  value={estimatedPrice}
                  onChange={(value) => setEstimatedPrice(value)}
                />
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full ">
                <NumberInput
                  label="Tổng chi phí thực tế"
                  placeholder="Nhập tổng chi phí thực tế"
                  allowDecimal={false}
                  clampBehavior="strict"
                  min={0}
                  max={100000000000}
                  thousandSeparator="."
                  decimalSeparator=","
                  rightSection={
                    <IconCurrencyDong
                      style={{ width: rem(20), height: rem(20) }}
                      stroke={1.5}
                    />
                  }
                  value={actualPrice}
                  onChange={(value) => setActualPrice(value)}
                />
              </div>
            </Grid.Col>
          </Grid>

          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5  mb-[20px] mt-[24px]">
            <Textarea
              // withAsterisk
              label="Thông tin"
              className="w-full flex-1"
              placeholder="Nhập thông tin"
              autosize
              minRows={3}
              maxRows={6}
              value={info}
              onChange={(e) => setInfo(e.target.value)}
            />
          </div>
        </Grid.Col>
      </Grid>

      <div className="flex justify-start gap-3">
        <div className=" flex items-end justify-start mt-6">
          <Link to={`/trip/${id}`}>
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

export default EditActivity;
