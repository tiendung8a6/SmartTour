import axios from "axios";

export const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const getGoogleSignup = async (access_token) => {
  try {
    const user = await axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => res.data);

    if (user?.sub) {
      const data = {
        name: user.name,
        email: user.email,
        emailVerified: user.email_verified,
        image: user.picture,
      };

      const result = await axios.post(
        `${REACT_APP_API_URL}/auth/google-signup`,
        data
      );
      console.log(result);

      return result?.data;
    }
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const googleSignin = async (token) => {
  try {
    const user = await axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data);

    if (user?.sub) {
      const data = {
        email: user.email,
      };

      const result = await axios.post(`${REACT_APP_API_URL}/auth/login`, data);
      return result?.data;
    }
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const emailLogin = async (data) => {
  try {
    const result = await axios.post(`${REACT_APP_API_URL}/auth/login`, data);

    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const emailSignup = async (data) => {
  try {
    const result = await axios.post(`${REACT_APP_API_URL}/auth/register`, data);

    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const getSinglePost = async (id) => {
  try {
    const { data } = await axios.get(`${REACT_APP_API_URL}/posts/${id}`);

    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const getPostComments = async (id) => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_API_URL}/posts/comments/${id}`
    );

    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;

    console.log(error);

    return err;
  }
};

export const postComments = async (id, token, data) => {
  try {
    const result = await axios.post(
      `${REACT_APP_API_URL}/posts/comment/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(result);
    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const deleteComment = async (id, token, postId) => {
  try {
    const result = await axios.delete(
      `${REACT_APP_API_URL}/posts/comment/${id}/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const getWriterInfo = async (id) => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_API_URL}/users/get-user/${id}`
    );

    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;

    console.log(error);

    return err;
  }
};

export const followWriter = async (id, token) => {
  try {
    const res = await axios.post(
      `${REACT_APP_API_URL}/users/follower/${id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;

    console.log(error);

    return err;
  }
};

export const forgotpassword = async (data) => {
  try {
    const result = await axios.post(
      `${REACT_APP_API_URL}/auth/forgot-password`,
      data
    );

    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const getSingleTrip = async (id) => {
  try {
    const { data } = await axios.get(`${REACT_APP_API_URL}/trips/${id}`);

    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};
export const getSinglePlans = async (planId) => {
  try {
    const { data } = await axios.get(`${REACT_APP_API_URL}/plans/${planId}`);
    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};
export const getPublicTrips = async (planId) => {
  try {
    const { data } = await axios.get(`${REACT_APP_API_URL}/trips/public`);
    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};
export const getUser = async (id) => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_API_URL}/users/get-info/${id}`
    );

    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const getNotification = async (id) => {
  try {
    const { data } = await axios.get(`${REACT_APP_API_URL}/notification/${id}`);
    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);
    return err;
  }
};
