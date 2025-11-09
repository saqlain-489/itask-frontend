import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Sidepanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Listen to auth state changes
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  // Fetch user preferences from Firestore
  // useEffect(() => {
  //   async function fetchUserPreferences() {
  //     if (!user) return;

  //     try {
  //       const userDoc = doc(db, "todo", user.uid);
  //       const docSnap = await getDoc(userDoc);

  //       if (docSnap.exists()) {
  //         const data = docSnap.data();
  //         const lightTheme = data.light ?? true;
  //         // const listView = data.view ?? true;

  //         setIsLightTheme(lightTheme);
  //         // setIsListView(listView);

  //         // Apply theme to body
  //         if (lightTheme) {
  //           document.body.classList.remove("dark");
  //         } else {
  //           document.body.classList.add("dark");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user preferences:", error);
  //       toast.error("Failed to load preferences");
  //     }
  //   }

  //   fetchUserPreferences();
  // }, [user]);

  // async function handlelogout() {
  //   try {
  //     await signOut(auth);
  //     toast.success("Logged out successfully!");
  //     navigate('/Signin');
  //   } catch (error) {
  //     toast.error(error.message);
  //     console.log(error);
  //   }
  // }

  // Light theme function
  // async function lightTheme() {
  //   if (!user) return;

  //   try {
  //     const userDoc = doc(db, "todo", user.uid);
  //     const docSnap = await getDoc(userDoc);

  //     if (docSnap.exists()) {
  //       const currentLight = docSnap.data().light ?? true;

  //       if (!currentLight) {
  //         // If currently false (dark mode), change to true (light mode)
  //         await updateDoc(userDoc, { light: true });
  //         setIsLightTheme(true);
  //         document.body.classList.remove("dark");
  //         toast.success("Switched to light theme");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error updating theme:", error);
  //     toast.error("Failed to update theme");
  //   }
  // }

  // Dark theme function
  // async function darkTheme() {
  //   if (!user) return;

  //   try {
  //     const userDoc = doc(db, "todo", user.uid);
  //     const docSnap = await getDoc(userDoc);

  //     if (docSnap.exists()) {
  //       const currentLight = docSnap.data().light ?? true;

  //       if (currentLight) {
  //         // If currently true (light mode), change to false (dark mode)
  //         await updateDoc(userDoc, { light: false });
  //         setIsLightTheme(false);
  //         document.body.classList.add("dark");
  //         toast.success("Switched to dark theme");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error updating theme:", error);
  //     toast.error("Failed to update theme");
  //   }
  // }



  // Show loading state
  // if (loading) {
  //   return (
  //     <div className="settings">
  //       <h4>iTasks</h4>
  //       <div>Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="settings">
        <h4>iTask</h4>

        <div >
          <Link to='/Todos' className="sidebtn fw-bold d-flex align-items-center">
            <i className="bi bi-card-checklist fs-4"></i>
            Todos
          </Link>
          <Link to='/profile' className="sidebtn fw-bold d-flex align-items-center">
            <i className="bi bi-person-circle fs-4"></i>
            Profile
          </Link>
        </div>

        {/* Profile Dropdown */}
        {/* <div className="dropdown">
          <button className="btn btndrop dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Profile
          </button>
          <ul className="dropdown-menu border-0 w-100">
            <li className="ps-2">
              <small>Name:</small>
              <br />
              <strong>{user?.displayName || "User"}</strong>
            </li>
            <li className="ps-2">
              <small>Signed in as:</small>
              <br />
              <strong>{user?.email}</strong>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button onClick={handlelogout} className="w-100 btn btnlogout btn-primary">
                Logout {'   '}
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </li>
          </ul>
        </div> */}

        {/* Sort by Dropdown */}
        {/* <div className="dropdown">
          <button className="btn btndrop dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false">
            Sort by
          </button>
          <ul className="dropdown-menu border-0 w-100">
            <li><button className="btn btnsort" onClick={onNewclick}>Newest</button></li>
            <li><button className="btn btnsort" onClick={onOldclick}>Oldest</button></li>
          </ul>
        </div> */}

        {/* Theme Dropdown */}
        {/* <div className="dropdown">
          <button className="btn btndrop dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Theme  
          </button>
          <ul className="dropdown-menu">
            <li>
              <button 
                className="btn btnsort" 
                onClick={lightTheme}
                disabled={isLightTheme}
              >
                Light mode {isLightTheme && "✓"}
              </button>
            </li>
            <li>
              <button 
                className="btn btnsort" 
                onClick={darkTheme}
                disabled={!isLightTheme}
              >
                Dark mode {!isLightTheme && "✓"}
              </button>
            </li>
          </ul>
        </div> */}

        {/* View Dropdown */}
        {/* <div className="dropdown">
          <button className="btn btndrop dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            View
          </button>
          <ul className="dropdown-menu">
            <li>
              <button 
                className="btn btnsort" 
                onClick={handleListView}
                disabled={isListView}
              >
                List {isListView && "✓"}
              </button>
            </li>
            <li>
              <button 
                className="btn btnsort" 
                onClick={handleCardView}
                disabled={!isListView}
              >
                Card {!isListView && "✓"}
              </button>
            </li>
          </ul>
        </div> */}
      </div>
    </>
  );
}