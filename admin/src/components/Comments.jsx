import { Modal } from "@mantine/core";
import React, { useEffect } from "react";
import { useComments, useDeleteComment } from "../hooks/post-hook";
import useCommentStore from "../store/comments";
import useStore from "../store/store";
import Profile from "../assets/profile.png";

const Comments = () => {
  const { openComment, commentId, setOpen } = useCommentStore();
  const { user } = useStore();
  const useDelete = useDeleteComment(user?.token);
  const { mutate, data } = useComments();

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    useDelete.mutate({ id, postId: commentId });
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
        size='lg'
      >
        <div className='w-full h-full pb-6'>
          {data?.data?.length === 0 ? (
            <p className='text-sm text-gray-700'>No Comments Found</p>
          ) : (
            <div className='w-full h-full flex flex-col gap-6 px-2'>
              {data?.data?.map(({ _id, user, desc, post, createdAt }) => (
                <div key={_id} className='w-full flex gap-4 items-start'>
                  <img
                    src={user?.image || Profile}
                    alt={user?.name}
                    className='w-8 h-8 md:w-10 md:h-10 rounded-full object-cover'
                  />
                  <div className='w-full'>
                    <div className='w-full flex justify-between'>
                      <div className='w-full flex flex-col md:flex-row md:items-center gap-2'>
                        <p className='text-sm md:text-base text-slate-600 dark:text-gray-400 font-medium'>
                          {user?.name}
                        </p>
                        <span className='text-slate-700 dark:text-gray-500 text-xs italic'>
                          {new Date(createdAt).toDateString()}
                        </span>
                      </div>
                      <span
                        className='text-sm text-red-600 cursor-pointer'
                        onClick={() => handleDelete(_id)}
                      >
                        Delete
                      </span>
                    </div>

                    <span className='text-sm text-gray-700 dark:text-slate-500'>
                      {desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Comments;
