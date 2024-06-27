import {
  Button,
  useMantineColorScheme,
  Autocomplete as MantineAutocomplete,
} from "@mantine/core";
import React, { useEffect, useState, useRef } from "react";
import useStore from "../store";
import { DateInput, TimeInput } from "@mantine/dates";
import { Link, useParams } from "react-router-dom";
import {
  IconArrowLeft,
  IconCar,
  IconFileInfo,
  IconPhone,
  IconInfoTriangle,
  IconMail,
  IconWorld,
} from "@tabler/icons-react";
import { getSingleTrip, getSinglePlans } from "../utils/apiCalls";
import moment from "moment";
import QRCode from "qrcode.react";
const ViewCar = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { colorScheme } = useMantineColorScheme();
  const { id, planId } = useParams();
  const { user } = useStore();
  const [planName, setPlanName] = useState(null);
  const [startAddress, setStartAddress] = useState(null);
  const [phone, setPhone] = useState(null);
  const [web, setWeb] = useState(null);
  const [email, setEmail] = useState(null);
  const [service, setService] = useState(null);
  const [describe, setDescribe] = useState(null);
  const [form, setForm] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [actualPrice, setActualPrice] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [info, setInfo] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const theme = colorScheme === "dark";

  const { setIsLoading } = useStore();
  const [trip, setTrip] = useState(null);

  // Format tiền VN
  const formatCurrency = (value) => {
    return value
      ? value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
      : "N/A";
  };

  // download QR code
  const downloadQRCode = () => {
    const qrCodeURL = document
      .getElementById("qrCodeEl")
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    console.log(qrCodeURL);
    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = "QR_Code.png";
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  };

  //TRUY VẤN DỮ LIỆU PLAN
  const fetchPlan = async () => {
    try {
      const data = await getSinglePlans(planId);

      if (data) {
        setPlanName(data.planName);
        setStartAddress(data.startAddress);
        setEstimatedPrice(data.estimatedPrice);
        setActualPrice(data.actualPrice);
        setStartDate(new Date(data.startDate));
        setEndDate(new Date(data.endDate));
        setStartTime(data.startTime);
        setEndTime(data.endTime);
        setForm(data.form);
        setService(data.service);
        setDescribe(data.describe);
        setInfo(data.info);
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
        Xem chi tiết kế hoạch thuê xe
      </p>
      <br />

      <div>
        <div className="dark:bg-gray-700 max-w-full bg-white flex flex-col rounded overflow-hidden shadow-lg">
          <div className="dark:bg-gray-800 flex flex-row items-center flex-nowrap bg-gray-100 p-2">
            <div className="flex items-center text-sky-600">
              <IconCar size="2rem" stroke={2} />
            </div>
            <h1 className="ml-2 uppercase font-bold text-sky-600">
              {planName}
            </h1>
          </div>
          <div className="mt-2 flex sm:flex-row mx-6 sm:justify-between flex-wrap ">
            <div className="flex flex-col p-2">
              <p className="font-bold dark:text-white">{startTime}</p>
              <p className="text-gray-500 dark:text-gray-400">
                <span className="font-bold dark:text-white">Ngày nhận: </span>
                {moment(startDate).format("LL")}
              </p>
              <p className="text-gray-500 dark:text-gray-400">{startAddress}</p>
            </div>
            <div className="flex flex-col flex-wrap p-2">
              <p className="font-bold dark:text-white">{endTime}</p>
              <p className="text-gray-500 dark:text-gray-400">
                <span className="font-bold dark:text-white">Ngày trả: </span>
                {moment(endDate).format("LL")}
              </p>
              <p className="text-gray-500 dark:text-gray-400">{startAddress}</p>
            </div>
            <div className="flex flex-row place-items-center p-2">
              <div className="flex flex-col ml-2">
                <p className="text-base text-black font-bold dark:text-white">
                  Thông tin xe
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Loại xe: {form}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Dịch vụ: {service}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Chi tiết xe: {describe}
                </p>
              </div>
            </div>
          </div>
          <div className="dark:bg-gray-800 mt-4 bg-gray-100 flex flex-row flex-wrap md:flex-nowrap justify-between">
            <div className="flex mx-6 py-4 flex-row flex-wrap items-center">
              <QRCode
                id="qrCodeEl"
                value={`${REACT_APP_BASE_URL}/trip/${id}/car/${planId}/view`}
                size={100}
                fgColor={"#000000"}
                bgColor={"#FFFFFF"}
                level={"M"}
              />

              <div className="text-sm mx-2 flex flex-col space-y-2">
                <div className="flex items-center text-xs text-sky-700 ">
                  <IconInfoTriangle size="1rem" stroke={2} className="mr-2" />
                  <span className="max-w-[200px] break-words">{info}</span>
                </div>
                <div className="flex items-center text-xs text-sky-700">
                  <IconPhone size="1rem" stroke={2} className="mr-2" />
                  <a href={`tel:${phone}`}>{phone}</a>
                </div>
                <div className="flex items-center text-xs text-sky-700">
                  <IconWorld size="1rem" stroke={2} className="mr-2" />
                  <a href={`${web}`} target="_blank" rel="noreferrer">
                    {web}
                  </a>
                </div>
                <div className="flex items-center text-xs text-sky-700">
                  <IconMail size="1rem" stroke={2} className="mr-2" />
                  <span>
                    <a href={`mailto:${email}`}>{email}</a>
                  </span>
                </div>
              </div>
            </div>
            <div className="md:border-l-2 mx-6 md:border-dotted flex flex-row items-center py-4 mr-6 flex-wrap">
              <IconCar
                className="w-12 h-10 p-2 mx-2 self-center bg-sky-500 rounded-full text-white"
                stroke={1.5}
              />

              <div className="text-sm mx-2 flex flex-col ">
                <p className="text-black dark:text-sky-500">
                  <span className="font-bold dark:text-white">
                    Giá vé dự kiến:{" "}
                  </span>
                  {formatCurrency(estimatedPrice)}
                </p>
                <p className="text-black dark:text-sky-500">
                  <span className="font-bold dark:text-white">
                    Giá vé thực tế:{" "}
                  </span>
                  {formatCurrency(actualPrice)}
                </p>
              </div>
              <Link
                to={`/trip/${id}/car/${planId}/edit`}
                className="w-32 h-11 rounded flex border-solid border text-white bg-sky-600 hover:bg-gray-600 transition duration-150 ease-in-out mx-2 justify-center items-center"
              >
                <div>Chỉnh sửa</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCar;
