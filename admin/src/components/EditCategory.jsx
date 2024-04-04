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
import { Link, RichTextEditor } from "@mantine/tiptap";
import { IconColorPicker } from "@tabler/icons-react";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { BubbleMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toaster, toast } from "sonner";
import { useUpdateCategory } from "../hooks/category-hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import Loading from "./Loading";

const EditCategory = ({ opened, close }) => {
  const { colorScheme } = useMantineColorScheme();

  const { user } = useStore();
  const { post } = useCommentStore();
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [selectedColor, setSelectedColor] = useState(post.color); // Thêm state để lưu màu sắc đã chọn

  const [label, setLabel] = useState(post.label);
  const [color, setColor] = useState(post.color);
  const { isPending, mutate, isSuccess } = useUpdateCategory(
    toast,
    user?.token
  );

  const theme = colorScheme === "dark";

  useEffect(() => {
    // Reset showColor khi Modal mở lại
    if (opened) {
      setSelectedColor(post.color);
    }
  }, [opened]);

  const handleLabelChange = (event) => {
    setLabel(event.target.value);
  };

  const handleSubmit = async () => {
    if (!label) {
      toast.error("Please fill in the label field.");
      return;
    }
    if (!color) {
      toast.error("Please fill in the color field.");
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
      fullScreen // ={isMobile}
      radius={0}
      transitionProps={{ transition: "fade", duration: 200 }}
      title={"Danh Mục"}
    >
      <Fieldset maw={500} mx="auto" className="pt-4 mt-8">
        <p
          className={`${
            theme ? "text-white" : "text-slate-700"
          } w-full flex-col md:flex-row gap-5 mb-5 text-lg pb-1 font-semibold text-center`}
        >
          Chỉnh sửa Danh Mục
        </p>

        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-8">
          <TextInput
            required
            isRequired={true}
            withAsterisk
            value={label}
            onChange={handleLabelChange}
            label="label"
            className="w-full flex-1"
            placeholder="label"
          />
        </div>

        <span className="text-sm font-medium">Màu Nền</span>
        <span className="text-rose-500 mr-[10px] ml-1 ">*</span>

        <div className="w-full flex flex-col md:flex-row flex-wrap gap-1 mb-8 mt-1">
          <ColorPicker
            required
            isRequired={true}
            className="w-full flex-1"
            value={post.color}
          />
        </div>

        <span className="text-sm font-medium justify-start">Màu Chữ</span>
        <span className="text-rose-500 mr-[10px] ml-1">*</span>
        <span className="w-full flex flex-col md:flex-row flex-wrap gap-1 mb-8 mt-1">
          <ColorSwatch
            style={{ cursor: "not-allowed" }}
            color="#FFFFFF"
            editable={false}
          />
        </span>

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
      </Fieldset>

      <Loading visible={isPending} />
      <Toaster richColors />
    </Modal>
  );
};

export default EditCategory;
