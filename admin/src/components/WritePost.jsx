import {
  Button,
  Select,
  TextInput,
  Modal,
  Box,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
import { useEffect, useState } from "react";
import { BiImages } from "react-icons/bi";
import { Toaster, toast } from "sonner";
import { Loading } from "../components";
import { useCreatePost, useCategories } from "../hooks/post-hook";
import useStore from "../store/store";
import { createSlug, uploadFile } from "../utils";

const WritePost = ({ opened, close }) => {
  const { colorScheme } = useMantineColorScheme();

  const { user } = useStore();
  const [visible, { toggle }] = useDisclosure(false);
  const { isPending, mutate } = useCreatePost(toast, user?.token);
  const [category, setCategory] = useState("");
  const [file, setFile] = useState("");
  const [title, setTitle] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const { data: categoriesData } = useCategories();

  const theme = colorScheme === "dark";
  let editor = useEditor({
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
    content: "",
  });

  useEffect(() => {
    file && uploadFile(setFileURL, file);
  }, [file]);

  const handleSubmit = async () => {
    if (!title) {
      toast.error("Vui lòng nhập tiêu đề.");
      return;
    }
    if (!category) {
      toast.error("Vui lòng chọn danh mục.");
      return;
    }
    if (!fileURL) {
      toast.error("Vui lòng tải lên hình ảnh.");
      return;
    }
    if (editor.getHTML().trim() === "<p></p>") {
      toast.error("Vui lòng nhập nội dung.");
      return;
    }
    const slug = createSlug(title);

    mutate({
      title,
      slug,
      cat: category,
      img: fileURL,
      desc: editor.getHTML(),
    });
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
      title={"Quản lý bài viết"}
    >
      <Box mx="auto" className="pt-6 my-2">
        <p
          className={`${
            theme ? "text-white" : "text-slate-700"
          } text-lg pb-1 font-semibold text-center mt-[-10px]`}
        >
          Tạo bài viết mới
        </p>
        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5 ">
          <TextInput
            withAsterisk
            label="Tiêu Đề"
            className="w-full flex-1"
            placeholder="Nhập tiêu đề"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            withAsterisk
            label="Danh Mục"
            defaultValue={""}
            placeholder="Chọn danh mục"
            data={categoriesData?.data?.map((category) => category.label) || []}
            onChange={(val) => setCategory(val)}
          />
        </div>
        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-4">
          <label
            className="flex items-center gap-1 text-sm font-medium cursor-pointer"
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
            <span>Ảnh Bài Viết</span>
            <span className="text-rose-500 mr-[10px]">*</span>
            <div>
              {fileURL && (
                <img src={fileURL || file} alt="" className="w-20 h-20" />
              )}
            </div>
          </label>
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

          <RichTextEditor.Content className="py-8" />
        </RichTextEditor>

        <div className="w-full flex items-end justify-end mt-6">
          <Button
            className={theme ? "bg-blue-600" : "bg-black"}
            onClick={() => handleSubmit()}
          >
            Đăng Bài
          </Button>
        </div>
      </Box>

      <Loading visible={isPending} />
      <Toaster richColors />
    </Modal>
  );
};

export default WritePost;
