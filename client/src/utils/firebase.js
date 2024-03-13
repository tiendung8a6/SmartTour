import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "smarttour-mern-7a80c.firebaseapp.com",
  projectId: "smarttour-mern",
  storageBucket: "smarttour-mern.appspot.com",
  messagingSenderId: "1030202085019",
  appId: "1:1030202085019:web:f469d26c927020f682c03e",
};

export const app = initializeApp(firebaseConfig);
