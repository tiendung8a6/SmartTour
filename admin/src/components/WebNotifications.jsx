import {
  Button,
  TextInput,
  Modal,
  Box,
  useMantineColorScheme,
  MultiSelect,
  Textarea,
} from "@mantine/core";
import { IconBan } from "@tabler/icons-react";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Loading } from "../components";
import {
  useCreateNotificationWeb,
  useUsers,
} from "../hooks/notifications_hook";
import useStore from "../store/store";

const WebNotifications = ({ opened, close }) => {
  const { colorScheme } = useMantineColorScheme();
  const { user } = useStore();
  const { isPending, mutate } = useCreateNotificationWeb(toast, user?.token);
  const [users, setUsers] = useState([]);
  const { data: usersData } = useUsers();
  const [reason, setReason] = useState(null);

  const theme = colorScheme === "dark";

  const handleSubmit = async () => {
    if (users.length === 0) {
      toast.error("Vui lòng chọn người nhận.");
      return;
    }

    if (!reason) {
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
      reason,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="70%"
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
          Thông báo bằng Hệ thống
        </p>
        <TextInput
          withAsterisk
          label="Người gửi"
          placeholder="Quản trị viên"
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
        <Textarea
          withAsterisk
          label="Nội dung"
          placeholder="Nhập nội dung"
          autosize
          minRows={6}
          maxRows={8}
          onChange={(e) => setReason(e.target.value)}
        />

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

export default WebNotifications;
