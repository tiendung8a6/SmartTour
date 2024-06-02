import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "sonner";
import { app } from "./firebase";

export const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export const createSlug = (str) =>
  str
    ?.toLowerCase()
    ?.trim()
    ?.replace(/[^\w\s-]/g, "")
    ?.replace(/[\s_-]+/g, "-")
    ?.replace(/^-+|-+$/g, "");

export const uploadFile = (setFileURL, file) => {
  const storage = getStorage(app);

  const name = new Date().getTime() + file.name;
  const storageRef = ref(storage, name);

  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      toast.success("Đang tải lên " + progress + "%");

      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {},
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFileURL(downloadURL);
      });
    }
  );
};

export const updateURL = ({ page, navigate, location, cat }) => {
  const params = new URLSearchParams();

  if (cat) {
    params.set("cat", cat);
  }

  if (page && page > 1) {
    params.set("page", page);
  }

  const newURL = `${location.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });

  return newURL;
};

export const saveUserInfo = (user, signIn) => {
  localStorage.setItem(
    "userInfo",
    JSON.stringify({ user: user?.user, token: user.token })
  );

  signIn({ user: user?.user, token: user.token });

  toast.success(user?.message);

  setTimeout(() => {
    window.history.back();
  }, 1500);
};

export function getInitials(fullName) {
  const names = fullName.split(" ");

  const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());

  const initialsStr = initials.join("");

  return initialsStr;
}
