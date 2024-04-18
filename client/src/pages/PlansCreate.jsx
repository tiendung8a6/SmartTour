import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@mantine/core";
import useStore from "../store";
import { getSingleTrip } from "../utils/apiCalls";

const PlansCreate = () => {
  const { setIsLoading } = useStore();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const startDate = new Date(trip?.startDate);
  const endDate = new Date(trip?.endDate);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const fetchTrip = async () => {
    try {
      setIsLoading(true);
      const data = await getSingleTrip(id);

      setTrip(data || []);
    } catch (error) {
      console.error("Error fetching trip or popular content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTrip();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [id]);

  if (!trip)
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-xl text-slate-500">Loading...</span>
      </div>
    );

  return (
    <div className="w-full  px-0 md:px-10 py-8 2xl:px-20">
      <div className="w-full flex flex-col-reverse md:flex-row gap-2 gap-y-5 items-center">
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white">
            {trip?.tripName}
          </h1>

          <div className="w-full flex items-center ">
            <span className="flex-1 text-sky-600 font-semibold">
              {trip?.city}
            </span>

            <span className="flex flex-1 items-baseline text-2xl font-medium text-slate-700 dark:text-gray-400">
              {new Date(trip?.startDate).toLocaleDateString("vi-VN")} -
              {new Date(trip?.endDate).toLocaleDateString("vi-VN")} (
              {diffDays === 0 ? "1 ngày" : `${diffDays} ngày`})
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="w-full flex items-end justify-start mt-6">
          <span>Phổ biến nhất</span>
          <Link
            to={`/trip/${trip._id}/activity/create`}
            className="w-full h-auto md:h-64 md:w-2/4 "
          >
            <Button>Hoạt động</Button>
          </Link>
        </div>
        <div className="w-full flex items-end justify-start mt-6">
          <Link
            to={`/trip/${trip._id}/flights/create`}
            className="w-full h-auto md:h-64 md:w-2/4 "
          >
            <Button>Máy bay</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlansCreate;
