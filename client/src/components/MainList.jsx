import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MainList = ({ filter }) => {
  const { setPlaceName } = filter;
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    setPlaceName(cityName);
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case "Nhà hàng":
        navigate("/map/restaurants");
        break;
      case "Địa điểm tham quan":
        navigate("/map/attractions");
        break;
      case "Khách sạn":
        navigate("/map/hotels");
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    setCityName(e.target.value);
  };

  return (
    <div className="p-2">
      <div className="m-2">
        <div className="rounded-xl border w-full border-gray-200 bg-white p-4 shadow-lg">
          <h2 className="text-stone-700 font-semibold text-lg md:text-2xl text-center">
            Điểm đến nổi bật quanh đây
          </h2>
          <p className="mt-1 text-sm text-center">
            Danh sách các nhà hàng, khách sạn, địa điểm nổi bật,...
          </p>
          <div className="leading-6">
            <form
              onSubmit={submitHandler}
              className="relative mx-auto flex w-full flex-col space-y-4"
            >
              <div className="flex flex-col">
                <label
                  className="mt-2 text-stone-600 text-sm font-medium"
                  htmlFor="status"
                >
                  Lọc địa điểm
                </label>
                <select
                  className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  id="status"
                  onChange={handleSelectChange}
                >
                  <option>Nhà hàng</option>
                  <option>Địa điểm tham quan</option>
                  <option>Khách sạn</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  className="text-stone-600 text-sm font-medium"
                  htmlFor="name"
                >
                  Thành phố
                </label>
                <input
                  className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  id="name"
                  placeholder="Nhập tên thành phố và nhấn Enter"
                  type="text"
                  value={cityName}
                  onChange={handleInputChange}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainList;
