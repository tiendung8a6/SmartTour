import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../utils";

export const useCategories = () => {
  return useQuery({
    queryKey: "categories",
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/categories`);
      return data;
    },
  });
};

export const useCreatePost = (toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${API_URL}/posts/create-post`,
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
        window.location.replace("/blog");
      }, 2000);
    },
  });
};

export const useCreateTrip = (toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(`${API_URL}/trips/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("DTAAAA", data);
      return data;
    },

    onError: async (error) => {
      toast.error(error?.response?.data?.message ?? error.message);
    },

    onSuccess: async (data) => {
      console.log("data", data);
      toast.success(data?.message);

      setTimeout(() => {
        window.location.replace(`/trip/${data.data._id}`);
      }, 1500);
    },
  });
};
