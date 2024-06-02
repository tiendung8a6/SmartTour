import { Button, Modal, useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { MdArrowForward } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Loading, LoginForm, Navbar, SignUpForm } from "../components";
import useStore from "../store/store";

const StartPage = () => {
  const { colorScheme } = useMantineColorScheme();

  const { user, signInModal, setSignInModal } = useStore();
  const [visible, { toggle }] = useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(signInModal);
  const [isSignin, setIsSignin] = useState(true);
  const [formClose, setFormClose] = useState(false);

  const theme = colorScheme === "dark";

  const navigate = useNavigate();
  const location = useLocation();
  let from = location?.state?.from?.pathname || "/";

  useEffect(() => {
    user?.token && navigate(from);
  }, [user]);

  const handleCloseModal = () => {
    close();
    setSignInModal(!signInModal);
  };

  return (
    <div
      className={clsx(
        "w-full h-screen px-0 md:px-4",
        theme
          ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#302943] via-slate-900 to-black"
          : "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fff] via-blue-50 to-white"
      )}
    >
      <Navbar />
      <div className="w-full h-full flex flex-col items-center justify-center md:pt-24 gap-8 md:gap-6 px-4">
        <div className="w-full md:max-w-[630px] 2xl:max-w-3xl flex flex-col items-center justify-center gap-y-10 2xl:-mt-20">
          <span
            className={clsx(
              "hidden md:flex gap-1 py-1 px-3 border rounded-full text-xs 2xl:text-sm md:text-base",
              theme
                ? "border-gray-700 text-gray-400"
                : "border-gray-300 text-gray-600"
            )}
          >
            Khám phá vượt ra ngoài ranh giới: Hành trình của bạn, chuyên môn của
            chúng tôi!
            <Link
              onClick={open}
              className={clsx(
                "flex gap-1 items-center font-semibold text-[16px] 2xl:text-[18px]",
                theme ? "text-white" : "text-slate-700"
              )}
            >
              Đăng nhập
              <MdArrowForward />
            </Link>
          </span>
          <h1
            className={clsx(
              `text-4xl md:text-5xl 2xl:text-6xl font-bold text-center`,
              theme ? "text-gray-400" : "text-slate-700"
            )}
          >
            Chào mừng đến với trang quản trị!
          </h1>

          <span
            className={clsx(
              "text-center text-sm 2xl:text-base md:text-[18px]",
              theme ? "text-gray-500" : "text-slate-600"
            )}
          >
            Chúc bạn có trải nghiệm tuyệt vời!
          </span>

          <div className="flex gap-6 items-center mt-6">
            <Button
              onClick={open}
              className={`${
                theme ? "bg-blue-600" : "bg-black"
              } text-white rounded h-10 text-sm `}
            >
              Đăng nhập
              <MdArrowForward />
            </Button>
            {/* <Link to="#" className="flex gap-2 items-center font-semibold">
              Contact
              <MdArrowForward />
            </Link> */}
          </div>
        </div>
      </div>

      <Modal
        opened={opened || signInModal}
        onClose={formClose ? () => {} : handleCloseModal}
        title="Đăng nhập quản trị"
        centered
      >
        {isSignin ? (
          <LoginForm
            isSignin={isSignin}
            setIsSignin={setIsSignin}
            toast={toast}
            toggle={toggle}
            setFormClose={setFormClose}
          />
        ) : (
          <SignUpForm
            isSignin={isSignin}
            setIsSignin={setIsSignin}
            toast={toast}
            toggle={toggle}
            setFormClose={setFormClose}
          />
        )}
      </Modal>
      <Loading visible={visible} />
      <Toaster richColors />
    </div>
  );
};

export default StartPage;
