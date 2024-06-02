import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  TextInput,
  useMantineColorScheme,
  Grid,
  NumberInput,
  Textarea,
  ActionIcon,
  rem,
  Autocomplete as MantineAutocomplete,
} from "@mantine/core";
import useStore from "../store";
import {
  IconArrowLeft,
  IconMasksTheater,
  IconPhone,
  IconInfoTriangle,
  IconMail,
  IconWorld,
} from "@tabler/icons-react";
import moment from "moment";
import QRCode from "qrcode.react";
import { getSingleTrip, getSinglePlans } from "../utils/apiCalls";

const ViewTheater = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { colorScheme } = useMantineColorScheme();
  const { id, planId } = useParams();
  const [planName, setPlanName] = useState(null);
  const [startAddress, setStartAddress] = useState(null);
  const [info, setInfo] = useState(null);
  const [phone, setPhone] = useState(null);
  const [web, setWeb] = useState(null);
  const [email, setEmail] = useState(null);
  const [number, setNumber] = useState(null);
  const [form, setForm] = useState(null);
  const [departureGate, setDepartureGate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [actualPrice, setActualPrice] = useState(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const theme = colorScheme === "dark";

  const { setIsLoading } = useStore();
  const [trip, setTrip] = useState(null);

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
        setNumber(data.number);
        setForm(data.form);
        setDepartureGate(data.departureGate);
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

  // Format tiền VN
  const formatCurrency = (value) => {
    return value
      ? value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
      : "N/A";
  };

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
        } text-2xl font-semibold mt-4`}
      >
        Xem chi tiết kế hoạch xem phim
      </p>
      <br />

      <div>
        <div className="max-w-full bg-white flex flex-col rounded overflow-hidden shadow-lg">
          <div className="flex flex-row items-center flex-nowrap bg-gray-100 p-2">
            <div className="flex items-center text-sky-600">
              <IconMasksTheater size="2rem" stroke={2} />
            </div>
            <h1 className="ml-2 uppercase font-bold text-sky-600">
              {planName}
            </h1>
          </div>
          <div className="mt-2 flex sm:flex-row mx-6 sm:justify-between flex-wrap ">
            <div className="flex flex-col p-2">
              <p className="font-bold">{startTime}</p>
              <p className="text-gray-500">
                <span className="font-bold">Ngày bắt đầu: </span>
                {moment(startDate).format("LL")}
              </p>
              <p className="text-gray-500">{startAddress}</p>
            </div>
            <div className="flex flex-col flex-wrap p-2">
              <p className="font-bold">{endTime}</p>
              <p className="text-gray-500">
                <span className="font-bold">Ngày kết thúc: </span>
                {moment(endDate).format("LL")}
              </p>
              <p className="text-gray-500">{startAddress}</p>
            </div>
            <div className="flex flex-row place-items-center p-2">
              <div className="flex flex-col ml-2">
                <p className="text-xs text-black font-bold">Thông tin ghế</p>
                <p className="text-xs text-gray-500">loại ghế: {form}</p>
                <p className="text-xs text-gray-500">Số ghế: {number}</p>
                <p className="text-xs text-gray-500">Cổng: {departureGate}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-gray-100 flex flex-row flex-wrap md:flex-nowrap justify-between">
            <div className="flex mx-6 py-4 flex-row flex-wrap items-center">
              <QRCode
                id="qrCodeEl"
                value={`${REACT_APP_BASE_URL}/trip/${id}/theater/${planId}/view`}
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
              <IconMasksTheater
                className="w-12 h-10 p-2 mx-2 self-center bg-sky-500 rounded-full text-white"
                stroke={2}
              />

              <div className="text-sm mx-2 flex flex-col">
                <p className="text-black">
                  <span className="font-bold">Giá vé dự kiến: </span>
                  {formatCurrency(estimatedPrice)}
                </p>
                <p className="text-black">
                  <span className="font-bold">Giá vé thực tế: </span>
                  {formatCurrency(actualPrice)}
                </p>
              </div>
              <Link
                to={`/trip/${id}/theater/${planId}/edit`}
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

export default ViewTheater;
