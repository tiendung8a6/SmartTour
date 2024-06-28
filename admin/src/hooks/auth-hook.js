import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { REACT_APP_API_URL } from "../utils";

export const useSignUp = (toast, toggle) => {
  return useMutation({
    mutationFn: async (formData) => {
      toggle();
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/auth/register`,
        formData
      );

      return data;
    },
    onError: (error, data) => {
      toggle();
      toast.error(error?.response?.data?.message ?? error.message);
    },
    onSuccess: (data) => {
      toggle();
      toast.success(data?.message);
      localStorage.setItem(
        "otp_data",
        JSON.stringify({
          otpLevel: true,
          id: data.user._id,
        })
      );
      setTimeout(() => {
        window.location.replace("/otp-verification");
      }, 3000);
    },
  });
};

export const useSignin = (toast, toggle) => {
  return useMutation({
    mutationFn: async (formData) => {
      toggle();
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/auth/login-admin`,
        formData
      );
      localStorage.setItem("user", JSON.stringify(data));

      return data;
    },
    onError: (error) => {
      toggle();
      toast.error(error?.response?.data?.message ?? error.message);
    },
    onSuccess: (data) => {
      toggle();
      toast.success(data?.message);

      setTimeout(() => {
        window.location.replace("/analytics");
      }, 500);
    },
  });
};

export const useVerification = (toast) => {
  return useMutation({
    mutationFn: async ({ id, otp }) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/users/verify/${id}/${otp}`
      );
      return data;
    },
    onError: (error, data) => {
      toast.error(error?.response?.data?.message ?? error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);

      setTimeout(() => {
        localStorage.removeItem("otp_data");
        window.location.replace("/sign-in");
      }, 1000);
    },
  });
};

export const useResend = (toast) => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/users/resend-link/${id}`
      );

      return data;
    },
    onError: (error, data) => {
      toast.error(error?.response?.data?.message ?? error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);

      localStorage.setItem(
        "otp_data",
        JSON.stringify({
          otpLevel: true,
          id: data.user._id,
        })
      );

      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
      localStorage.setItem("user", JSON.stringify(data));

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

export const useCreateAdmin = (toast, token) => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}/auth/create-admin`,
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
        window.location.replace("/users");
      }, 500);
    },
  });
};
