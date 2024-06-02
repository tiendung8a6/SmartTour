import { useGoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Button, Divider, Inputbox, Logo } from "../components";
import { Modal, useMantineColorScheme } from "@mantine/core";
import useStore from "../store";
import { saveUserInfo } from "../utils";
import { emailLogin, googleSignin } from "../utils/apiCalls";

function SignIn() {
  const { user, signIn, setIsLoading } = useStore();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const result = await emailLogin(data);
    setIsLoading(false);

    if (result?.success === true) {
      saveUserInfo(result, signIn);
    } else {
      toast.error(result?.message);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const user = await googleSignin(tokenResponse?.access_token);

      if (user?.success === true) {
        saveUserInfo(user, signIn);
      } else {
        toast.error("Đã xảy ra lỗi. Hãy thử đăng ký tài khoản.");
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Lỗi đăng nhập, thử lại!");
    },
  });

  if (user?.token) window.location.replace("/");

  return (
    <div className="flex w-full  h-[100vh]">
      <div
        className="hidden md:flex flex-col gap-y-4 w-1/3 min-h-screen items-center justify-center bg-cover bg-local"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://dulichtoday.vn/wp-content/uploads/2017/04/vinh-Ha-Long.jpg")',
        }}
      >
        <Logo type="sigin" />
        <span className="text-xl font-semibold text-white">Xin chào!</span>
      </div>

      <div className="flex w-full md:w-2/3 h-full bg-white dark:bg-gradient-to-b md:dark:bg-gradient-to-r from-black via-[#071b3e] to-black items-center px-10 md:px-20 lg:px-40">
        <div className="h-full flex flex-col items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
          <div className="block mb-10 md:hidden">
            <Logo />
          </div>
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                Đăng nhập với tài khoản của bạn
              </h2>
            </div>

            <Button
              onClick={() => googleLogin()}
              label="Đăng nhập bằng Google"
              icon={<FcGoogle className="" />}
              styles="w-full flex flex-row-reverse gap-4 bg-white dark:bg-transparent text-black dark:text-white px-5 py-2.5 rounded-full border border-gray-300"
            />

            <Divider label="hoặc đăng nhập bằng email" />

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col rounded-md shadow-sm -space-y-px gap-5">
                <Inputbox
                  label="Email"
                  name="email"
                  type="email"
                  isRequired={true}
                  placeholder="Email"
                  value={data?.email}
                  onChange={handleChange}
                />

                <Inputbox
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  isRequired={true}
                  placeholder="Mật khẩu"
                  value={data?.password}
                  onChange={handleChange}
                />
                <div className="flex items-center justify-end text-gray-600 dark:text-gray-300">
                  <p>
                    <Link
                      to="/forgot-password"
                      className="text-sky-800 font-medium"
                    >
                      Quên mật khẩu
                    </Link>
                  </p>
                </div>
              </div>

              <Button
                label="Đăng nhập"
                type="submit"
                styles="group relative w-full flex justify-center py-2.5 2xl:py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-sky-800 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 mt-8"
              />
            </form>

            <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
              <p>
                Bạn chưa có tài khoản?{" "}
                <Link to="/sign-up" className="text-sky-800 font-medium">
                  Đăng kí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Toaster richColors />
    </div>
  );
}

export default SignIn;
