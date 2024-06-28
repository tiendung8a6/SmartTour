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
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconClock,
  IconArrowLeft,
  IconCurrencyDong,
} from "@tabler/icons-react";
import React, { useEffect, useState, useRef } from "react";
import { Toaster, toast } from "sonner";
import { LoadingClient } from "../components";
import useStore from "../store";
import { Link } from "react-router-dom";
import { TimeInput, DateInput } from "@mantine/dates";
import { useParams } from "react-router-dom";
import { useUpdateFlightsPlan } from "../hooks/client-hook";
import { getSingleTrip, getSinglePlans } from "../utils/apiCalls";
import { Autocomplete } from "@react-google-maps/api";

const EditFlights = () => {
  const { colorScheme } = useMantineColorScheme();
  const { id, planId } = useParams();
  const { user } = useStore();
  const { isPending, mutate } = useUpdateFlightsPlan(
    planId,
    toast,
    user?.token,
    id
  );
  const [planName, setPlanName] = useState(null);
  const [startAddress, setStartAddress] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [actualPrice, setActualPrice] = useState(null);
  const [info, setInfo] = useState(null);
  const [phone, setPhone] = useState(null);
  const [web, setWeb] = useState(null);
  const [email, setEmail] = useState(null);
  const [number, setNumber] = useState(null);
  const [describe, setDescribe] = useState(null);
  const [form, setForm] = useState(null);
  const [endAddress, setEndAddress] = useState(null);
  const [arrivalGate, setArrivalGate] = useState(null);
  const [departureGate, setDepartureGate] = useState(null);
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

  const handleEndPlaceChanged = () => {
    if (endAutocomplete) {
      const place = endAutocomplete.getPlace();
      if (place && place.formatted_address) {
        setEndAddress(place.formatted_address);
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
      toast.error("Vui lòng nhập hãng hàng không.");
      return;
    }
    if (!startAddress) {
      toast.error("Vui lòng nhập địa chỉ sân bay khởi hành.");
      return;
    }
    if (!startDate) {
      toast.error("Vui lòng chọn ngày khởi hành.");
      return;
    }
    if (!startTime) {
      toast.error("Vui lòng chọn thời gian khởi hành.");
      return;
    }
    if (!estimatedPrice) {
      toast.error("Vui lòng nhập tổng giá vé dự kiến.");
      return;
    }

    if (!endDate) {
      toast.error("Vui lòng chọn ngày đến.");
      return;
    }
    if (!endTime) {
      toast.error("Vui lòng chọn thời gian đến.");
      return;
    }
    if (!endAddress) {
      toast.error("Vui lòng nhập địa chỉ đến.");
      return;
    }
    if (endDate < startDate) {
      toast.error("Ngày đến phải sau ngày khởi hành.");
      return;
    }
    if (endDate.getTime() === startDate.getTime()) {
      if (endTime <= startTime) {
        toast.error(
          "Thời gian khởi hành phải sau thời gian đến nếu trong cùng một ngày."
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
      form,
      estimatedPrice,
      actualPrice,
      describe,
      endAddress,
      arrivalGate,
      departureGate,
    });
  };

  //TRUY VẤN DỮ LIỆU PLAN
  const fetchPlan = async () => {
    try {
      const data = await getSinglePlans(planId);

      if (data) {
        setPlanName(data.planName);
        setStartAddress(data.startAddress);
        setEndAddress(data.endAddress);
        setInfo(data.info);
        setEstimatedPrice(data.estimatedPrice);
        setActualPrice(data.actualPrice);
        setStartDate(new Date(data.startDate));
        setEndDate(new Date(data.endDate));
        setStartTime(data.startTime);
        setEndTime(data.endTime);
        setNumber(data.number);
        setForm(data.form);
        setDepartureGate(data.departureGate);
        setArrivalGate(data.arrivalGate);
        setDescribe(data.describe);
        setPhone(data.phone);
        setWeb(data.web);
        setEmail(data.email);
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
  //Bổ xung check điều kiện Đăng nhập và Đúng kế hoạch của tôi
  const isUserValid = user?.user?._id === trip?.user?._id;
  if (!trip) {
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-lg text-slate-500">Đang tải...</span>
      </div>
    );
  }
  // Check token
  if (!user?.token) {
    return (
      <div className="w-full h-full py-[100px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-black text-gray-500">404</h1>
          <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Đã có lỗi xảy ra
          </p>
          <p className="mt-4 text-gray-500 font-medium dark:text-gray-300">
            Vui lòng đăng nhập.
          </p>
          <Link
            to="/sign-in"
            className="mt-6 inline-block rounded bg-sky-600 px-5 py-3 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }
  // Check user
  if (!isUserValid) {
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-lg text-slate-500">
          Đây không phải kế hoạch của bạn
        </span>
      </div>
    );
  }

  return (
    <div className="px-[100px] mb-10">
      <Link to={`/trip/${id}`}>
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
        Chỉnh sửa chuyến bay
      </p>
      <br />

      <Grid className="my-6">
        <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
          <p
            className={`${
              theme ? "text-white" : "text-slate-700"
            } text-xl	 font-semibold `}
          >
            Thông tin khởi hành
          </p>

          <Grid className="my-6">
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap  ">
                <MantineAutocomplete
                  withAsterisk
                  label="Hãng hàng không"
                  className="w-full flex-1"
                  placeholder="Nhập hãng hàng không"
                  data={[
                    "Vietnam Airlines",
                    "Vietjet Air",
                    "Bamboo Airways",
                    "Vietravel Airlines",
                    "Pacific Airlines",
                  ]}
                  value={planName}
                  onChange={(value) => setPlanName(value)}
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
                    label="Địa chỉ sân bay khởi hành"
                    className="w-full flex-1"
                    placeholder="Nhập địa chỉ sân bay khởi hành"
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
                  label="Ngày khởi hành"
                  className="w-full flex-1"
                  placeholder="Chọn khởi hành"
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
                  label="Thời gian khởi hành"
                  leftSection={pickerStartTimeControl}
                  withAsterisk
                  value={startTime}
                  // description="Input description"
                  placeholder="Chọn thời gian khởi hành"
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </Grid.Col>
          </Grid>

          <Grid className="my-6">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap  ">
                <TextInput
                  // withAsterisk
                  label="Số chuyến bay"
                  className="w-full flex-1"
                  placeholder="Nhập số chuyến bay "
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                />
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap  ">
                <TextInput
                  // withAsterisk
                  label="Chỗ ngồi"
                  className="w-full flex-1"
                  placeholder="Nhập chỗ ngồi"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
            </Grid.Col>
          </Grid>

          <Grid className="my-6">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap  ">
                <MantineAutocomplete
                  // withAsterisk
                  label="Hạng vé"
                  className="w-full flex-1"
                  placeholder="Nhập hạng vé"
                  data={[
                    "Phổ thông",
                    "Phổ thông đặt biệt",
                    "Thương gia",
                    "Hạng nhất",
                  ]}
                  value={form}
                  onChange={(value) => setForm(value)}
                />
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap  ">
                <TextInput
                  // withAsterisk
                  label="Cổng"
                  className="w-full flex-1"
                  placeholder="Nhập cổng"
                  value={departureGate}
                  onChange={(e) => setDepartureGate(e.target.value)}
                />
              </div>
            </Grid.Col>
          </Grid>

          <Grid className="my-6">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full">
                <NumberInput
                  withAsterisk
                  label="Tổng giá vé dự kiến"
                  placeholder="Nhập tổng giá vé dự kiến"
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
                  label="Tổng giá vé thực tế"
                  placeholder="Nhập tổng giá vé thực tế"
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

          <div className="text-lg  mt-16">
            <p
              className={`${
                theme ? "text-white" : "text-slate-700"
              } text-xl font-semibold`}
            >
              Thông tin điểm đến
            </p>

            <Grid className="my-6">
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <div className="w-full flex flex-col md:flex-row flex-wrap  ">
                  <DateInput
                    leftSection={
                      <IconCalendarEvent className="text-[#107ac5]" size={24} />
                    }
                    clearable
                    withAsterisk
                    label="Ngày đến"
                    className="w-full flex-1"
                    placeholder="Chọn ngày đến"
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
                    label="Thời gian đến"
                    leftSection={pickerEndTimeControl}
                    withAsterisk
                    // description="Input description"
                    value={endTime}
                    placeholder="Chọn thời gian  đến"
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </Grid.Col>
            </Grid>

            <Grid className="my-6">
              <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                <div className="w-[50%] flex flex-col md:flex-row flex-wrap   ">
                  <TextInput
                    // withAsterisk
                    label="Cổng"
                    className="w-full flex-1"
                    placeholder="Nhập cổng"
                    value={arrivalGate}
                    onChange={(e) => setArrivalGate(e.target.value)}
                  />
                </div>
              </Grid.Col>
            </Grid>

            <Grid className="my-6">
              <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                <Autocomplete
                  onLoad={onLoadEnd}
                  onPlaceChanged={handleEndPlaceChanged}
                >
                  <div className="w-full flex flex-col md:flex-row flex-wrap   ">
                    <TextInput
                      withAsterisk
                      label="Địa chỉ đến"
                      className="w-full flex-1"
                      placeholder="Nhập địa chỉ đến"
                      value={endAddress}
                      onChange={(e) => setEndAddress(e.target.value)}
                    />
                  </div>
                </Autocomplete>
              </Grid.Col>
            </Grid>
          </div>

          <div className=" text-l	mt-16">
            <p
              className={`${
                theme ? "text-white" : "text-slate-700"
              } text-xl font-semibold`}
            >
              Quy định và liên hệ
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
                    value={describe}
                    onChange={(e) => setDescribe(e.target.value)}
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

      {/* button */}
      <div className="flex justify-start gap-3">
        <div className=" flex items-end justify-start ">
          <Link to={`/trip/${id}`}>
            <Button variant="outline" color="Red" size="md" radius="md">
              Hủy
            </Button>
          </Link>
        </div>

        <div className=" flex items-end justify-start">
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

export default EditFlights;
