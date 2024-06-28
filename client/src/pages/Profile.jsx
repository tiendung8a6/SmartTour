import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
  Button,
  Container,
  Modal,
  TextInput,
  useMantineColorScheme,
  Textarea,
  NumberInput,
  Tabs,
  rem,
  Table,
  Grid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Toaster, toast } from "sonner";
import { useUpdateUser } from "../hooks/client-hook";
import useStore from "../store";
import { uploadFile } from "../utils";
import {
  IconPhoto,
  IconMessageCircle,
  IconSettings,
  IconUsers,
  IconUser,
  IconBrandSamsungpass,
  IconTrashFilled,
} from "@tabler/icons-react";
import { FaEdit } from "react-icons/fa";
import { LoadingClient } from "../components";
import { NewPost } from "../components";
import { MyPosts } from "../components";
import classes from "./Profile.module.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { colorScheme } = useMantineColorScheme();
  const theme = colorScheme === "dark";
  const { user, editProfile, setEditProfile, signIn, signOut } = useStore();
  const { data, mutate, isPending, isSuccess } = useUpdateUser(
    toast,
    user?.token
  );
  const navigate = useNavigate();

  const iconStyle = { width: rem(12), height: rem(12) };
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState("");
  const [fileURL, setFileURL] = useState(user?.user?.image || "");

  const name = user?.user?.name.split(" ");
  const form = useForm({
    initialValues: {
      email: user?.user?.email,
      firstName: name?.[0],
      lastName: name?.slice(1)?.join(" "),
    },
    validate: {
      firstName: (value) =>
        value.length < 3 ? "First name is too short" : null,
      lastName: (value) => (value.length < 2 ? "Last name is too short" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values) => {
    mutate({
      ...values,
      image: fileURL || user.user.image,
    });

    if (isSuccess) {
      signIn(data);
      setEditProfile(false);
    }
  };

  useEffect(() => {
    const upload = () => {
      if (file) {
        setIsUploading(true);
        uploadFile(setFileURL, file);
        setIsUploading(false);
      }
    };
    upload();
  }, [file]);
  const userEmail = user?.user?.email;
  const username1 = userEmail ? userEmail.split("@")[0] : "";

  const handleSignOut = () => {
    localStorage.removeItem("userInfo");
    signOut();
    navigate("/");
  };

  return (
    <>
      <Tabs
        variant="unstyled"
        className=""
        defaultValue="profile"
        orientation="vertical"
        classNames={classes}
      >
        <Tabs.List grow className="w-[300px] h-[400px] shadow-2xl sm:w-100 ">
          <div className="m-[10px] ">
            <Grid className="">
              <Grid.Col span={4} className="">
                <img
                  src={user?.user?.image}
                  alt="Profile"
                  className="w-[50px] mx-auto h-[50px]  sm:w-[40px]  sm:h-[40px] rounded-full"
                />
              </Grid.Col>

              <Grid.Col span={8} className="my-auto items-center ml-[-12px]">
                <div className="font-medium h-full ">
                  {user?.user?.name?.split(".").map((name, index) => (
                    <span key={index}>{name}</span>
                  ))}
                </div>
                <div className="text-gray-500 text-sm">@{username1}</div>
              </Grid.Col>
            </Grid>
          </div>
          <hr />

          <Tabs.Tab
            value="profile"
            leftSection={
              <IconUser style={{ width: rem(16), height: rem(16) }} />
            }
            className="my-[20px] hover:bg-sky-400 hover:text-black"
          >
            Trang Cá Nhân
          </Tabs.Tab>
          <hr />
          <Tabs.Tab
            value="createBlog"
            leftSection={
              <IconMessageCircle style={{ width: rem(16), height: rem(16) }} />
            }
            className="mt-[20px] mb-[10px] hover:bg-sky-400 hover:text-black"
          >
            Viết blog
          </Tabs.Tab>

          <Tabs.Tab
            value="MyPost"
            leftSection={
              <IconPhoto style={{ width: rem(16), height: rem(16) }} />
            }
            className="mt-[10px] mb-[20px] hover:bg-sky-400 hover:text-black "
          >
            Bài viết của tôi
          </Tabs.Tab>
          <hr></hr>
          <Tabs.Tab
            value="Settings"
            leftSection={
              <IconSettings style={{ width: rem(16), height: rem(16) }} />
            }
            className="my-[20px] hover:bg-sky-400 hover:text-black"
          >
            Cài đặt
          </Tabs.Tab>
        </Tabs.List>

        <div className="h-auto w-full  ">
          <Tabs.Panel className="h-auto m-5 " value="profile">
            <div
              span={4}
              className="h-[220px] w-full bg-black"
              style={{
                backgroundColor: "#ff9d00",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg stroke='%23000' stroke-width='66.7' stroke-opacity='0.05' %3E%3Ccircle fill='%23ff9d00' cx='0' cy='0' r='1800'/%3E%3Ccircle fill='%23fb8d17' cx='0' cy='0' r='1700'/%3E%3Ccircle fill='%23f47d24' cx='0' cy='0' r='1600'/%3E%3Ccircle fill='%23ed6e2d' cx='0' cy='0' r='1500'/%3E%3Ccircle fill='%23e35f34' cx='0' cy='0' r='1400'/%3E%3Ccircle fill='%23d85239' cx='0' cy='0' r='1300'/%3E%3Ccircle fill='%23cc453e' cx='0' cy='0' r='1200'/%3E%3Ccircle fill='%23be3941' cx='0' cy='0' r='1100'/%3E%3Ccircle fill='%23b02f43' cx='0' cy='0' r='1000'/%3E%3Ccircle fill='%23a02644' cx='0' cy='0' r='900'/%3E%3Ccircle fill='%23901e44' cx='0' cy='0' r='800'/%3E%3Ccircle fill='%23801843' cx='0' cy='0' r='700'/%3E%3Ccircle fill='%236f1341' cx='0' cy='0' r='600'/%3E%3Ccircle fill='%235e0f3d' cx='0' cy='0' r='500'/%3E%3Ccircle fill='%234e0c38' cx='0' cy='0' r='400'/%3E%3Ccircle fill='%233e0933' cx='0' cy='0' r='300'/%3E%3Ccircle fill='%232e062c' cx='0' cy='0' r='200'/%3E%3Ccircle fill='%23210024' cx='0' cy='0' r='100'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
              }}
            ></div>
            <div>
              <div className="mt-[-100px] flex justify-start m-[64px] ">
                <img
                  src={user?.user?.image}
                  alt="Profile"
                  className="w-[150px]  h-[150px] rounded-full"
                />
                <div className="font-medium text-3xl flex items-end">
                  {user?.user?.name?.split(" ")[0]}
                </div>
              </div>
            </div>

            <Grid className="">
              <Grid.Col span={{ base: 12, md: 6, lg: 5 }}>
                <Grid>
                  <Grid.Col span="12">
                    <div className="border shadow-xl p-[20px] rounded-2xl drop-shadow-2xl">
                      <span className="text-xl font-medium dark:text-sky-500">
                        Thông tin
                      </span>
                      <div className="mt-5 flex ">
                        <IconUsers
                          stroke={2}
                          className="mr-2 dark:text-gray-300"
                        />{" "}
                        Là thành viên của SmartTour từ{" "}
                        {moment(user?.user?.createdAt).fromNow()}
                      </div>
                    </div>
                  </Grid.Col>
                  <Grid.Col span="12">
                    <div className="border shadow-xl p-[20px] rounded-2xl drop-shadow-2xl">
                      <span className="text-xl font-medium dark:text-sky-500">
                        Cập nhật
                      </span>
                      <div className="mt-5 flex ">
                        <IconUsers
                          stroke={2}
                          className="mr-2 dark:text-gray-300"
                        />
                        Thay đổi thông tin gần nhất từ{" "}
                        {moment(user?.user?.updatedAt).fromNow()}
                      </div>
                    </div>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col
                span={{ base: 12, md: 6, lg: 7 }}
                className="border shadow-xl p-[20px] rounded-2xl drop-shadow-2xl  "
              >
                <span className="text-xl font-medium dark:text-sky-500">
                  Thành tích
                </span>

                <Grid className="mt-4">
                  <Grid.Col
                    span={{ base: 12, md: 6, lg: 5 }}
                    className="p-[10px] "
                  >
                    <p className="dark:text-gray-300">Chưa có thông tin.</p>
                    {/* <img
                      className="min-w-[228px]  h-[128px] bg-black rounded-md"
                      src="https://i.pinimg.com/736x/2e/0a/ac/2e0aac9175f250eeb4a3a5feabbeb2b7.jpg"
                    ></img> */}
                  </Grid.Col>
                  <Grid.Col
                    span={{ base: 12, md: 6, lg: 7 }}
                    className="text-wrap"
                  >
                    {/* <span className="text-lg font-medium">Tên Bài Viết</span>{" "}
                    <br></br>
                    <span className="break-words">
                      llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
                    </span> */}
                  </Grid.Col>
                </Grid>

                <br />
                <hr />
                {/* map item blog */}
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* ĐĂNG BÀI */}
          <Tabs.Panel className="m-5" value="createBlog">
            <NewPost />
          </Tabs.Panel>

          {/* DANH SÁCH BÀI ĐĂNG */}
          <Tabs.Panel className="m-5" value="MyPost">
            <MyPosts />
          </Tabs.Panel>

          <Tabs.Panel className="m-5" value="Settings">
            <Tabs defaultValue="ChangeInfoInvidual">
              <Tabs.List>
                <Tabs.Tab
                  value="ChangeInfoInvidual"
                  leftSection={<IconUsers style={iconStyle} />}
                >
                  Thông tin cá nhân
                </Tabs.Tab>
                <Tabs.Tab
                  value="ChangePass"
                  leftSection={<IconBrandSamsungpass style={iconStyle} />}
                >
                  Mật Khẩu & Bảo Mật
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="ChangeInfoInvidual" pt="xs">
                <Container>
                  <form
                    onSubmit={form.onSubmit(handleSubmit)}
                    className=" flex-col   px-5 pb-5 "
                  >
                    <Grid className="">
                      <Grid.Col span={{ base: 12, md: 6, lg: 2 }} className="">
                        <div className="relative w-[100px] h-[100px] m-10 ">
                          <img
                            src={fileURL}
                            alt="Profile"
                            className="w-[100px] h-[100px] rounded-full object-cover"
                          />

                          <label
                            className={clsx(
                              "absolute bottom-0 -right-1 w-6 h-6 shadow-xl rounded-full border text-base cursor-pointer flex items-center justify-center text-gray-600"
                            )}
                            htmlFor="imgUpload"
                          >
                            <input
                              type="file"
                              onChange={(e) => setFile(e.target.files[0])}
                              className="hidden"
                              id="imgUpload"
                              data-max-size="5120"
                              accept=".jpg, .png, .jpeg"
                            />
                            <FaEdit />
                          </label>
                        </div>
                      </Grid.Col>

                      <Grid.Col
                        span={{ base: 12, md: 6, lg: 5 }}
                        className="my-auto items-center "
                      >
                        <div className="font-medium text-[40px]">
                          {user?.user?.name?.split(" .").map((name, index) => (
                            <span key={index}>{name}</span>
                          ))}
                        </div>

                        <div className="text-gray-500 text-sm">
                          @{username1}
                        </div>
                      </Grid.Col>
                    </Grid>

                    {isUploading && (
                      <span
                        className={clsx(
                          theme ? "text-gray-400" : "text-gray-600",
                          "text-xs"
                        )}
                      >
                        Uploading, please wait...
                      </span>
                    )}

                    <Grid className="mt-2">
                      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                        <TextInput
                          className="w-full"
                          withAsterisk
                          label="Họ"
                          placeholder="Họ"
                          {...form.getInputProps("firstName")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                        <TextInput
                          className="w-full"
                          withAsterisk
                          label="Tên"
                          placeholder="Tên"
                          {...form.getInputProps("lastName")}
                        />
                      </Grid.Col>
                    </Grid>

                    <TextInput
                      className="mt-5 w-full"
                      withAsterisk
                      label="Email"
                      placeholder="your@email.com"
                      disabled
                      readOnly
                      {...form.getInputProps("email")}
                    />

                    <Textarea
                      className="mt-5"
                      placeholder="Autosize with no rows limit"
                      label="Bio"
                      autosize
                      minRows={3}
                    />

                    <Button
                      type="submit"
                      className="bg-black w-[100px] mt-3 flex float-end "
                    >
                      Cập nhật
                    </Button>
                  </form>
                </Container>
              </Tabs.Panel>

              <Tabs.Panel value="ChangePass" pt="xs">
                <Container>
                  <div className="shadow-xl m-2 h-[350px] border rounded-lg ">
                    <div className="m-2 font-medium">Thay đổi mật khẩu</div>
                    <hr></hr>
                    <form
                      onSubmit={form.onSubmit(handleSubmit)}
                      className=" flex-col px-5 pb-5 "
                    >
                      <TextInput
                        className="w-full mt-5"
                        withAsterisk
                        label="Mật khẩu cũ"
                        placeholder="Nhập mật khẩu cũ"
                      />

                      <TextInput
                        className="w-full mt-5"
                        withAsterisk
                        label="Mật khẩu mới"
                        placeholder="Nhập Mật khẩu mới"
                      />
                      <TextInput
                        className="w-full mt-5"
                        withAsterisk
                        label="Xác nhận mật khẩu mới"
                        placeholder="Nhập Mật khẩu mới"
                      />
                      <Button
                        type="submit"
                        className="bg-black w-[100px] mt-5 flex float-end "
                      >
                        Cập nhật
                      </Button>
                    </form>
                  </div>

                  <div className="shadow-xl mt-5 ml-2 mr-2 border  rounded-lg">
                    <div className="m-2 font-medium">Xóa tài khoản</div>
                    <hr></hr>
                    <div className="m-4 ">
                      Sau khi tài khoản của bạn bị xóa, bạn sẽ không thể lấy lại
                      dữ liệu của mình. Không thể được hoàn tác thao tác này
                      <br></br>
                      <span className="flex justify-end">
                        {" "}
                        <Button
                          leftSection={<IconTrashFilled size={15} />}
                          variant="filled"
                          color="rgba(255, 0, 0, 1)"
                          size="sm"
                          radius="md"
                          className="mt-2 flex top-px"
                          onClick={handleSignOut}
                        >
                          Xóa tài khoản
                        </Button>
                      </span>
                    </div>
                  </div>
                </Container>
              </Tabs.Panel>
            </Tabs>
          </Tabs.Panel>
        </div>
      </Tabs>

      <LoadingClient visible={isPending} />
      <Toaster richColors />
    </>
  );
};

export default Profile;
