import { Button, Group, TextInput, useMantineColorScheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useInputState } from "@mantine/hooks";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignin } from "../hooks/auth-hook";
import useStore from "../store/store";
import { PasswordStrength } from "./PasswordInput";
import clsx from "clsx";

const LoginForm = ({ toast, isSignin, setIsSignin, setFormClose, toggle }) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = colorScheme === "dark";

  const { signIn } = useStore();
  const { data, isSuccess, mutate } = useSignin(toast, toggle);
  const [strength, setStrength] = useState(0);
  const [passValue, setPassValue] = useInputState("");
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values) => {
    setFormClose(true);

    mutate({
      ...values,
      password: passValue,
    });

    if (isSuccess) {
      setFormClose(false);
      setTimeout(() => {
        signIn(data);
        navigate("/dashboard");
      }, 1000);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      className="flex flex-col gap-4"
    >
      <TextInput
        required
        type="email"
        withAsterisk
        label="Email"
        placeholder="Email"
        {...form.getInputProps("email")}
      />

      <PasswordStrength
        value={passValue}
        setValue={setPassValue}
        setStrength={setStrength}
        isSignin={true}
      />

      <Group
        className={clsx(
          "w-full flex",
          isSignin ? "justify-end" : " justify-between"
        )}
        mt="md"
      >
        <Button
          type="submit"
          className={clsx(theme ? "bg-blue-600" : "bg-black")}
        >
          Đăng nhập
        </Button>
      </Group>
      {/* <p className='text-sm'>
        {isSignin ? "Don't have an account?" : "Already has an account?"}
        <span
          className='underline text-blue-600 ml-1 cursor-pointer'
          onClick={() => setIsSignin((prev) => !prev)}
        >
          {isSignin ? "Sign up" : "Sign in"}
        </span>
      </p> */}
    </form>
  );
};

export default LoginForm;
