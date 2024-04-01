import {
  Button,
  TextInput,
  useMantineColorScheme,
  Fieldset,
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
      toast.error("All fields are required.");
      return;
    }
    if (!fileURL) {
      toast.error("Please upload an image.");
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
      fullScreen // ={isMobile}
      radius={0}
      transitionProps={{ transition: "fade", duration: 200 }}
      title={"Create an admin account"}
    >
      <Fieldset maw={500} mx="auto" className="pt-6 mt-10">
        <p
          className={`${
            theme ? "text-white" : "text-slate-700"
          } w-full flex-col md:flex-row gap-5 mb-5 text-lg pb-1 font-semibold text-center`}
        >
          Create an admin account
        </p>
        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-8">
          <TextInput
            required
            isRequired={true}
            withAsterisk
            label="First Name"
            className="w-full flex-1"
            placeholder="First Name"
            visible={visible}
            onVisibilityChange={toggle}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <TextInput
            required
            isRequired={true}
            withAsterisk
            label="Last Name"
            className="w-full flex-1"
            placeholder="Last Name"
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
            placeholder="your@email.com"
            visible={visible}
            onVisibilityChange={toggle}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-8">
          <PasswordInput
            required
            withAsterisk
            label="Password"
            className="w-full flex-1"
            placeholder="Password"
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
            <span>Avatar</span>
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
            Create Account
          </Button>
        </div>
      </Fieldset>

      <Loading visible={isPending} />
      <Toaster richColors />
    </Modal>
  );
};

export default CreateAdmin;
