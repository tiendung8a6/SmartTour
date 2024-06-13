import { Button, Modal } from "@mantine/core";

const ConfirmDialog = ({ message, opened, close, handleClick }) => {
  return (
    <Modal opened={opened} onClose={close} title="Xác Nhận Hành Động" centered>
      <p className="text-base">{message}</p>

      <div className="w-full flex gap-4 justify-end mt-8">
        <Button
          className="border bg-gray-50 text-black border-slate-300 hover:bg-gray-200 hover:text-black text-sm"
          onClick={close}
        >
          Hủy
        </Button>
        <Button
          className="text-white bg-black hover:bg-gray-800 hover:text-sky-100 text-sm font-medium"
          onClick={handleClick}
        >
          Xác Nhận
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
