import axios from "axios";

export let CATEGORIES = [];

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

axios
  .get(`${REACT_APP_API_URL}/categories`)
  .then((response) => {
    if (response.data.success) {
      CATEGORIES = response.data.data.map((category) => ({
        _id: category._id,
        label: category.label,
        color: `${category.color}`,
      }));
    }
  })
  .catch((error) => {
    console.error("Error fetching categories:", error);
  });
