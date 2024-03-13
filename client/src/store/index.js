import { create } from "zustand";

const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("userInfo")),

  id: null,
  isLoading: false,
  theme: localStorage.getItem("theme") ?? "light",

  signIn: (data) =>
    set((state) => ({
      user: data,
    })),

  setTheme: (value) => set({ theme: value }),

  signOut: () => set({ user: {} }),

  setIsLoading: (val) => set((state) => ({ isLoading: val })),
  setPostId: (val) => set((state) => ({ id: val })),
}));

export default useStore;
