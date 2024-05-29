import moment from "moment";
import { Button, useMantineColorScheme } from "@mantine/core";
import {
  IconArrowLeft,
  IconPlane,
  IconFileInfo,
  IconPhone,
  IconInfoTriangle,
  IconMail,
  IconWorld,
} from "@tabler/icons-react";
import React, { useEffect, useState, useRef } from "react";
import useStore from "../store";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getSingleTrip, getSinglePlans } from "../utils/apiCalls";

const ViewFlights = () => {
  const { colorScheme } = useMantineColorScheme();
  const { id, planId } = useParams();

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

  // Format tiền VN
  const formatCurrency = (value) => {
    return value
      ? value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
      : "N/A";
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
  return (
    <div className="px-[100px] mb-10">
      <Link to={`/trip/${trip?._id}`}>
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
        Xem chi tiết kế hoạch máy bay
      </p>
      <br />
      <>
        <div>
          <div className="max-w-full  bg-white flex flex-col rounded overflow-hidden shadow-lg">
            <div className="flex flex-row items-center flex-nowrap bg-gray-100 p-2">
              <div className="flex items-center text-sky-500">
                <IconPlane size="2rem" stroke={2} />
              </div>
              <h1 className="ml-2 uppercase font-bold text-gray-500">
                {planName}
              </h1>
              {/* <p className="ml-2 font-normal text-gray-500">Wednesday 18 Aug</p> */}
            </div>
            {/* <div className="mt-2 flex justify-start bg-white p-2">
              <div className="flex mx-2 ml-6 h8 px-2 flex-row items-center rounded-full bg-gray-100 p-1">
                <svg
                  viewBox="0 0 64 64"
                  pointerEvents="all"
                  aria-hidden="true"
                  className="etiIcon css-jbc4oa"
                  role="presentation"
                  style={{ fill: "rgb(102, 102, 102)", height: 12, width: 12 }}
                >
                  <path d="M43.389 38.269L29.222 61.34a1.152 1.152 0 01-1.064.615H20.99a1.219 1.219 0 01-1.007-.5 1.324 1.324 0 01-.2-1.149L26.2 38.27H11.7l-3.947 6.919a1.209 1.209 0 01-1.092.644H1.285a1.234 1.234 0 01-.895-.392l-.057-.056a1.427 1.427 0 01-.308-1.036L1.789 32 .025 19.656a1.182 1.182 0 01.281-1.009 1.356 1.356 0 01.951-.448l5.4-.027a1.227 1.227 0 01.9.391.85.85 0 01.2.252L11.7 25.73h14.5L19.792 3.7a1.324 1.324 0 01.2-1.149A1.219 1.219 0 0121 2.045h7.168a1.152 1.152 0 011.064.615l14.162 23.071h8.959a17.287 17.287 0 017.839 1.791Q63.777 29.315 64 32q-.224 2.685-3.807 4.478a17.282 17.282 0 01-7.84 1.793h-9.016z" />
                </svg>
                <p className="font-normal text-sm ml-1 text-gray-500">
                  Economy
                </p>
              </div>
            </div> */}
            <div className="mt-2 flex sm:flex-row mx-6 sm:justify-between flex-wrap ">
              <div className="flex flex-col p-2">
                <p className="font-bold">{startTime}</p>
                <p className="text-gray-500">
                  <span className="font-bold">Ngày khởi hành: </span>
                  {moment(startDate).format("LL")}
                </p>
                <p className="text-gray-500">{startAddress}</p>
              </div>
              <div className="flex flex-col flex-wrap p-2">
                <p className="font-bold">{endTime}</p>
                <p className="text-gray-500">
                  <span className="font-bold">Ngày đến: </span>
                  {moment(endDate).format("LL")}
                </p>
                <p className="text-gray-500">{endAddress}</p>
              </div>
              <div className="flex flex-row place-items-center p-2">
                <div className="flex flex-col ml-2">
                  <p className="text-xs text-black font-bold">Thông tin</p>
                  <p className="text-xs text-gray-500">Số chuyến bay: {info}</p>
                  <p className="text-xs text-gray-500">Chỗ ngồi: {number}</p>
                  <p className="text-xs text-gray-500">Hạng vé: {form}</p>
                  <p className="text-xs text-gray-500">Cổng: {departureGate}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-gray-100 flex flex-row flex-wrap md:flex-nowrap justify-between">
              <div className="flex mx-6 py-4 flex-row flex-wrap">
                <IconFileInfo
                  className="w-12 h-10 p-2 mx-2 self-center bg-gray-400 rounded-full text-white"
                  stroke={2}
                />
                <div className="text-sm mx-2 flex flex-col space-y-2">
                  <div className="flex items-center text-xs text-sky-700 ">
                    <IconInfoTriangle size="1rem" stroke={2} className="mr-2" />
                    <span className="max-w-[200px] break-words">
                      {describe}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-sky-700">
                    <IconPhone size="1rem" stroke={2} className="mr-2" />
                    <span>{phone}</span>
                  </div>
                  <div className="flex items-center text-xs text-sky-700">
                    <IconWorld size="1rem" stroke={2} className="mr-2" />
                    <span>{web}</span>
                  </div>
                  <div className="flex items-center text-xs text-sky-700">
                    <IconMail size="1rem" stroke={2} className="mr-2" />
                    <span>{email}</span>
                  </div>
                </div>
              </div>
              <div className="md:border-l-2 mx-6 md:border-dotted flex flex-row items-center py-4 mr-6 flex-wrap">
                <IconPlane
                  className="w-12 h-10 p-2 mx-2 self-center bg-sky-500 rounded-full fill-current text-white"
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
                  to={`/trip/${id}/flights/${planId}/edit`}
                  className="w-32 h-11 rounded flex border-solid border text-white bg-sky-800 mx-2 justify-center items-center"
                >
                  <div className="">Cập nhật</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default ViewFlights;