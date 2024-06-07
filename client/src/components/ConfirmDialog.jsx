import { Button, Modal } from "@mantine/core";

const ConfirmDialog = ({ message, opened, close, handleClick }) => {
  return (
    <Modal opened={opened} onClose={close} title="Xác Nhận Hành Động" centered>
      <p className="text-base">{message}</p>
      <div className="w-full flex gap-4 justify-end mt-8">
        <Button
          className=" bg-white text-slate-600 hover:bg-gray-100 hover:text-black border border-slate-300 text-sm"
          onClick={close}
        >
          Hủy
        </Button>
        <Button
          className="bg-sky-600 text-white hover:bg-sky-500 text-sm font-medium"
          onClick={handleClick}
        >
          Xác Nhận
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
