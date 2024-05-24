import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Button, Divider, Inputbox, Logo } from "../components";
import { Modal, useMantineColorScheme } from "@mantine/core";
import useStore from "../store";
import { saveUserInfo } from "../utils";
import { forgotpassword, googleSignin } from "../utils/apiCalls";

function ForgotPassword() {
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
    const result = await forgotpassword(data);
    setIsLoading(false);

    if (result?.success === true) {
      toast.success(result.message);
    } else {
      toast.error(result?.message);
    }
  };

  if (user?.token) window.location.replace("/");

  return (
    <div className="flex w-full  h-[100vh]">
      <div
        className="hidden md:flex flex-col gap-y-4 w-1/3 min-h-screen bg-black items-center justify-center bg-cover"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://doanhnhanplus.vn/wp-content/uploads/2017/12/DN-Trien-lam-anh-Viet-Nam-o-Phu-Quoc-BaiDN-251217-40.jpg")',
        }}
      >
        <Logo type="sigin" />
      </div>

      <div className="flex w-full md:w-2/3 h-full bg-white dark:bg-gradient-to-b md:dark:bg-gradient-to-r from-black via-[#071b3e] to-black items-center px-10 md:px-20 lg:px-40">
        <div className="h-full flex flex-col items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
          <div className="block mb-10 md:hidden">
            <Logo />
          </div>
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                Quên mật khẩu
              </h2>
            </div>

            {/* <Divider label="or sign in with email" /> */}
            <div className="flex items-center mt-4">
              {/* <div className="flex-1 border-t border-gray-300 dark:border-gray-500"></div> */}
              <div className="mx-4 text-gray-400 text-sm text-center	">
                Vui lòng nhập email của bạn. Bạn sẽ nhận được mật khẩu mới từ
                email này!
              </div>
              {/* <div className="flex-1 border-t border-gray-300 dark:border-gray-500"></div> */}
            </div>

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
              </div>

              <Button
                label="Gửi"
                type="submit"
                styles="group relative w-full flex justify-center py-2.5 2xl:py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-sky-800 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 mt-8"
              />
            </form>

            <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
              <p>
                <Link
                  to="/sign-in"
                  className="text-sky-800 font-medium text-center"
                >
                  Đăng nhập
                </Link>
              </p>
              <div className="text-sky-800 font-medium text-center mx-9	 ">
                {" "}
                |{" "}
              </div>
              <p>
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

export default ForgotPassword;
