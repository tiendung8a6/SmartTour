import { useGoogleLogin } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { BiImages } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Button, Divider, Inputbox, Logo, SignUpForm } from "../components";

import useStore from "../store";
import { saveUserInfo, uploadFile } from "../utils";
import { emailSignup, getGoogleSignup } from "../utils/apiCalls";

function SignUp() {
  const { user, signIn, setIsLoading } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [file, setFile] = useState("");
  const [fileURL, setFileURL] = useState("");

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
    const result = await emailSignup({ ...data, image: fileURL });
    setIsLoading(false);

    if (result?.success === true) {
      saveUserInfo(result, signIn);
    } else {
      toast.error(result?.message);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      const user = await getGoogleSignup(tokenResponse?.access_token);

      setIsLoading(false);
      if (user?.success === true) {
        saveUserInfo(user, signIn);
      } else {
        toast.error(user?.message);
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Login Error, Try again!");
    },
  });

  useEffect(() => {
    file && uploadFile(setFileURL, file);
  }, [file]);

  if (user?.token) window.location.replace("/");

  return (
    <div className="flex w-full h-[100vh]">
      {/* LEFT */}
      <div
        className="hidden md:flex flex-col gap-y-4 w-1/3 h-ful items-center justify-center bg-cover"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://ik.imagekit.io/tvlk/blog/2023/07/nyBBvwZY-canh-dep-thien-nhien-Viet-Nam-12.jpg")',
        }}
      >
        <Logo type="sigin" />
      </div>

      {/* RIGHT */}
      <div className="flex w-full md:w-2/3 h-full bg-white dark:bg-gradient-to-b md:dark:bg-gradient-to-r from-black via-[#071b3e] to-black items-center px-4 md:px-20 lg:px-40">
        <div className="w-full h-full flex flex-col items-center justify-center py-12 px-4 sm:px-0 lg:px-8">
          <div className="block mb-10 md:hidden -ml-8">
            <Logo />
          </div>

          <div className="w-full space-y-6 flex flex-col  justify-start">
            <div className="max-w-md w-full flex gap-3 md:gap-4 items-center justify-center mb-8">
              {showForm && (
                <IoArrowBackCircleSharp
                  className="text-2xl lg:text-3xl cursor-pointer text-gray-800 dark:text-gray-400"
                  onClick={() => setShowForm(false)}
                />
              )}
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">
                Đăng kí tài khoản
              </h2>
            </div>

            {showForm ? (
              <SignUpForm toast={toast} />
            ) : (
              <>
                <div className="max-w-md w-full space-y-8">
                  <Button
                    onClick={() => googleLogin()}
                    label="Đăng kí với Google"
                    icon={<FcGoogle className="text-xl" />}
                    styles="w-full flex flex-row-reverse gap-4 bg-black dark:bg-transparent dark:border text-white px-5 py-2.5 rounded-full"
                  />
                  <Divider label="Hoặc" />

                  <Button
                    onClick={() => setShowForm(true)}
                    label="Đăng kí với email"
                    styles="w-full gap-4 bg-white text-black dark:bg-sky-800 dark:text-white px-5 py-2.5 rounded-full border dark:border-none border-gray-300"
                  />
                </div>
              </>
            )}

            <p className="max-w-md w-full text-center text-gray-600 dark:text-gray-300">
              Bạn đã có tài khoản?{" "}
              <Link to="/sign-in" className="text-sky-800 font-medium">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Toaster richColors />
    </div>
  );
}

export default SignUp;
