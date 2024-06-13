import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { REACT_APP_API_URL } from "../utils";

export const useCategories = () => {
  return useQuery({
    queryKey: "categories",
    queryFn: async () => {
      const { data } = await axios.get(`${REACT_APP_API_URL}/categories`);
      return data;
    },
  });
};

export const useUpdateUser = (toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.put(
        `${REACT_APP_API_URL}/users/update-user/`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    },
    onError: (error, data) => {
      toast.error(error?.response?.data?.message ?? error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  });
};
export const useCreatePost = (toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/posts/create-post`,
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
      }, 1000);
    },
  });
};

export const useCreateTrip = (toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/trips/create`,
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
        window.location.replace(`/trip/${data.data._id}`);
      }, 500);
    },
  });
};
export const useContent = (toast, token) => {
  return useMutation({
    mutationFn: async (page) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/posts/client-content?page=${page}`,
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
        localStorage.removeItem("userInfo");
      }
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
  });
};

export const useDeletePost = (toast, token, mutate) => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${REACT_APP_API_URL}/posts/` + id, {
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

export const useUpdatePost = (toast, token) => {
  return useMutation({
    mutationFn: async ({ id, title, desc, cat, img }) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/posts/update/${id}`,
        { title, desc, cat, img },
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
    onSuccess: async (data) => {
      toast.success(data?.message);

      setTimeout(() => {
        window.location.replace("/blog");
      }, 1000);
    },
  });
};
export const useAction = (toast, token) => {
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/posts/update-status/${id}`,
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
export const useCreateActivityPlan = (id, toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/plans/create/activity/${id}`,
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
        window.location.replace(`/trip/${data?.tripId}`);
      }, 1000);
    },
  });
};
export const useUpdateActivityPlan = (planId, toast, token, id) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/plans/update/activity/${planId}`,
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
        window.location.replace(`/trip/${id}`);
      }, 1000);
    },
  });
};
export const useCreateLodgingPlan = (id, toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/plans/create/lodging/${id}`,
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
        window.location.replace(`/trip/${data?.tripId}`);
      }, 1000);
    },
  });
};
export const useCreateFlightsPlan = (id, toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/plans/create/flights/${id}`,
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
        window.location.replace(`/trip/${data?.tripId}`);
      }, 1000);
    },
  });
};
export const useUpdateFlightsPlan = (planId, toast, token, id) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/plans/update/flights/${planId}`,
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
        window.location.replace(`/trip/${id}`);
      }, 1000);
    },
  });
};
export const useCreateCarPlan = (id, toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/plans/create/car/${id}`,
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
        window.location.replace(`/trip/${data?.tripId}`);
      }, 1000);
    },
  });
};

export const useCreateConcertPlan = (id, toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/plans/create/concert/${id}`,
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
        window.location.replace(`/trip/${data?.tripId}`);
      }, 1000);
    },
  });
};
export const useCreateTheaterPlan = (id, toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/plans/create/theater/${id}`,
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
        window.location.replace(`/trip/${data?.tripId}`);
      }, 1000);
    },
  });
};
export const useCreateCampPlan = (id, toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/plans/create/camp/${id}`,
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
        window.location.replace(`/trip/${data?.tripId}`);
      }, 1000);
    },
  });
};
export const useCreateParkingPlan = (id, toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/plans/create/parking/${id}`,
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
        window.location.replace(`/trip/${data?.tripId}`);
      }, 1000);
    },
  });
};
export const useCreateRestaurantPlan = (id, toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/plans/create/restaurant/${id}`,
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
        window.location.replace(`/trip/${data?.tripId}`);
      }, 1000);
    },
  });
};
export const useCreateRailPlan = (id, toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/plans/create/rail/${id}`,
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
        window.location.replace(`/trip/${data?.tripId}`);
      }, 1000);
    },
  });
};
export const useUpdateTrip = (toast, token) => {
  return useMutation({
    mutationFn: async ({
      id,
      tripName,
      city,
      startDate,
      endDate,
      image,
      status,
      total,
      description,
      hashtag,
    }) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/trips/update/${id}`,
        {
          tripName,
          city,
          startDate,
          endDate,
          image,
          status,
          total,
          description,
          hashtag,
        },
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
    onSuccess: async (data) => {
      toast.success(data?.message);
      setTimeout(() => {
        window.location.replace(`/trip/${data?.data?._id}`);
      }, 1000);
    },
  });
};
export const useUpdateConcertPlan = (planId, toast, token, id) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/plans/update/concert/${planId}`,
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
        window.location.replace(`/trip/${id}`);
      }, 1000);
    },
  });
};
export const useUpdateTheaterPlan = (planId, toast, token, id) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/plans/update/theater/${planId}`,
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
        window.location.replace(`/trip/${id}`);
      }, 1000);
    },
  });
};
export const useUpdateCarPlan = (planId, toast, token, id) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/plans/update/car/${planId}`,
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
        window.location.replace(`/trip/${id}`);
      }, 1000);
    },
  });
};
export const useUpdateRestaurantPlan = (planId, toast, token, id) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/plans/update/restaurant/${planId}`,
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
        window.location.replace(`/trip/${id}`);
      }, 1000);
    },
  });
};
export const useUpdateParkingPlan = (planId, toast, token, id) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/plans/update/parking/${planId}`,
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
        window.location.replace(`/trip/${id}`);
      }, 1000);
    },
  });
};
export const useUpdateLodgingPlan = (planId, toast, token, id) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/plans/update/lodging/${planId}`,
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
        window.location.replace(`/trip/${id}`);
      }, 1000);
    },
  });
};
export const useUpdateRailPlan = (planId, toast, token, id) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/plans/update/rail/${planId}`,
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
        window.location.replace(`/trip/${id}`);
      }, 1000);
    },
  });
};
export const useComments = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.get(
        `${REACT_APP_API_URL}/posts/comments/` + id
      );

      return data;
    },
  });
};
export const useDeleteComment = (token) => {
  return useMutation({
    mutationFn: async ({ id, postId }) => {
      const { data } = await axios.delete(
        `${REACT_APP_API_URL}/posts/comment/client/${id}/${postId}`
      );
      return data;
    },
  });
};
export const useActivateTrip = (toast, token) => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/trips/activate/${id}`,
        {},
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
    onSuccess: async (data, id) => {
      toast.success(data?.message);

      setTimeout(() => {
        window.location.replace(`/trip/${id}`);
      }, 500);
    },
  });
};
