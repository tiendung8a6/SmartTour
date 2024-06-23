import {
  Button,
  Select,
  TextInput,
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
import { LoadingClient } from "../components";
import { useCreatePost, useCategories } from "../hooks/client-hook";
import useStore from "../store";
import { createSlug, uploadFile } from "../utils";

const NewPost = () => {
  const { colorScheme } = useMantineColorScheme();

  const { user } = useStore();
  const [visible, { toggle }] = useDisclosure(false);
  const { isPending, mutate } = useCreatePost(toast, user?.token);
  const [category, setCategory] = useState(null);
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
      toast.error("Vui lòng tải ảnh lên.");
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
    <>
      <p
        className={`${
          theme ? "text-white" : "text-slate-700"
        } text-xl pb-1 font-semibold text-center `}
      >
        Đăng Bài Viết Mới
      </p>
      <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
        <TextInput
          withAsterisk
          label="Tiêu đề"
          className="w-full flex-1"
          placeholder="Nhập điêu đề"
          defaultValue={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Select
          withAsterisk
          label="Danh mục"
          placeholder="Chọn danh mục"
          data={categoriesData?.data?.map((category) => category.label) || []}
          onChange={(val) => setCategory(val)}
        />
      </div>

      <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-4">
        <div class="flex items-center justify-center w-full">
          <label
            htmlFor="imgUpload"
            class="flex flex-col items-center justify-center w-60 h-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 relative"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">
                  Nhấn để tải lên
                  <span className="text-rose-500 ml-[5px] mr-[5px]">*</span>
                </span>
                hoặc kéo và thả
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                JPG, PNG, hoặc jpeg (TỐI ĐA. 5MB)
              </p>
            </div>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="imgUpload"
              data-max-size="5120"
              accept=".jpg, .png, .jpeg"
            />
            {fileURL && (
              <img
                src={fileURL || file}
                alt=""
                class="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </label>
        </div>
      </div>

      <span className="font-medium text-sm">Nội dung</span>
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
          className={theme ? "bg-sky-600" : "bg-sky-600"}
          onClick={() => handleSubmit()}
        >
          Đăng bài
        </Button>
      </div>
      <LoadingClient visible={isPending} />
      <Toaster richColors />
    </>
  );
};

export default NewPost;
