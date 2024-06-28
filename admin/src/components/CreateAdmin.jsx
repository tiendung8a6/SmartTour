import {
  Button,
  TextInput,
  useMantineColorScheme,
  Fieldset,
  Box,
  PasswordInput,
  Modal,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { BiImages } from "react-icons/bi";
import { Toaster, toast } from "sonner";
import { Loading } from "../components";
import { useCreateAdmin } from "../hooks/auth-hook";
import useStore from "../store/store";
import { uploadFile } from "../utils";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

const CreateAdmin = ({ opened, close }) => {
  const form = useForm({
    initialValues: { name: "", email: "", age: 0 },

    // functions will be used to validate values at corresponding key
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      age: (value) =>
        value < 18 ? "You must be at least 18 to register" : null,
    },
  });
  const { colorScheme } = useMantineColorScheme();

  const { user } = useStore();
  const [visible, { toggle }] = useDisclosure(false);

  const { isPending, mutate } = useCreateAdmin(toast, user?.token);

  const [file, setFile] = useState("");
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const [fileURL, setFileURL] = useState(null);

  const theme = colorScheme === "dark";

  useEffect(() => {
    file && uploadFile(setFileURL, file);
  }, [file]);

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !password) {
      toast.error("Vui lòng nhập các trường bắt buộc.");
      return;
    }
    if (!fileURL) {
      toast.error("Vui lòng nhập tải lên hình ảnh.");
      return;
    }

    mutate({
      firstName,
      lastName,
      email,
      image: fileURL,
      password,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="lg"
      centered
      // fullScreen // ={isMobile}
      radius={0}
      transitionProps={{ transition: "fade", duration: 200 }}
      title={"Quản lý người dùng"}
    >
      <Box maw={500} mx="auto" className="pt-5 my-2">
        <p
          className={`${
            theme ? "text-white" : "text-slate-700"
          } w-full flex-col md:flex-row gap-5 mb-5 text-lg pb-1 font-semibold text-center mt-[-10px] `}
        >
          Tạo tài khoản quản trị
        </p>
        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-8">
          <TextInput
            required
            isRequired={true}
            withAsterisk
            label="Tên"
            className="w-full flex-1"
            placeholder="Tên"
            visible={visible}
            onVisibilityChange={toggle}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <TextInput
            required
            isRequired={true}
            withAsterisk
            label="Họ"
            className="w-full flex-1"
            placeholder="Họ"
            visible={visible}
            onVisibilityChange={toggle}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-8">
          <TextInput
            required
            isRequired={true}
            type="email"
            withAsterisk
            label="Email"
            className="w-full flex-1"
            placeholder="Email"
            visible={visible}
            onVisibilityChange={toggle}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-8">
          <PasswordInput
            required
            withAsterisk
            label="Mật khẩu"
            className="w-full flex-1"
            placeholder="Mật Khẩu"
            onChange={(e) => setPassword(e.target.value)}
            visible={visible}
            onVisibilityChange={toggle}
          />
        </div>
        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-8">
          <label
            className="flex items-center gap-1 text-base cursor-pointer"
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
            <span className="font-medium text-sm">Ảnh đại diện</span>
            <span className="text-rose-500 mr-[10px]">*</span>
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
        <div className="w-full flex items-end justify-end mt-6">
          <Button
            className={theme ? "bg-blue-600" : "bg-black"}
            onClick={() => handleSubmit()}
          >
            Tạo tài khoản
          </Button>
        </div>
      </Box>

      <Loading visible={isPending} />
      <Toaster richColors />
    </Modal>
  );
};

export default CreateAdmin;
