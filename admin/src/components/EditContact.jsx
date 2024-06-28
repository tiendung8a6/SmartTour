import {
  Button,
  Modal,
  useMantineColorScheme,
  TextInput,
  Textarea,
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
// import { useUpdatePost } from "../hooks/post-hook";
import { useUpdateContact } from "../hooks/contacts_hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import Loading from "./Loading";

const EditContact = ({ opened, close }) => {
  const { colorScheme } = useMantineColorScheme();

  const { user } = useStore();
  const { contact } = useCommentStore();
  const isMobile = useMediaQuery("(max-width: 50em)");

  const { isPending, mutate, isSuccess } = useUpdateContact(toast, user?.token);

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
    content: contact.content,
  });

  const handleSubmit = async () => {
    if (editor.getHTML().trim() === "<p></p>") {
      toast.error("Vui lòng nhập nội dung phản hồi.");
      return;
    }
    mutate({
      id: contact._id,
      content: editor.getHTML(),
    });

    if (isSuccess) {
      close();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="70%"
      centered
      // fullScreen // ={isMobile}
      radius={0}
      transitionProps={{ transition: "fade", duration: 200 }}
      title={"Quản lý liên hệ"}
    >
      <div className="p-4">
        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
          <TextInput
            disabled
            required
            isRequired={true}
            withAsterisk
            value="engmadev2021@gmail.com"
            label="Từ"
            className="w-full flex-1"
            placeholder="Từ"
          />
          <TextInput
            disabled
            required
            isRequired={true}
            withAsterisk
            value={contact.email}
            label="Đến"
            className="w-full flex-1"
            placeholder="Đến"
          />
        </div>

        <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
          <Textarea
            disabled
            required
            isRequired={true}
            withAsterisk
            value={contact.message}
            label="Thông Tin Nhận Được"
            className="w-full flex-1"
            placeholder="Information Received"
            autosize
            minRows={2}
            maxRows={5}
          />
        </div>

        <span className="font-medium text-sm">Nội Dung Phản Hồi</span>
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

          <RichTextEditor.Content value={contact.content} className="py-8" />
        </RichTextEditor>
      </div>

      <div className="w-full flex items-end justify-end mt-6">
        <Button
          className={theme ? "bg-blue-600" : "bg-black"}
          onClick={() => handleSubmit()}
        >
          Gửi Phản Hồi
        </Button>
      </div>

      <Loading visible={isPending} />
      <Toaster richColors />
    </Modal>
  );
};

export default EditContact;
