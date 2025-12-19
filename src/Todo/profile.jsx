import Sidepanel from "./sidepanel";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchUserPreferences } from "./fetchUserPreferences";
import { useDispatch } from "react-redux";
import { logout } from "../Todo/store/authslice";
import { removetodos } from "../Todo/store/todoslice";
import { fetchWithAuth } from "../Todo/store/todoslice";


export default function Profile() {
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isEdit, setIsediting] = useState(false);
    const [editName, seteditName] = useState('');
    const [isLight, setislight] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserPreferences(user, setislight);
    }, [user]);
    // Track authentication
    let data;
    useEffect(() => {
        async function getuser() {

            try {
                const res = await fetchWithAuth(`${import.meta.env.APP_API_URL}/api/users/me`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                data = await res.json();
                setUserData(data)
                if (!res.ok) return () => { console.log('jhgh') }

            }
            catch (err) {
                console.error("Error fetching user data:", err);
                toast.error("Failed to load user data");
            } finally {
                setLoading(false);
            }
        }
        getuser();
    }, []);
    // Fetch user data from Firestore
    // const fetchUserData = async (uid) => {
    //     try {
    //         setLoading(true);
    //         const docRef = doc(db, "todo", uid);
    //         const docSnap = await getDoc(docRef);
    //         if (docSnap.exists()) {
    //             const data = docSnap.data();
    //             setUserData(data);
    //             // Initialize editName with the name from Firestore
    //             if (data.name) {
    //                 seteditName(data.name);
    //             }
    //         } else {
    //             console.warn("No user data found for:", uid);
    //             setUserData({}); // Initialize empty object if no data exists
    //         }
    //     } catch (err) {
    //         console.error("Error fetching user data:", err);
    //         toast.error("Failed to load user data");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // Upload profile picture to Cloudinary

    const uploadProfilePicture = async () => {
        if (!file) return toast.error("No file selected");

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "unsigned_preset");


            const res = await fetch(
                `https://api.cloudinary.com/v1_1/dhldjoqou/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            if (!data.secure_url) throw new Error("Upload failed");

            const imageUrl = data.secure_url;


            const res2 = await fetchWithAuth(`${process.env.APP_API_URL}/api/users/me`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        profilePic: imageUrl
                    })
                }
            )
            const data2 = await res2.json();
            console.log(data2)
            setUserData((prev) => ({ ...prev, profilePic: imageUrl }));
            setFile(null);
            toast.success("Profile picture updated!");
        } catch (err) {
            console.error("Error uploading to Cloudinary:", err);
            toast.error("Error uploading image: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    // Logout
    const handleLogout = async () => {
        try {

            dispatch(removetodos());
            dispatch(logout());
            setUser(null);
            setUserData(null);

            navigate("/Signin");
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Cloudinary responsive transformation helper
    const getResponsiveImage = (url) => {
        if (!url) return null;
        return url.replace(
            "/upload/",
            "/upload/c_fill,q_auto,f_auto,w_auto,dpr_auto/"
        );
    };

    // Change name function
    async function changename() {
        if (!editName.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        try {
            setIsediting(false);

            const res2 = await fetchWithAuth(`${process.env.APP_API_URL}/api/users/me`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: editName
                    })
                }
            )
            const data2 = await res2.json();

            setUserData((prev) => ({ ...prev, name: editName }));

            toast.success("Name updated successfully!");
        } catch (error) {
            console.error("Error updating name:", error);
            toast.error("Failed to update name.");
        }
    }

    // Show loading state
    if (loading) {
        return (
            <div className="profilepage">
                <div className="sidepanel">
                    <Sidepanel />
                </div>

                <div className="profilecontainer mt-3 text-center">
                    <Skeleton width={'100px'} height={'30px'} />
                    <Skeleton className="mt-3" style={{
                        width: "clamp(100px, 20vw, 180px)",
                        height: "clamp(100px, 20vw, 180px)",
                        borderRadius: "50%",
                        backgroundColor: "#e9ecef",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                    }} />
                    <div className="d-flex gap-2 justify-content-center">
                        <Skeleton width={130} height={35} />
                        <Skeleton width={80} height={35} />
                    </div>
                    <Skeleton width={161} height={24} className="mt-3" />
                    <Skeleton width={128} height={24} />
                    <Skeleton width={80} height={35} className="mt-3" />
                </div>
            </div>
        );
    }
    const token = localStorage.getItem('accesstoken')
    if (!token) {
        return (
            <div
                className="d-flex justify-content-center align-items-center text-black p-2 text-center"
                style={{ height: "100vh", background: "aliceblue" }}
            >
                <h2>
                    <Link to="/Signin" style={{ textDecoration: "none" }}>
                        Sign in?{" "}
                    </Link>
                    &nbsp;to access your itTask panel!
                </h2>
            </div>
        );
    }

    return (
        <div className="profilepage">
            <div className="sidepanel">
                <Sidepanel />
            </div>
            <div className="goback">
                <Link to='/todo'><h3><i className="bi bi-box-arrow-left"></i> Go back</h3></Link>
            </div>
            <div className="profilecontainer mt-3 text-center">
                <div className="profilecontent">
                    <h2 className="fw-bold">Profile</h2>

                    {userData?.profilePic ? (
                        <img
                            src={getResponsiveImage(userData.profilePic)}
                            alt="Profile"
                            style={{
                                width: "clamp(100px, 20vw, 180px)",
                                height: "clamp(100px, 20vw, 180px)",
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginBottom: 10,
                                boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "clamp(100px, 20vw, 180px)",
                                height: "clamp(100px, 20vw, 180px)",
                                borderRadius: "50%",
                                backgroundColor: "#e9ecef",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 10px",
                                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                            }}
                        >
                            <i className="bi bi-person-circle" style={{ fontSize: "5rem", color: "#6c757d" }}></i>
                        </div>
                    )}

                    <div className="mt-3">
                        <label className="btn btn-primary" style={{ cursor: "pointer" }}>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            Choose Picture
                        </label>

                        <button
                            onClick={uploadProfilePicture}
                            className="btn btn-success ms-2"
                            disabled={!file || uploading}
                        >
                            {uploading ? "Uploading..." : "Update pfp"}
                        </button>
                    </div>

                    {file && (
                        <p className="mt-2 text-muted">
                            Selected: {file.name}
                        </p>
                    )}

                    <div className="d-flex flex-column justify-content-start align-items-center">
                        <div className="mt-3">
                            <h5 className="d-inline">Name: </h5>
                            {isEdit ? (
                                <input
                                    style={{ width: "200px", padding: '5px', borderRadius: '5px' }}
                                    className="border-dark"
                                    value={editName}
                                    onChange={(e) => seteditName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            ) : (
                                <h5 className="d-inline">
                                    {userData?.name || "No name set"}
                                </h5>
                            )}
                        </div>
                        <h5>Email: {userData?.email}</h5>
                    </div>



                    {isEdit ? (
                        <button className="btn btn-primary mt-3 me-1" onClick={changename}>
                            Save Name <i className="bi bi-check-lg"></i>
                        </button>
                    ) : (
                        <button className="btn btn-primary mt-3 me-1" onClick={() => { setIsediting(true); seteditName(userData?.name) }}>
                            Edit Name <i className="bi bi-pencil"></i>
                        </button>
                    )}
                    <button onClick={handleLogout} className="btn btn-danger mt-3 ms-1">
                        Logout <i className="bi bi-box-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}