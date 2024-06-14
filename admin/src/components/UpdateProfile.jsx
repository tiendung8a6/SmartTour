import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import {
  Button,
  Modal,
  TextInput,
  useMantineColorScheme,
  PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import clsx from "clsx";
import { Toaster, toast } from "sonner";
import { useUpdateUser } from "../hooks/auth-hook";
import useStore from "../store/store";
import { uploadFile } from "../utils";
import Loading from "./Loading";

const UpdateProfile = () => {
  const { colorScheme } = useMantineColorScheme();
  const theme = colorScheme === "dark";

  const { user, editProfile, setEditProfile, signIn } = useStore();
  const { data, mutate, isPending, isSuccess } = useUpdateUser(
    toast,
    user?.token
  );

  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState("");
  const [fileURL, setFileURL] = useState(user?.user?.image || ""); // Initialize with current image URL

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
      image: fileURL || user.user.image, // Use current image URL if no new image selected
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

  return (
    <>
      <Modal
        opened={editProfile}
        onClose={() => setEditProfile(false)}
        title="Cập nhật thông tin"
        centered
        size="md"
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col items-center gap-4 px-4 pb-4"
        >
          <div className="relative flex w-25 h-25  justify-center">
            <img
              src={fileURL}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />

            <label
              className={clsx(
                "absolute bottom-0 -right-1 w-6 h-6 shadow-xl rounded-full bg-white text-base cursor-pointer flex items-center justify-center text-gray-600"
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
          {isUploading && (
            <span
              className={clsx(
                theme ? "text-gray-400" : "text-gray-600",
                "text-xs"
              )}
            >
              Đang tải lên, vui lòng đợi...
            </span>
          )}

          <TextInput
            withAsterisk
            className="w-full"
            label="Email"
            placeholder="your@email.com"
            disabled
            readOnly
            {...form.getInputProps("email")}
          />

          <TextInput
            className="w-full"
            withAsterisk
            label="Họ"
            placeholder="Nhận họ"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            className="w-full"
            withAsterisk
            label="Tên"
            placeholder="Nhập tên"
            {...form.getInputProps("lastName")}
          />
          <PasswordInput
            className="w-full"
            // withAsterisk
            label="Mật khẩu cũ"
            placeholder="Nhập mật khẩu cũ"
            // {...form.getInputProps("lastName")}
          />
          <PasswordInput
            className="w-full"
            // withAsterisk
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            // {...form.getInputProps("lastName")}
          />
          <Button
            type="submit"
            className={clsx(theme ? "bg-blue-600" : "bg-black", "w-full mt-2")}
          >
            Cập nhật
          </Button>
        </form>
      </Modal>

      <Loading visible={isPending} />
      <Toaster richColors />
    </>
  );
};

export default UpdateProfile;
