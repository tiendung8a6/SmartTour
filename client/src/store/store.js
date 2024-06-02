import { create } from "zustand";

const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")),
  isOTPLevel: false,
  otpData: JSON.parse(localStorage.getItem("otp_data")),
  signInModal: false,
  editProfile: false,

  signIn: (data) =>
    set((state) => ({
      user: data,
    })),

  setOTP: (val) => set((state) => ({ isOTPLevel: val })),

  signOut: () => set({ user: {} }),

  setSignInModal: (val) => set((state) => ({ signInModal: val })),

  setEditProfile: (val) => set(() => ({ editProfile: val })),
}));

export default useStore;
