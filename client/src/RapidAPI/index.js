import axios from "axios";

const rapidAPIHost = process.env.REACT_APP_RAPIDAPI_HOST;
const rapidAPIKey = process.env.REACT_APP_RAPIDAPI_KEY;
const openCageKey = process.env.REACT_APP_OPENCAGE_KEY;

export const fetchData = (url, { sw, ne }) => {
  return axios({
    method: "GET",
    url: url,
    params: {
      bl_latitude: sw.lat,
      tr_latitude: ne.lat,
      bl_longitude: sw.lng,
      tr_longitude: ne.lng,
      currency: "VND",
      lunit: "km",
      lang: "vn_VN",
    },
    headers: {
      "X-RapidAPI-Host": rapidAPIHost,
      "X-RapidAPI-Key": rapidAPIKey,
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const fetchCity = (placeName) => {
  console.log("placeName", placeName);
  return axios({
    method: "GET",
    url: `https://api.opencagedata.com/geocode/v1/json`,
    params: {
      q: placeName,
      key: openCageKey,
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};
