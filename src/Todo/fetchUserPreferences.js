// src/utils/fetchUserPreferences.js
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
 import { db } from "./firebaseConfig";

/**
 * Fetches user's theme preference from Firestore
 * and applies it to <body>.
 * 
 * @param {object} user - Current logged-in Firebase user
 * @param {function} setIsLight - React state setter for theme (true = light, false = dark)
 */
export async function fetchUserPreferences(user, setIsLight) {
  if (!user) return;

  try {
    const userDoc = doc(db, "todo", user.uid);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const lightTheme = data.light ?? true; // default to light theme if undefined

      setIsLight(lightTheme);

      // Apply theme to document body
      document.body.classList.toggle("dark", !lightTheme);
    }
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    toast.error("Failed to load preferences");
  }
}
