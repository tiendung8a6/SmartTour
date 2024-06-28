import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  TextInput,
  Fieldset,
  ColorPicker,
  ColorSwatch,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Toaster, toast } from "sonner";
import { useUpdateCategory } from "../hooks/category-hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import Loading from "./Loading";

const EditCategory = ({ opened, close }) => {
  const { colorScheme } = useMantineColorScheme();
  const { user } = useStore();
  const { post } = useCommentStore();
  const [label, setLabel] = useState(post.label);
  const [color, setColor] = useState(post.color);
  const [selectedColor, setSelectedColor] = useState(post.color); // Lưu màu đã chọn

  const { isPending, mutate, isSuccess } = useUpdateCategory(
    toast,
    user?.token
  );
  const theme = colorScheme === "dark";

  useEffect(() => {
    if (opened) {
      setSelectedColor(post.color);
    }
  }, [opened]);

  const handleLabelChange = (event) => {
    setLabel(event.target.value);
  };

  const handleColorChange = (color) => {
    setColor(color);
    setSelectedColor(color); // Cập nhật màu đã chọn
  };

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
      id: post._id,
      label: label,
      color: color,
    });

    if (isSuccess) {
      close();
    }
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
      <Fieldset maw={500} mx="auto" className="pt-4 mt-8">
        <p
          className={`${
            theme ? "text-white" : "text-slate-700"
          } w-full flex-col md:flex-row gap-5 mb-5 text-lg pb-1 font-semibold text-center`}
        >
          Chỉnh Sửa Danh Mục
        </p>

        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-8">
          <TextInput
            required
            isRequired={true}
            value={label}
            onChange={handleLabelChange}
            label="Tên Danh Mục"
            className="w-full flex-1"
            placeholder="Tên Danh Mục"
          />
        </div>

        <span className="text-sm font-medium">Màu Nền</span>
        <span className="text-rose-500 mr-[10px] ml-1 ">*</span>

        <div className="w-full flex flex-col md:flex-row flex-wrap gap-1 mb-8 mt-1">
          <ColorPicker
            required
            isRequired={true}
            className="w-full flex-1"
            value={color} // Sử dụng color thay vì post.color
            onChange={handleColorChange} // Thêm onChange cho ColorPicker
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
            onClick={handleSubmit}
          >
            Cập Nhật
          </Button>
        </div>
      </Fieldset>

      <Loading visible={isPending} />
      <Toaster richColors />
    </Modal>
  );
};

export default EditCategory;
