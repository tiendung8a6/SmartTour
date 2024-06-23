import React, { useState } from "react";
import {
  Button,
  Modal,
  TextInput,
  useMantineColorScheme,
  Select,
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
import { useUpdatePost, useCategories } from "../hooks/client-hook";
import useCommentStore from "../store/comments";
import useStore from "../store";
import Loading from "./LoadingClient";
const EditPost = ({ opened, close }) => {
  const { colorScheme } = useMantineColorScheme();

  const { user } = useStore();
  const { post } = useCommentStore();
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [category, setCategory] = useState(post.cat._id);
  const [title, setTitle] = useState(post.title);
  const [file, setFile] = useState("");
  const [fileURL, setFileURL] = useState(null);
  const { data: categoriesData } = useCategories();

  const { isPending, mutate, isSuccess } = useUpdatePost(toast, user?.token);

  const theme = colorScheme === "dark";

  const options = {
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Nhập nội dung...." }),
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
  };

  let editor = useEditor({
    ...options,
    content: post.desc,
  });

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleSubmit = async () => {
    if (!title) {
      toast.error("Vui lòng nhập tiêu đề.");
      return;
    }
    if (!category) {
      toast.error("Vui chọn danh mục.");
      return;
    }
    if (editor.getHTML().trim() === "<p></p>") {
      toast.error("Vui lòng nhập nội dung.");
      return;
    }
    mutate({
      id: post._id,
      title: title,
      cat: category,
      desc: editor.getHTML(),
    });

    if (isSuccess) {
      close();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="90%"
      centered
      // fullScreen // ={isMobile}
      radius={0}
      transitionProps={{ transition: "fade", duration: 200 }}
      title={"Chỉnh Sửa Bài Viết"}
    >
      <div className="p-4">
        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
          <TextInput
            required
            isRequired={true}
            withAsterisk
            value={title}
            onChange={handleTitleChange}
            label="Tiêu Đề"
            className="w-full flex-1"
            placeholder="Title"
          />
          <Select
            withAsterisk
            label="Danh mục"
            placeholder="Chọn danh mục"
            value={category}
            data={
              categoriesData?.data?.map((category) => ({
                value: category._id,
                label: category.label,
              })) || []
            }
            onChange={handleCategoryChange}
          />
        </div>

        <span className="font-medium text-sm">Nội Dung</span>
        <span className="text-rose-500 mr-[10px] ml-1">*</span>

        <RichTextEditor editor={editor}>
          {editor && (
            <BubbleMenu editor={editor}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Link />
              </RichTextEditor.ControlsGroup>
            </BubbleMenu>
          )}
          <RichTextEditor.Toolbar sticky stickyOffset={20}>
            <RichTextEditor.ColorPicker
              colors={[
                "#25262b",
                "#868e96",
                "#fa5252",
                "#e64980",
                "#be4bdb",
                "#7950f2",
                "#4c6ef5",
                "#228be6",
                "#15aabf",
                "#12b886",
                "#40c057",
                "#82c91e",
                "#fab005",
                "#fd7e14",
              ]}
            />
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Control interactive={true}>
                <IconColorPicker size="1rem" stroke={1.5} />
              </RichTextEditor.Control>
              <RichTextEditor.Color color="#F03E3E" />
              <RichTextEditor.Color color="#7048E8" />
              <RichTextEditor.Color color="#1098AD" />
              <RichTextEditor.Color color="#37B24D" />
              <RichTextEditor.Color color="#F59F00" />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.UnsetColor />

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
              <RichTextEditor.CodeBlock />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content value={post.desc} className="py-8" />
        </RichTextEditor>
      </div>

      <div className="w-full flex items-end justify-end mt-6">
        <Button
          className={theme ? "bg-sky-600" : "bg-sky-600"}
          onClick={() => handleSubmit()}
        >
          Cập Nhật
        </Button>
      </div>

      <Loading visible={isPending} />
      <Toaster richColors />
    </Modal>
  );
};

export default EditPost;
