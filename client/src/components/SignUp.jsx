import React, { useEffect, useState } from "react";
import { BiImages } from "react-icons/bi";
import { Button, Group, TextInput, useMantineColorScheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useInputState } from "@mantine/hooks";
import { clsx } from "clsx";
import { useSignUp } from "../hooks/auth-hook";
import { uploadFile } from "../utils";
import { PasswordStrength } from "./PasswordInput";
import { Inputbox } from "../components";
import useStore from "../store";

const SignUpForm = ({ toast }) => {
  const [isSignin, setIsSignin] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const theme = colorScheme === "dark";

  const { mutate } = useSignUp(toast, setIsSignin);
  const [strength, setStrength] = useState(0);
  const [file, setFile] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [passValue, setPassValue] = useInputState("");
  const { setIsLoading } = useStore();

  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      if (!isSignin && strength < 90) return;

      const res = await mutate({
        ...values,
        password: passValue,
        image: fileURL,
        accountType: "Writer",
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    file && uploadFile(setFileURL, file);
  }, [file]);

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      className="max-w-md w-full mt-8 space-y-6"
    >
      <div className="w-full flex gap-2 ">
        <Inputbox
          className="w-full"
          withAsterisk
          isRequired={true}
          label="Họ"
          placeholder="Họ"
          {...form.getInputProps("firstName")}
        />
        <Inputbox
          className="w-full"
          withAsterisk
          label="Tên"
          isRequired={true}
          placeholder="Tên"
          {...form.getInputProps("lastName")}
        />
      </div>

      <Inputbox
        withAsterisk
        label="Email"
        type="email"
        isRequired={true}
        placeholder="Email"
        {...form.getInputProps("email")}
      />

      <PasswordStrength
        value={passValue}
        setValue={setPassValue}
        setStrength={setStrength}
        isSignin={false}
      />

      <Group className={`w-full flex  justify-between py-3`} mt="md">
        <div className={`flex flex-col items-center justify-between`}>
          <label
            className={clsx(
              "flex items-center gap-1 text-base cursor-pointer",
              theme ? "text-gray-500" : "text-slate-700"
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
            <BiImages />
            <span className="mr-[10px]">Ảnh đại diện</span>
            <div>
              {fileURL && (
                <img
                  src={fileURL || file}
                  alt=""
                  className="w-16 h-16 rounded-full"
                />
              )}
            </div>
          </label>
        </div>

        <Button
          type="submit"
          className={clsx(theme ? "bg-black	" : "bg-sky-500	")}
        >
          Đăng kí
        </Button>
      </Group>
    </form>
  );
};

export default SignUpForm;
