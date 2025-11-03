import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDbOq75P9FmI2mVtojwaYEYJnpRY5INqaM",
  authDomain: "todo-list-app-d8b55.firebaseapp.com",
  projectId: "todo-list-app-d8b55",
  storageBucket: "todo-list-app-d8b55.firebasestorage.app",
  messagingSenderId: "172024994671",
  appId: "1:172024994671:web:8f48220a863761869ea69a",
  measurementId: "G-M9DB4DE5KY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app)