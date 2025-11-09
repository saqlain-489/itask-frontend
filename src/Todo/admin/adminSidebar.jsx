
// import AdminDashboard from "./admin-dashboard";
import { auth } from "../firebaseConfig";
import toast from "react-hot-toast";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { logout } from "../Todo/store/authslice";
import { logout } from "../store/authslice";
// import { removetodos } from "../store/todoslice";
import{ removealldata} from '../store/adminslice'


// icons 
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { AiFillDatabase } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";



export default function AdminSidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleLogout = async () => {
        try {
            dispatch(removealldata());
            dispatch(logout());
            // setUser(null);
            navigate("/Signin");
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error(error.message);
            console.log(error);

        }
    };
    return (
        <>
            <div className="settings">

                <h4  >iTask</h4>

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
