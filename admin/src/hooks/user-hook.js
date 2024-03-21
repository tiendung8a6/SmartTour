import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../utils";

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

export const useUsers = (toast, token) => {
  return useMutation({
    mutationFn: async (page) => {
      const { data } = await axios.post(
        `${API_URL}/users/admin-users?page=${page}`,
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

export const useDeleteUser = (toast, token) => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(
        `${API_URL}/users/delete-user/` + id,
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

export const useUserAction = (toast, token) => {
  return useMutation({
    mutationFn: async ({ id, isLock }) => {
      const { data } = await axios.patch(
        `${API_URL}/users/update-user-lock/${id}`,
        { isLock: isLock },
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
