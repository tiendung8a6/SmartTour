import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { REACT_APP_API_URL } from "../utils";

export const useTrip = (toast, token) => {
  return useMutation({
    mutationFn: async (page) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/trips/admin-trip?page=${page}`,
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
export const useDeleteTrip = (toast, token, mutate) => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${REACT_APP_API_URL}/trips/` + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      mutate();
    },
  });
};

export const useAction = (toast, token) => {
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/trips/update-status/${id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
  });
};

export const useGetTrip = (toast, token) => {
  return useMutation({
    mutationFn: async ({ id, label, color }) => {
      console.log(token);
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/trips/${id}`,
        { label, color },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);

      window.location.reload();
    },
  });
};
