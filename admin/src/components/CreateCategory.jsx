import {
  Button,
  TextInput,
  useMantineColorScheme,
  Box,
  Modal,
  ColorPicker,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Loading } from "../components";
import { useCreateCategory } from "../hooks/category-hook";
import useStore from "../store/store";
import { useDisclosure } from "@mantine/hooks";

const CreateCategory = ({ opened, close }) => {
  const { colorScheme } = useMantineColorScheme();
  const { user } = useStore();
  const { isPending, mutate } = useCreateCategory(toast, user?.token);

  const [label, setLabel] = useState(null);
  const [color, setColor] = useState(null);

  const [selectedColor, setSelectedColor] = useState(null); // Thêm state để lưu màu sắc đã chọn

  const theme = colorScheme === "dark";

  useEffect(() => {
    // Reset showColor khi Modal mở lại
    if (opened) {
      setSelectedColor(false);
    }
  }, [opened]);

  const handleSubmit = async () => {
    if (!label) {
      toast.error("Vui lòng nhập Tên danh mục.");
      return;
    }
    if (!color) {
      toast.error("Vui lòng chọn màu sắc.");
      return;
    }

    mutate({
      color,
      label,
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
      title={"Quản lý danh mục"}
    >
      <Box maw={500} mx="auto" className="pt-6 my-2">
        <p
          className={`${
            theme ? "text-white" : "text-slate-700"
          } w-full flex-col md:flex-row gap-5 mb-5 text-lg pb-1 font-semibold text-center mt-[-10px]`}
        >
          Tạo Danh Mục
        </p>

        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-8">
          <TextInput
            required
            isRequired={true}
            withAsterisk
            label="Tên Danh Mục"
            className="w-full flex-1"
            placeholder="Tên danh mục"
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <span className="text-sm font-medium">Màu Nền</span>
        <span className="text-rose-500 mr-[10px] ml-1 ">*</span>

        <div className="w-full flex flex-col md:flex-row flex-wrap gap-1 mb-8 mt-1">
          <ColorPicker
            required
            isRequired={true}
            className="w-full flex-1"
            onChange={(color) => {
              setColor(color);
              setSelectedColor(color); // Lưu màu sắc đã chọn vào state
            }}
          />
        </div>

        {/* Hiển thị màu sắc đã chọn */}
        {selectedColor && (
          <div className="w-full flex flex-col md:flex-row flex-wrap gap-1 mb-8 mt-1 justify-center items-center">
            <p className="text-sm font-medium">Kết quả hiển thị:</p>
            <span
              className="w-fit rounded-full px-2 py-0.5 text-white text-[12px] 2xl:text-sm"
              style={{ backgroundColor: selectedColor }}
            >
              {label}
            </span>
          </div>
        )}

        <div className="w-full flex items-end justify-end mt-6">
          <Button
            className={theme ? "bg-blue-600" : "bg-black"}
            onClick={() => handleSubmit()}
          >
            Tạo Danh Mục
          </Button>
        </div>
      </Box>

      <Loading visible={isPending} />
      <Toaster richColors />
    </Modal>
  );
};

export default CreateCategory;
