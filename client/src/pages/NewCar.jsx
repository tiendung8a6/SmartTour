import {
  Button,
  TextInput,
  useMantineColorScheme,
  Grid,
  ActionIcon,
  rem,
  NumberInput,
  Textarea,
  Autocomplete as MantineAutocomplete,
  Select,
} from "@mantine/core";
import React, { useEffect, useState, useRef } from "react";
import { Toaster, toast } from "sonner";
import { LoadingClient } from "../components";
import useStore from "../store";
import { DateInput, TimeInput } from "@mantine/dates";
import { Link, useParams } from "react-router-dom";
import {
  IconClock,
  IconArrowLeft,
  IconCalendarEvent,
  IconCurrencyDong,
} from "@tabler/icons-react";
import { useCreateCarPlan } from "../hooks/client-hook";
import { getSingleTrip } from "../utils/apiCalls";
import { Autocomplete } from "@react-google-maps/api";

const NewCar = () => {
  const { colorScheme } = useMantineColorScheme();
  const { id } = useParams();
  const { user } = useStore();
  const { isPending, mutate } = useCreateCarPlan(id, toast, user?.token);
  const [planName, setPlanName] = useState(null);
  const [startAddress, setStartAddress] = useState(null);
  const [phone, setPhone] = useState(null);
  const [web, setWeb] = useState(null);
  const [email, setEmail] = useState(null);
  const [service, setService] = useState(null);
  const [describe, setDescribe] = useState(null);
  const [form, setForm] = useState(null);
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

  const { setIsLoading } = useStore();
  const [trip, setTrip] = useState(null);

  // AuTo Fill GOOGLE
  const [startAutocomplete, setStartAutocomplete] = useState(null);
  const [endAutocomplete, setEndAutocomplete] = useState(null);

  const onLoadStart = (autocomplete) => {
    setStartAutocomplete(autocomplete);
  };

  const onLoadEnd = (autocomplete) => {
    setEndAutocomplete(autocomplete);
  };

  const handleStartPlaceChanged = () => {
    if (startAutocomplete) {
      const place = startAutocomplete.getPlace();
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
  const handleSubmit = async () => {
    if (!planName) {
      toast.error("Vui lòng nhập tên đại lý cho thuê.");
      return;
    }
    if (!startAddress) {
      toast.error("Vui lòng nhập địa chỉ đại lý.");
      return;
    }
    if (!startDate) {
      toast.error("Vui lòng chọn ngày nhận.");
      return;
    }
    if (!startTime) {
      toast.error("Vui lòng chọn thời gian nhận.");
      return;
    }
    if (!endDate) {
      toast.error("Vui lòng chọn ngày trả.");
      return;
    }
    if (endDate < startDate) {
      toast.error("Ngày trả phải sau ngày nhận.");
      return;
    }
    if (!endTime) {
      toast.error("Vui lòng chọn thời gian trả.");
      return;
    }
    if (endDate.getTime() === startDate.getTime()) {
      if (endTime <= startTime) {
        toast.error("Thời gian trả phải sau thời gian nhận nếu cùng một ngày.");
        return;
      }
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
      phone,
      web,
      info,
      email,
      service,
      describe,
      form,
      estimatedPrice,
      actualPrice,
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
          className="dark:bg-inherit border-none hover:text-[#0782c5] hover:bg-transparent flex justify-start ml-[-20px] "
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
        Thêm thuê xe
      </p>
      <br />
      <Grid>
        <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
          <Grid className="mb-6 mt-1">
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap  ">
                <TextInput
                  withAsterisk
                  label="Tên đại lý cho thuê"
                  className="w-full flex-1"
                  placeholder="Nhập tên đại lý cho thuê"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
              </div>
            </Grid.Col>
          </Grid>

          <Grid className="my-6">
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
              <Autocomplete
                onLoad={onLoadStart}
                onPlaceChanged={handleStartPlaceChanged}
              >
                <div className="w-full flex flex-col md:flex-row flex-wrap">
                  <TextInput
                    withAsterisk
                    label="Địa chỉ đại lý"
                    className="w-full flex-1"
                    placeholder="Nhập địa chỉ đại lý"
                    value={startAddress}
                    onChange={(e) => setStartAddress(e.target.value)}
                  />
                </div>
              </Autocomplete>
            </Grid.Col>
          </Grid>

          <Grid className="my-6">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap">
                <DateInput
                  leftSection={
                    <IconCalendarEvent className="text-[#107ac5]" size={24} />
                  }
                  clearable
                  withAsterisk
                  label="Ngày nhận"
                  className="w-full flex-1"
                  placeholder="Chọn ngày nhận"
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
                  label="Thời gian nhận"
                  leftSection={pickerStartTimeControl}
                  withAsterisk
                  // description="Input description"
                  placeholder="Chọn thời gian nhận"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </Grid.Col>
          </Grid>

          <Grid className="my-6">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap">
                <DateInput
                  leftSection={
                    <IconCalendarEvent className="text-[#107ac5]" size={24} />
                  }
                  clearable
                  withAsterisk
                  label="Ngày trả"
                  className="w-full flex-1"
                  placeholder="Chọn ngày trả"
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
                  label="Thời gian trả"
                  leftSection={pickerEndTimeControl}
                  withAsterisk
                  // description="Input description"
                  placeholder="Chọn thời gian trả"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </Grid.Col>
          </Grid>

          <Grid className="my-6">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full">
                <NumberInput
                  withAsterisk
                  label="Tổng chi phí dự kiến"
                  placeholder="Nhập tổng chi phí dự kiến"
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
              <div className="w-full">
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

          <div className="mt-16">
            <p
              className={`${
                theme ? "text-white" : "text-slate-700"
              } text-xl font-semibold`}
            >
              Thông tin xe
            </p>
            <Grid className="my-6">
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <div className="w-full flex flex-col md:flex-row flex-wrap">
                  <Select
                    classNames={{
                      groupLabel: "text-sky-700", // Màu chữ là đỏ
                    }}
                    data={[
                      {
                        group: "Xe máy",
                        items: [
                          "Xe tay ga",
                          "Xe tay côn",
                          "Xe điện",
                          "Xe số",
                          "Chopper",
                          "Motocross",
                          "Siêu môtô",
                        ],
                      },
                      {
                        group: "Xe ô tô",
                        items: [
                          "Xe 4 chỗ (Mini)",
                          "Xe 4 chỗ (Sedan)",
                          "Xe 4 chỗ (Hatchback)",
                          "Xe 5 chỗ (Gầm cao)",
                          "Xe 7 chỗ (Gầm cao)",
                          "Xe 7 chỗ (Gầm thấp)",
                          "Xe 16 chỗ",
                          "Xe 29 chỗ",
                          "Xe 33 - 35 chỗ",
                          "Xe 45 chỗ",
                          "Xe bán tải",
                          "Xe ô tô điện",
                          "Xe limousine",
                          "Xe mobihome",
                          "Xe giường nằm",
                          "Xe VIP, siêu xe",
                        ],
                      },
                    ]}
                    label="Loại xe"
                    className="w-full flex-1"
                    placeholder="Nhập loại xe"
                    value={form}
                    onChange={(value) => setForm(value)}
                    clearable
                  />
                </div>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <div className="w-full">
                  <Select
                    // withAsterisk
                    label="Dịch vụ"
                    className="w-full flex-1"
                    placeholder="Nhập dịch vụ"
                    data={["Thuê xe tự lái", "Thuê tài xế lái xe"]}
                    value={service}
                    onChange={(value) => setService(value)}
                    min={1}
                    max={100}
                    clearable
                  />
                </div>
              </Grid.Col>
            </Grid>

            <Grid className=" my-6">
              <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                <div className="w-full flex flex-col md:flex-row flex-wrap  ">
                  <Textarea
                    // withAsterisk
                    label="Chi tiết xe"
                    className="w-full flex-1"
                    placeholder="Nhập chi tiết"
                    autosize
                    minRows={3}
                    maxRows={6}
                    value={describe}
                    onChange={(e) => setDescribe(e.target.value)}
                  />
                </div>
              </Grid.Col>
            </Grid>
          </div>

          <div className=" text-lg mt-16">
            <p
              className={`${
                theme ? "text-white" : "text-slate-700"
              } text-xl font-semibold`}
            >
              Quy đinh và liên hệ
            </p>

            <Grid className="my-6">
              <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                <div className="w-full flex flex-col md:flex-row flex-wrap    ">
                  <Textarea
                    // withAsterisk
                    label="Quy định"
                    className="w-full flex-1"
                    placeholder="Nhập quy định"
                    autosize
                    minRows={3}
                    maxRows={6}
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                  />
                </div>
              </Grid.Col>
            </Grid>

            <Grid className="my-6">
              <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                <div className="w-full flex flex-col md:flex-row flex-wrap    ">
                  <TextInput
                    // withAsterisk
                    label="Điện thoại"
                    className="w-full flex-1"
                    placeholder="Nhập điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </Grid.Col>
            </Grid>

            <Grid className="my-6">
              <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                <div className="w-full flex flex-col md:flex-row flex-wrap    ">
                  <TextInput
                    // withAsterisk
                    label="Trang web "
                    className="w-full flex-1"
                    placeholder="Nhập trang web"
                    value={web}
                    onChange={(e) => setWeb(e.target.value)}
                  />
                </div>
              </Grid.Col>
            </Grid>

            <Grid className="my-6">
              <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                <div className="w-full flex flex-col md:flex-row flex-wrap    ">
                  <TextInput
                    // withAsterisk
                    label="Email"
                    className="w-full flex-1"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </Grid.Col>
            </Grid>
          </div>
        </Grid.Col>
      </Grid>

      <div className="flex justify-start gap-3">
        <div className=" flex items-end justify-start mt-6">
          <Link to={`/trip/${trip?._id}/plans/create`}>
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

export default NewCar;
