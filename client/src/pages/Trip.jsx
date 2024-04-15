import React from "react";
import { Link } from "react-router-dom";
import { TripCard, Pagination } from "../components";
import { useTrips } from "../hooks/trip_hooks";

const Trip = () => {
  const { trips, numOfPages, setPage } = useTrips();

  const handlePageChange = (val) => {
    setPage(val);
  };

  if (trips?.length < 1)
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-lg text-slate-500">No Trip Available</span>
      </div>
    );

  return (
    <div className="py-10 2xl:py-5">
      <div className="px-0 lg:pl-20 2xl:px-20 ">
        <div className="mt-6 md:mt-0">
          <p className="text-2xl font-semibold text-gray-600 dark:text-white">
            Lập kế hoạch chuyến đi
          </p>
          <div className="w-full flex flex-wrap py-10 gap-8">
            <Link
              to={`/trip/create`}
              className={`flex items-center justify-center gap-3 border border-gray-400 dark:border-gray-600 rounded-full text-gray-700 dark:text-white font-semibold text-base px-4 py-2 cursor-pointer`}
            >
              Add Trip
            </Link>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-10 2xl:gap-20">
          <div className="w-full md:w-2/3 flex flex-col gap-y-28 md:gap-y-14">
            {trips?.map((trip, index) => (
              <TripCard key={trip?._id} trip={trip} index={index} />
            ))}

            <div className="w-full flex items-center justify-center">
              <Pagination
                totalPages={numOfPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trip;
