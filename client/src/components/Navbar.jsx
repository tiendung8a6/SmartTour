import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import useStore from "../store";
import Button from "./Button";
import Logo from "./Logo";
import ThemeSwitch from "./Switch";
import { Grid } from "@mantine/core";
import {
  IconChevronDown,
  IconCoinBitcoin,
  IconChevronRight,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
function getInitials(fullName) {
  const names = fullName?.split(" ");

  const initials = names?.slice(0, 2)?.map((name) => name[0]?.toUpperCase());

  const initialsStr = initials?.join("");

  return initialsStr;
}

const MobileMenu = ({ user, signOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const userEmail = user?.user?.email;
  const username1 = userEmail ? userEmail?.split("@")[0] : "";

  return (
    <div className="flex ">
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 text-gray-600 hover:text-gray-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-fit bg-white dark:bg-[#020b19] z-50 flex flex-col py-10 items-center justify-center shadow-xl gap-4">
          <Logo />
          <ul className="flex flex-col gap-4 text-base text-black dark:text-gray-300">
            <li onClick={toggleMenu}>
              <Link to="/">Trang Chủ</Link>
            </li>
            <li onClick={toggleMenu}>
              <Link to="/trip">Chuyến Đi</Link>
            </li>
            <li onClick={toggleMenu}>
              <Link to="/travel-guide">Hướng Dẫn Viên AI</Link>
            </li>
            <li onClick={toggleMenu}>
              <Link to="/blog">Blog</Link>
            </li>
            <li onClick={toggleMenu}>
              <Link to="/contact">Liên Hệ</Link>
            </li>
          </ul>
          <div className="flex gap-2 items-center">
            {user?.token ? (
              <div className="w-full flex flex-col items-center justify-center ">
                <div class="hidden lg:block">
                  <Grid>
                    <Grid.Col span={4} className="my-auto">
                      <img
                        src={user?.user?.image}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <div className="font-medium">
                        {user?.user?.name?.split(" ")[0]}
                      </div>
                      <div className="text-gray-500 text-sm">@{username1}</div>
                    </Grid.Col>
                  </Grid>
                  <hr />
                </div>
                <Link
                  to="/profile"
                  className="text-base text-black dark:text-gray-300"
                >
                  Tài Khoản Của Tôi
                </Link>
                <hr />
                <button
                  className="bg-black dark:bg-sky-600 text-white dark:text-white px-8 py-1.5 rounded-full text-center outline-none"
                  onClick={() => signOut()}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/sign-in">
                <Button
                  label="Sign in"
                  styles="flex items-center justify-center bg-black dark:bg-sky-600 text-white dark:text-white text-white px-4 py-1.5 rounded-full"
                />
              </Link>
            )}
          </div>

          {/* theme switch */}
          <ThemeSwitch />

          <span
            className="cursor-pointer text-xl font-semibold dark:text-white"
            onClick={toggleMenu}
          >
            <AiOutlineClose />
          </span>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, signOut } = useStore();
  const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("userInfo");
    // localStorage.removeItem("user");
    signOut();
  };
  const userEmail = user?.user?.email;
  const username1 = userEmail ? userEmail?.split("@")[0] : "";

  //use-click-outside: Click ra vùng trống để mất menu
  const profileRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex flex-col md:flex-row w-full py-5  items-center justify-between gap-4 md:gap-0">
      <Logo />
      <div className="hidden md:flex gap-14 items-center">
        <ul className="flex gap-8 text-base text-black dark:text-white">
          <Link to="/">Trang Chủ</Link>
          <Link to="/trip">Chuyến Đi</Link>
          <Link to="/travel-guide">Hướng Dẫn Viên AI</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Liên Hệ</Link>
        </ul>

        {/* theme switch */}
        <ThemeSwitch />

        <div className="flex gap-2 items-center cursor-pointer">
          {user?.token ? (
            <div
              ref={profileRef}
              className="relative"
              onClick={() => setShowProfile((prev) => !prev)}
            >
              <div className="flex gap-1 items-center cursor-pointer">
                {user?.user?.image ? (
                  <img
                    src={user?.user?.image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span className="text-white w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    {getInitials(user?.user?.name)}
                  </span>
                )}

                <span className=" font-medium text-sky-600 dark:text-gray-500">
                  {user?.user?.name?.split(" ")[0]} |
                </span>
                <span className="flex flex-item place-content-center justify-self-center text-yellow-500">
                  <IconCoinBitcoin size="1rem" stroke={2} />
                </span>
                <span className="flex flex-item place-content-center justify-self-center font-medium text-sky-600">
                  0
                </span>
                <span className="flex flex-item place-content-center justify-self-center">
                  <IconChevronDown size="1rem" stroke={3} />
                </span>
              </div>

              {showProfile && (
                <div className="border-[2px] border-transparent mt-1  w-[210px] absolute bg-white dark:bg-[#2f2d30] py-6 px-6 flex flex-col shadow-2xl z-50 right-0 gap-3 rounded">
                  <Grid>
                    <Grid.Col span={4} className="my-auto">
                      <img
                        src={user?.user?.image}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <div className="font-medium ">
                        {user?.user?.name?.split(" ")[0]}
                      </div>
                      <div className="text-gray-500 text-sm">@{username1}</div>
                    </Grid.Col>
                  </Grid>

                  <Link
                    to="/profile"
                    className="dark:text-white text-gray-900 text-sm"
                  >
                    <div class="flex justify-start space-x-1 font-semibold">
                      <div className="flex items-center text-yellow-500">
                        <IconCoinBitcoin size="1rem" stroke={2} />
                      </div>
                      <div>0</div>
                      <div>Điểm</div>
                    </div>
                  </Link>
                  <hr />
                  <Link
                    to="/profile"
                    className="dark:text-white text-gray-500 text-sm"
                  >
                    Tài Khoản Của Tôi
                  </Link>
                  <hr />
                  {/* <Link className="text-gray-500 text-sm" to="/profile">
                    Viết blog
                  </Link>
                  <Link className="text-gray-500 text-sm" to="/new-post">
                    Bài viết của tôi
                  </Link>
                  <hr />
                  <Link className="text-gray-500 text-sm" to="/my-post">
                    Bài viết đã lưu
                  </Link>
                  <hr />
                  <Link className="text-gray-500 text-sm" to="/new-post">
                    Cài đặt
                  </Link> */}
                  <span
                    className="text-gray-500 text-sm"
                    onClick={handleSignOut}
                  >
                    Logout
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Link to="/sign-in">
              <Button
                label="Sign in"
                styles="flex items-center justify-center bg-black dark:bg-sky-600 text-white dark:text-white px-4 py-1.5 rounded-full"
              />
            </Link>
          )}
        </div>
      </div>
      <div className="block md:hidden">
        <MobileMenu user={user} signOut={handleSignOut} />
      </div>
    </nav>
  );
};

export default Navbar;
