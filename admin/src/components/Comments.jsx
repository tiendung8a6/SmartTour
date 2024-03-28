import { Modal } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useComments, useDeleteComment } from "../hooks/post-hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import Profile from "../assets/profile.png";
import moment from "moment";
import { MdOutlineDeleteOutline } from "react-icons/md";

import { ConfirmDialog, Loading } from "../components";
const Comments = () => {
  const { openComment, commentId, setOpen } = useCommentStore();
  const { user } = useStore();
  const useDelete = useDeleteComment(user?.token);
  const { mutate, isPending, data } = useComments();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteConfirmation = (commentId) => {
    setCommentToDelete(commentId);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    useDelete.mutate({ id: commentToDelete, postId: commentId });
    setConfirmDelete(false);
  };

  useEffect(() => {
    mutate(commentId);
  }, [commentId, useDelete.isPending]);

  return (
    <>
      <Modal
        opened={openComment}
        onClose={handleClose}
        title={`Comments (${data?.data?.length})`}
        centered
        size="lg"
      >
        <div className="w-full h-full pb-6">
          {data?.data?.length === 0 ? (
            <p className="text-sm text-gray-700">No Comments Found</p>
          ) : (
            <div className="w-full h-full flex flex-col gap-6 px-2">
              {data?.data?.map(({ _id, user, desc, post, createdAt }) => (
                <div key={_id} className="w-full flex gap-4 items-start">
                  <img
                    src={user?.image || Profile}
                    alt={user?.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                  />
                  <div className="w-full">
                    <div className="w-full flex justify-between">
                      <div className="w-full flex flex-col md:flex-row md:items-center gap-2">
                        <p className="text-sm md:text-base text-slate-600 dark:text-gray-400 font-medium">
                          {user?.name}
                        </p>
                        <span className="text-slate-700 dark:text-gray-500 text-xs italic">
                          {moment(createdAt).fromNow()}{" "}
                        </span>
                      </div>
                      <div className="flex gap-1 items-center cursor-pointer">
                        <span
                          className="text-sm text-red-600 cursor-pointer"
                          onClick={() => handleDeleteConfirmation(_id)}
                        >
                          <MdOutlineDeleteOutline />
                        </span>
                        <span
                          className="text-sm text-red-600 cursor-pointer"
                          onClick={() => handleDeleteConfirmation(_id)}
                        >
                          Delete
                        </span>
                      </div>
                    </div>

                    <span className="text-sm text-gray-700 dark:text-slate-500">
                      {desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Loading visible={isPending} />
        </div>
      </Modal>

      {confirmDelete && (
        <ConfirmDialog
          opened={confirmDelete}
          close={() => setConfirmDelete(false)}
          handleClick={handleDelete}
          message="Are you sure you want to perform this action?"
        ></ConfirmDialog>
      )}
    </>
  );
};

export default Comments;
