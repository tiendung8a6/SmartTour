import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { REACT_APP_API_URL } from "../utils";

export const useDeletePlan = (toast, token) => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${REACT_APP_API_URL}/plans/` + id, {
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
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
  });
};
