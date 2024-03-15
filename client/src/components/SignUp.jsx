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

const SignUpForm = ({ toast }) => {
  const [isSignin, setIsSignin] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const theme = colorScheme === "dark";

  const { mutate, isLoading } = useSignUp(toast, setIsSignin); // Thêm isLoading từ hook useSignUp
  const [strength, setStrength] = useState(0);
  const [file, setFile] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [passValue, setPassValue] = useInputState("");
  const [formLoading, setFormLoading] = useState(false); // Thêm state để theo dõi trạng thái loading của form

  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
    validate: {
      firstName: (value) =>
        value.length < 3 ? "First name is too short" : null,
      lastName: (value) => (value.length < 2 ? "Last name is too short" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values) => {
    if (!isSignin && strength < 90) return;

    setFormLoading(true); // Set trạng thái loading của form là true khi người dùng bấm nút "Submit"

    const res = await mutate({
      ...values,
      password: passValue,
      image: fileURL,
      accountType: "Writer",
    });

    setFormLoading(false); // Set trạng thái loading của form là false khi kết thúc xử lý
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
          label="First Name"
          placeholder="First Name"
          {...form.getInputProps("firstName")}
        />
        <Inputbox
          className="w-full"
          withAsterisk
          label="Last Name"
          isRequired={true}
          placeholder="Last Name"
          {...form.getInputProps("lastName")}
        />
      </div>

      <Inputbox
        withAsterisk
        label="Email Address"
        type="email"
        isRequired={true}
        placeholder="your@email.com"
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
            <span className="mr-[10px]">Picture</span>
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
          disabled={formLoading || isLoading} // Disable nút "Submit" khi form đang loading hoặc khi hook useSignUp đang loading
        >
          {formLoading || isLoading ? "Loading..." : "Submit"}{" "}
          {/* Thay đổi nội dung của nút "Submit" khi form đang loading hoặc khi hook useSignUp đang loading */}
        </Button>
      </Group>
    </form>
  );
};

export default SignUpForm;
