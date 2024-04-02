import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../utils";

export const useCreateCategory = (toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${API_URL}/categories/create-category`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },

    onError: async (error) => {
      toast.error(error?.response?.data?.message ?? error.message);
    },

    onSuccess: async (data) => {
      toast.success(data?.message);

      setTimeout(() => {
        window.location.replace("/categories");
      }, 2000);
    },
  });
};

export const useCategory = (toast, token) => {
  return useMutation({
    mutationFn: async (page) => {
      const { data } = await axios.post(
        `${API_URL}/categories/admin-category?page=${page}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
    onError: (error) => {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg ?? error.message);
      if (errMsg === "Authentication failed") {
        localStorage.removeItem("user");
      }
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
  });
};
