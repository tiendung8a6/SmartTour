import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Button, Modal, TextInput, useMantineColorScheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import clsx from "clsx";
import { Toaster, toast } from "sonner";
import { useUpdateUser } from "../hooks/client-hook";
import useStore from "../store";
import { uploadFile } from "../utils";
import { LoadingClient } from "../components";

const Profile = () => {
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

  const name = user?.user.name.split(" ");
  const form = useForm({
    initialValues: {
      email: user?.user.email,
      firstName: name[0],
      lastName: name[1],
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
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="flex flex-col items-center gap-5 px-5 pb-5"
      >
        <div className="relative flex w-20 h-20  justify-center">
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
            Uploading, please wait...
          </span>
        )}

        <TextInput
          withAsterisk
          className="w-full"
          label="Email Address"
          placeholder="your@email.com"
          disabled
          readOnly
          {...form.getInputProps("email")}
        />

        <TextInput
          className="w-full"
          withAsterisk
          label="First Name"
          placeholder="First Name"
          {...form.getInputProps("firstName")}
        />
        <TextInput
          className="w-full"
          withAsterisk
          label="Last Name"
          placeholder="Last Name"
          {...form.getInputProps("lastName")}
        />

        <Button
          type="submit"
          className={clsx(theme ? "bg-blue-600" : "bg-black", "w-full mt-2")}
        >
          Update
        </Button>
      </form>

      <LoadingClient visible={isPending} />
      <Toaster richColors />
    </>
  );
};

export default Profile;
