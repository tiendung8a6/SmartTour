import { useMutation } from "@tanstack/react-query";
import axios from "axios";
// import { API_URL } from "../utils";

export const API_URI = `http://localhost:8800/`;

export const getWriterInfo = async (id) => {
  try {
    const { data } = await axios.get(`${API_URI}users/get-user/${id}`);

    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;

    console.log(error);

    return err;
  }
};
