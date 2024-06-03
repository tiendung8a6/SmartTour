import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { REACT_APP_API_URL } from "../utils";

export const useUsers = (toast, token) => {
  return useMutation({
    mutationFn: async (page) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/users/admin-users?page=${page}`,
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

export const useDeleteUser = (toast, token, mutate) => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(
        `${REACT_APP_API_URL}/users/delete-user/` + id,
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
      mutate(); // Cập nhật dữ liệu sau khi xóa người dùng thành công
    },
  });
};

export const useUserAction = (toast, token) => {
  return useMutation({
    mutationFn: async ({ id, isLock }) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/users/update-user-lock/${id}`,
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
