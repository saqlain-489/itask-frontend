import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { signOut, onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebaseConfig";

import { toast } from "react-hot-toast";
// import { db, } from "./firebaseConfig";
import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch } from "react-redux";
import { logout } from "../Todo/store/authslice";
import { fetchWithAuth, removetodos } from "../Todo/store/todoslice";




let lighttheme = "bi bi-moon-fill fs-4 ";
let darktheme = "bi bi-brightness-high-fill fs-4 text-light ";

export default function Theme({ onNewclick, onOldclick, }) {
  // const [themeIcon, setThemeIcon] = useState(lighttheme);

  const [user, setUser] = useState(null);
  const [userData, setuserData] = useState(null);
  const [islight, setislight] = useState(true)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //   });
  //   return () => unsubscribe();
  // }, []);
  //  Fetch user preferences from Firestore
  // useEffect(() => {
  //   fetchUserPreferences(user, setislight);
  // }, [user]);

  useEffect(() => {
    // if (!user) return;

    async function fetchUsers() {
      try {

        // const userRef = doc(db, "todo", user.uid);
        // const docSnap = await getDoc(userRef);
        // const data = docSnap.data();

        const res = await fetchWithAuth("http://localhost:3000/api/users/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },

          }
        )
      
        const data = await res.json();
        if (data.light) {
          document.body.classList.remove("dark");
          setislight(true)
        }
        else {
          setislight(false)
          document.body.classList.add("dark");

        }
        setuserData(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);


  // Logout
  const handleLogout = async () => {
    try {
      dispatch(removetodos());
      dispatch(logout());
      setUser(null);
      navigate("/Signin");
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(error.message);
      console.log(error);

    }
  };


  async function settheme() {

    try {
      const newtheme = !islight;
      setislight(newtheme);

      const res = await fetchWithAuth(`http://localhost:3000/api/users/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            light: newtheme
          })
        }
      )
      const data = await res.json();
      console.log(data)
      document.body.classList.toggle("dark");
      toast.success(newtheme ? 'Light Theme' : "Dark Theme");

    } catch (error) {
      console.error("Error updating view:", error);
      toast.error("Failed to change theme");
    }
  }
  const getResponsiveImage = (url) => {
    if (!url) return null;
    return url.replace(
      "/upload/",
      "/upload/c_fill,q_auto,f_auto,w_auto,dpr_auto/"
    );
  };
  return (
    <>

      <div className="d-flex justify-content-between align-items-center">
        <div className="dropdown">
          <button className="btn btndropsort dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false">
            Sort by
          </button>
          <ul className="dropdown-menu border-0">
            <li><button className="btn btnsort" onClick={onNewclick}>Newest</button></li>
            <li><button className="btn btnsort" onClick={onOldclick}>Oldest</button></li>
          </ul>
        </div>

        <div className="d-flex justify-content-end">
          <button type="button" className="btn btnview m-1 p-1" onClick={settheme} id="themebtn">
            <i className={(islight) ? lighttheme : darktheme}></i>
          </button>
          <div className="dropdown  ">
            <button className="btn btnprofile dropdown-toggle m-1 p-1"
              data-bs-auto-close="outside"

              type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-person-circle fs-4"></i>

            </button>
            <ul className="dropdown-menu border-0 w-100 p-0 ">
              {/* {(loading) ? */}
              <>
                {userData?.profilePic ? (
                  <img
                    src={getResponsiveImage(userData.profilePic)}
                    alt="Profile"
                    style={{
                      width: "clamp(40px, 15vw, 80px)",
                      height: "clamp(40px, 15vw, 80px)",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: 10,
                      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                      margin: "10px 40px "
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "clamp(40px, 15vw, 60px)",
                      height: "clamp(40px, 15vw, 60px)",
                      borderRadius: "50%",
                      backgroundColor: "#e9ecef",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "10px auto 10px",

                      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    <i className="bi bi-person-circle" style={{ fontSize: "4rem", color: "#6c757d" }}></i>
                  </div>
                )}
                <li className="ps-2">
                  <small>Name:</small>
                  <strong className="ms-1">{userData?.name || "User"}</strong>
                </li>
                <li className="ps-2 overflow-hidden">
                  <small>Signed in as:</small>{" "}
                  {/* <br /> */}
                  <strong>{userData?.email}</strong>
                </li></>
              {/* // : (<>
                  //   <Skeleton width={200} height={20} />
                  //   <Skeleton width={250} height={20} />
                  // </>)} */}

              {/* <li><hr className="dropdown-divider" /></li> */}
              <li>
                <button onClick={handleLogout} className="mt-2   sprofilebtn  sprofilebtnfirst">
                  Logout {'   '}
                  <i className="bi bi-box-arrow-right"></i>
                </button>
                <button onClick={() => navigate('/profile')} className="   sprofilebtn ">
                  Edit Profile {'   '}
                  <i className="bi bi-pen"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>


      {/* <div className="d-flex justify-content-end">

        <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
          <i className="bi bi-person-circle"></i>
        </button>
      </div>

      <div className="offcanvas offcanvas-end w-25" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">Profile</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div>
            Email: 
          </div>
          <br />
          <button onClick={handlelogout} data-bs-dismiss="offcanvas" className="   btn btn-secondary">
            Logout {'   '}
            <i className="bi bi-box-arrow-right "></i>
          </button>
        </div>
      </div>



      <button onClick={handlelogout} className="   btn btn-secondary">
        Logout {'   '}
        <i className="bi bi-box-arrow-right "></i>
      </button>
      <form className="sort" onSubmit={handleSubmit}>
        <h4 className="d-inline me-2">Sort by:</h4>

        <input
          type="radio"
          name="sort"
          id="new"
          value="newest"
          checked={order === "newest"}
          onChange={(e) => setOrder(e.target.value)}
        />
        <label htmlFor="new" className="ms-1 me-2">Newest</label>

        <input
          type="radio"
          name="sort"
          id="old"
          value="oldest"
          checked={order === "oldest"}
          onChange={(e) => setOrder(e.target.value)}
        />
        <label htmlFor="old" className="ms-1 me-2">Oldest</label>

        <button type="submit">Apply</button>
      </form> */}
    </>
  );
}
