import {
  Button,
  Drawer,
  Menu,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { BiMenu } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

import clsx from "clsx";
import { MdArrowForward } from "react-icons/md";
import Profile from "../assets/profile.png";
import useStore from "../store/store";
import Logo from "./Logo";
import Sidebar from "./Sidebar";

function UserMenu({ user, theme }) {
  const { signOut, setEditProfile } = useStore();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    signOut();
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          className={`${
            theme ? "text-gray-400" : "text-black"
          } flex items-center`}
        >
          <img
            src={user?.image || Profile}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div className="hidden md:flex flex-col items-start ml-1">
            <div className="text-center	">
              <p className="font-semibold">{user?.name}</p>
              <span className="text-sm font-normal">{user?.email}</span>
            </div>
          </div>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Cài đặt</Menu.Label>
        <Menu.Item
          leftSection={<FaUser style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => setEditProfile(true)}
        >
          Tài khoản
        </Menu.Item>

        <Menu.Item
          leftSection={
            <AiOutlineLogout style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={() => handleSignOut()}
        >
          Đăng xuất
        </Menu.Item>

        {/* <Menu.Divider />

        <Menu.Label>Danger Zone</Menu.Label>
        <Menu.Item
          color="red"
          leftSection={
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={() => {}}
        >
          Delete account
        </Menu.Item> */}
      </Menu.Dropdown>
    </Menu>
  );
}

function MobileDrawer({ theme }) {
  const { user } = useStore();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Sidebar close={close} />
      </Drawer>

      <Button
        onClick={open}
        className={theme ? "text-white" : "text-slate-800"}
      >
        <BiMenu className="text-xl" />
      </Button>
    </>
  );
}

const Navbar = () => {
  const { colorScheme } = useMantineColorScheme();

  const { user, signInModal, setSignInModal } = useStore();
  const location = useLocation();
  const theme = colorScheme === "dark";

  const handleLogin = () => {
    location?.pathname === "/" && setSignInModal(!signInModal);
  };

  return (
    <nav
      className={`w-full fixed top-0 z-50 bg-transparent flex flex-row px-0 md:px-6 py-4 md:py-5 items-center justify-between gap-4 md:gap-0 shadow`}
    >
      {user && (
        <div className="block lg:hidden">
          <MobileDrawer theme={theme} />
        </div>
      )}

      <Logo />
      <div className="flex gap-14 items-center">
        <div className="flex gap-2 items-center">
          {user?.token ? (
            <UserMenu user={user?.user} theme={theme} />
          ) : (
            <Link
              to="/sign-in"
              onClick={handleLogin}
              className={clsx(
                `flex items-center gap-2 rounded-full 2xl:mr-10 text-base`,
                theme ? "text-white" : "text-black"
              )}
            >
              <span>Đăng nhập</span>
              <MdArrowForward />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
