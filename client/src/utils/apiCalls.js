import axios from "axios";

export const API_URI = `http://localhost:8800/`;

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

      const result = await axios.post(`${API_URI}auth/google-signup`, data);
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

      const result = await axios.post(`${API_URI}auth/login`, data);
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
    const result = await axios.post(`${API_URI}auth/login`, data);

    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const emailSignup = async (data) => {
  try {
    const result = await axios.post(`${API_URI}auth/register`, data);

    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const getSinglePost = async (id) => {
  try {
    const { data } = await axios.get(`${API_URI}posts/${id}`);

    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const getPostComments = async (id) => {
  try {
    const { data } = await axios.get(`${API_URI}posts/comments/${id}`);

    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;

    console.log(error);

    return err;
  }
};

export const postComments = async (id, token, data) => {
  console.log("aaaawdwdwIIIOOO", id);
  try {
    const result = await axios.post(`${API_URI}posts/comment/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
      `${API_URI}posts/comment/${id}/${postId}`,
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
    const { data } = await axios.get(`${API_URI}users/get-user/${id}`);

    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;

    console.log(error);

    return err;
  }
};

export const followWriter = async (id, token) => {
  try {
    const res = await axios.post(`${API_URI}users/follower/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;

    console.log(error);

    return err;
  }
};

export const forgotpassword = async (data) => {
  try {
    const result = await axios.post(`${API_URI}auth/forgot-password`, data);

    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const getSingleTrip = async (id) => {
  try {
    const { data } = await axios.get(`${API_URI}trips/${id}`);

    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};
export const getSinglePlans = async (planId) => {
  try {
    const { data } = await axios.get(`${API_URI}plans/${planId}`);
    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};
export const getPublicTrips = async (planId) => {
  try {
    const { data } = await axios.get(`${API_URI}trips/public`);
    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};
