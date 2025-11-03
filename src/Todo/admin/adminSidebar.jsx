
// import AdminDashboard from "./admin-dashboard";
import { auth } from "../firebaseConfig";
import toast from "react-hot-toast";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";


// icons 
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { AiFillDatabase } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";



export default function AdminSidebar() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut(auth);

            navigate("/Signin");
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };
    return (
        <>
            <div className="settings">

                        <h4  >iTask</h4>
                {/* <div className="d-flex justify-content-center">
                    <Link to='/iTask' className="sidebtn fw-bold d-flex justify-content-center p-0 w-25 h-25"   >

                    </Link>
                </div> */}
                <div >
                    <Link to='/admin-dashboard' className="sidebtn fw-bold  py-2 d-flex align-items-center">
                        <MdSpaceDashboard />
                        Dashboard
                    </Link>
                    <Link to='/Admin-Users' className="sidebtn fw-bold py-2  d-flex align-items-center">
                        <FaUsers />
                        All Users
                    </Link>
                    <Link to="/Admin-Todos" className="sidebtn fw-bold  py-2 d-flex align-items-center">
                        <AiFillDatabase />
                        Todos
                    </Link>

                    <button onClick={handleLogout} className="sidebtn py-2 btn fw-bold  d-flex align-items-center">
                        <CiLogout />
                        Logout
                    </button>

                </div>


            </div>
        </>
    )
}
