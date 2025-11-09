// import './todoseacrh.css'
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";



export default function Search({ query, onChange }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    //         setUser(currentUser);
    //     });
    //     return () => unsubscribe();
    // }, []);


 
    async function handlelogout() {
        try {
            await signOut(auth);
            setUser(null);
            toast.success("Logged out successfully!");
            navigate("/Signin");
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

 
    return (
        <form className='search'>

            <div className='searchdiv'>
                <label htmlFor="todosearch"><b>Search:</b> </label>
                <input
                    value={query}
                    onChange={onChange}
                    type="text"
                    id="todosearch"
                    className="form-control"
                    placeholder="By title..." />
            </div>

            <div className=' ms-auto'>
                <Link to="/todoinput">
                    <button type="button" className="btn btnadd btn-primary   ms-auto">
                        Add Tasks
                    </button>
                </Link>
            </div>

         


        </form>
    )
}