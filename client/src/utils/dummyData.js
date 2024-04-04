import axios from "axios";

export let CATEGORIES = [];

axios
  .get("http://localhost:8800/categories")
  .then((response) => {
    if (response.data.success) {
      CATEGORIES = response.data.data.map((category) => ({
        _id: category._id,
        label: category.label,
        color: `${category.color}`,
      }));
      console.log("CATEGORIES", CATEGORIES);
    }
  })
  .catch((error) => {
    console.error("Error fetching categories:", error);
  });
