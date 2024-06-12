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
        window.location.replace("/contents");
      }, 500);
    },
  });
};

export const useAnalytics = (toast, token) => {
  return useMutation({
    mutationFn: async (val) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/posts/admin-analytics?query=${val}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(data);
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

export const useContent = (toast, token) => {
  return useMutation({
    mutationFn: async (page) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/posts/admin-content?page=${page}`,
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

export const useUpdatePost = (toast, token) => {
  return useMutation({
    mutationFn: async ({ id, title, desc }) => {
      console.log(token);
      const { data } = await axios.patch(
        `${REACT_APP_API_URL}/posts/update/${id}`,
        { title, desc },
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

export const usePost = (toast, token) => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/posts/` + id,
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
      toast.error(error?.response?.data?.message ?? error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
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
export const useFollowers = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/posts/follower/` + id
      );
      return data;
    },
  });
};
export const useGetPost = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.get(`${REACT_APP_API_URL}/posts/` + id);

      return data?.data;
    },
  });
};

export const useDeleteComment = (token) => {
  return useMutation({
    mutationFn: async ({ id, postId }) => {
      const { data } = await axios.delete(
        `${REACT_APP_API_URL}/posts/comment/${id}/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
  });
};
export const useDeleteFollower = (token) => {
  return useMutation({
    mutationFn: async ({ id, writerId }) => {
      const { data } = await axios.delete(
        `${REACT_APP_API_URL}/posts/follower/${id}/${writerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
  });
};
export const usePayment = (toast, token) => {
  return useMutation({
    mutationFn: async (page) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/payment/admin-payments?page=${page}`,
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
