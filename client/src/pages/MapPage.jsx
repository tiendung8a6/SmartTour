import React, { useEffect, useState } from "react";
import { Map, List } from "../components";
import { useParams } from "react-router-dom";
import useFilterHook from "../hooks/useFilterHook";
import { fetchData, fetchCity } from "../RapidAPI";

const MapPage = () => {
  const [bounds, setBounds] = useState();
  const [userLocation, setUserLocation] = useState();
  const [data, setData] = useState([]);
  const [child, setChild] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  const [rating, setFilterRating] = useState([]);
  const [price, setFilterPrice] = useState([]);
  const [distance, setFilterDistance] = useState([]);

  const [placeName, setPlaceName] = useState();

  const url = `https://travel-advisor.p.rapidapi.com/${params.id}/list-in-boundary`;

  const [newData, setNewData] = useFilterHook(data, rating, distance, price);

  useEffect(() => {
    setIsLoading(true);
    if (placeName) {
      fetchCity(placeName)
        .then((res) => {
          setBounds();
          setUserLocation(res.data.results[0].geometry);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      navigator.geolocation.getCurrentPosition(function (position) {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, [placeName, url]);

  useEffect(() => {
    if (userLocation && bounds) {
      setIsLoading(true);
      fetchData(url, bounds)
        .then((res) => {
          setIsLoading(false);
          setNewData([]);
          setUserLocation();
          setData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url, userLocation, bounds]);

  return (
    <>
      <div className="@apply w-full max-w-[1200px] mx-auto pb-4">
        {/* <div className="text-center my-10">
          <h1 className="font-semibold text-lg md:text-3xl">
            Restaurants near you
          </h1>
        </div> */}

        <div className="px-4 lg:grid lg:grid-cols-12 lg:gap-2">
          <div className="lg:col-span-3">
            <div className="w-full border shadow mt-2 p-2">
              <div className="relative">
                <Map
                  setBounds={setBounds}
                  userLocation={userLocation}
                  data={newData.length ? newData : data}
                  setChild={setChild}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <List
              data={newData.length ? newData : data}
              isLoading={isLoading}
              child={child}
              filter={{
                setFilterRating,
                setFilterPrice,
                setFilterDistance,
                setPlaceName,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MapPage;
