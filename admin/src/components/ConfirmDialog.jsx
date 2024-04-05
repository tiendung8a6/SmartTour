import { Button, Modal } from "@mantine/core";

const ConfirmDialog = ({ message, opened, close, handleClick }) => {
  return (
    <Modal opened={opened} onClose={close} title="Xác Nhận Hành Động" centered>
      <p className="text-base">{message}</p>

      <div className="w-full flex gap-6 justify-end mt-8">
        <Button
          className="bg-red-600 text-red-600 bg-opacity-25 text-sm font-medium"
          onClick={handleClick}
        >
          Xác Nhận
        </Button>
        <Button
          className="border border-slate-300 text-slate-600 text-sm"
          onClick={close}
        >
          Hủy
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
