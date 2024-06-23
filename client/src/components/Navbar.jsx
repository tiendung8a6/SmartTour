import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import useStore from "../store";
import Button from "./Button";
import Logo from "./Logo";
import ThemeSwitch from "./Switch";
import Notifications from "./Notifications";
import { Grid, Avatar } from "@mantine/core";
import { IconChevronDown, IconCoinBitcoin } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { getUser } from "../utils/apiCalls";

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
          <ul className="flex flex-col text-center gap-3 text-base text-black dark:text-gray-300">
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
              <Link to="/map/restaurants">Điểm Đến</Link>
            </li>
            <li onClick={toggleMenu}>
              <Link to="/blog">Blog</Link>
            </li>
            <li onClick={toggleMenu}>
              <Link to="/pricing">Mua điểm</Link>
            </li>
            <li onClick={toggleMenu}>
              <Link to="/contact">Liên Hệ</Link>
            </li>
            <li onClick={toggleMenu}>
              <Link to="/notification">Thông báo</Link>
            </li>
          </ul>
          <div className="flex gap-2 items-center">
            {user?.token ? (
              <div className="w-full flex flex-col items-center justify-center ">
                <div class="hidden lg:block">
                  <Grid>
                    <Grid.Col span={4} className="my-auto">
                      <Avatar
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
                  className="text-base text-center text-black dark:text-gray-300"
                >
                  Tài khoản của tôi
                </Link>
                <hr className="pt-4" />
                <button
                  className="bg-black dark:bg-sky-600 text-white dark:text-white px-8 py-1.5 rounded-full text-center outline-none"
                  onClick={() => signOut()}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link to="/sign-in">
                <Button
                  label="Đăng nhập"
                  styles="flex items-center justify-center bg-black dark:bg-sky-600 text-white dark:text-white text-white px-4 py-1.5 rounded-full"
                />
              </Link>
            )}
          </div>

          {/* Sáng tối */}
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
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation(); // Get the current path

  //TRUY VẤN DỮ NGƯỜI DÙNG --> Cập nhật Real-Time POINT
  const fetchUser = async () => {
    try {
      const data = await getUser(user?.user?._id);
      setUserInfo(data || []);
    } catch (error) {
      console.error("Error fetching trip or popular content:", error);
    } finally {
    }
  };
  useEffect(() => {
    if (user?.user?._id) {
      fetchUser();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [user?.user?._id]);

  const handleSignOut = () => {
    localStorage.removeItem("userInfo");
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

  const getNavLinkClass = (path) => {
    if (path === "/") {
      return location.pathname === "/"
        ? "text-sky-600 font-bold underline"
        : "text-black dark:text-white";
    } else {
      return location.pathname.startsWith(path)
        ? "text-sky-600 font-bold underline"
        : "text-black dark:text-white";
    }
  };

  return (
    <nav className="flex flex-col md:flex-row w-full py-5  items-center justify-between gap-4 md:gap-0">
      <Logo />
      <div className="hidden md:flex gap-12 items-center">
        <ul className="flex gap-8 text-base">
          <Link to="/" className={getNavLinkClass("/")}>
            Trang Chủ
          </Link>
          <Link to="/trip" className={getNavLinkClass("/trip")}>
            Chuyến Đi
          </Link>
          <Link to="/travel-guide" className={getNavLinkClass("/travel-guide")}>
            Hướng Dẫn Viên AI
          </Link>
          <Link
            to="/map/restaurants"
            className={getNavLinkClass("/map/restaurants")}
          >
            Điểm Đến
          </Link>
          <Link to="/blog" className={getNavLinkClass("/blog")}>
            Blog
          </Link>
          <Link to="/pricing" className={getNavLinkClass("/pricing")}>
            Mua Điểm
          </Link>
          <Link to="/contact" className={getNavLinkClass("/contact")}>
            Liên Hệ
          </Link>
        </ul>

        {/* Thông báo */}
        {user?.token && <Notifications />}

        {/* Sáng tối */}
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
                  <Avatar
                    src={userInfo?.image}
                    alt={user?.user?.name}
                    radius="xl"
                    color="blue"
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
                  {userInfo?.points}
                </span>
                <span className="flex flex-item place-content-center justify-self-center">
                  <IconChevronDown size="1rem" stroke={3} />
                </span>
              </div>

              {showProfile && (
                <div className="border-[2px] border-transparent mt-1  w-[210px] absolute bg-white dark:bg-[#2f2d30] py-6 px-6 flex flex-col shadow-2xl z-50 right-0 gap-3 rounded">
                  <Grid>
                    <Grid.Col span={4} className="my-auto">
                      <Avatar
                        src={userInfo?.image}
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
                      <div>{userInfo?.points}</div>
                      <div>Điểm</div>
                    </div>
                  </Link>
                  <hr />
                  <Link
                    to="/profile"
                    className="dark:text-white text-gray-500 text-sm"
                  >
                    Tài khoản của tôi
                  </Link>
                  <hr />
                  <span
                    className="text-gray-500 text-sm"
                    onClick={handleSignOut}
                  >
                    Đăng xuất
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Link to="/sign-in">
              <Button
                label="Đăng nhập"
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
