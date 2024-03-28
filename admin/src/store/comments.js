import { create } from "zustand";

const useCommentStore = create((set) => ({
  openComment: false,
  commentId: null,
  post: null,
  policy: null,
  contact: null,

  setOpen: (val) =>
    set((state) => ({
      openComment: val,
    })),

  setCommentId: (val) => set((state) => ({ commentId: val })),
  setPost: (val) => set((state) => ({ post: val })),
  setPolicy: (val) => set((state) => ({ policy: val })),
  setContact: (val) => set((state) => ({ contact: val })),
}));

export default useCommentStore;