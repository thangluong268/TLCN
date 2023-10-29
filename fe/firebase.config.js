// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDPoyQwFQcBWWSnkKmRjn4Lr8uYp46438k",
  authDomain: "dtexchange-9c535.firebaseapp.com",
  projectId: "dtexchange-9c535",
  storageBucket: "dtexchange-9c535.appspot.com",
  messagingSenderId: "257563657641",
  appId: "1:257563657641:web:f5e11e52583a3060cdb0b8",
  measurementId: "G-6M88PW4WWS",
};

// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
