import {
  Button,
  Select,
  TextInput,
  Modal,
  Box,
  useMantineColorScheme,
  MultiSelect,
} from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { IconColorPicker, IconBan } from "@tabler/icons-react";
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
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Loading } from "../components";
import {
  useCreateNotificationEmail,
  useUsers,
} from "../hooks/notifications_hook";
import useStore from "../store/store";

const EmailNotifications = ({ opened, close }) => {
  const { colorScheme } = useMantineColorScheme();
  const { user } = useStore();
  const { isPending, mutate } = useCreateNotificationEmail(toast, user?.token);
  const [users, setUsers] = useState([]);
  const { data: usersData } = useUsers();
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

  const handleSubmit = async () => {
    if (users.length === 0) {
      toast.error("Vui lòng chọn người nhận.");
      return;
    }

    if (editor.getHTML().trim() === "<p></p>") {
      toast.error("Vui lòng nhập nội dung.");
      return;
    }

    let usersToSend;
    if (users[0] === "all") {
      usersToSend = "all";
    } else {
      usersToSend = users.map((userId) => ({ _id: userId }));
    }
    mutate({
      users: usersToSend,
      reason: editor.getHTML(),
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="80%"
      centered
      radius={0}
      transitionProps={{ transition: "fade", duration: 200 }}
      title={"Quản lý thông báo"}
    >
      <Box mx="auto" className="pt-6 my-2">
        <p
          className={`${
            theme ? "text-white" : "text-slate-700"
          } text-lg pb-1 font-semibold text-center mt-[-10px]`}
        >
          Thông báo bằng Email
        </p>
        <TextInput
          withAsterisk
          label="Email người gửi"
          placeholder="engma@gmail.com"
          disabled
        />
        <MultiSelect
          withAsterisk
          label="Email người nhận"
          placeholder="Chọn người nhận"
          clearable
          searchable
          data={[
            {
              value: "all",
              label: "Tất cả người dùng",
            },
            ...(usersData?.data?.map((user) => ({
              value: user._id,
              label: user.email,
            })) || []),
          ]}
          onChange={(val) => {
            setUsers(val);
          }}
        />

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

        <div className="flex justify-start items-center text-sm text-gray-500 pt-6">
          <span className="shrink-0 mr-1 text-rose-500 flex items-center">
            <IconBan size="1rem" stroke={2} />
          </span>
          <span className="mr-1 font-medium text-rose-500 flex items-center">
            Lưu ý:
          </span>
          <span className="flex items-center">
            Email chưa xác thực OTP, không bị khóa và admin sẽ không nhận được
            thông báo.
          </span>
        </div>

        <div className="w-full flex items-end justify-end mt-6">
          <Button
            className={theme ? "bg-blue-600" : "bg-black"}
            onClick={() => handleSubmit()}
          >
            Gửi thông báo
          </Button>
        </div>
      </Box>

      <Loading visible={isPending} />
      <Toaster richColors />
    </Modal>
  );
};

export default EmailNotifications;
