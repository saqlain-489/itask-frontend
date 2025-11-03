import { useState } from "react";
// import { login } from "./authService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";


const eyeclosed = 'bi bi-eye-slash'
const eyeopened = 'bi bi-eye'
export default function SignIn() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [isSending, setIsSending] = useState(false)
  const [show, setshow] = useState(false)
  const [passwordType, setpasswordType] = useState('password')
  const [userData,setUserData] = useState([])
  const navigate = useNavigate();


  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setIsSending(true);
  //     await signInWithEmailAndPassword(auth, email, password);


  //     toast.success("Logged in!");
  //     navigate("/todo");
  //     setIsSending(false);

  //   } catch (err) {
  //     toast.error(err.message);
  //     setIsSending(false);

  //   }
  // };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",


    },

    validationSchema: Yup.object({
      email: Yup.string().min(2).max(50).required("Enter Email to continue"),
      password: Yup.string().required("Password is required"),


    }),

    onSubmit: async (values) => {
      try {
        setIsSending(true);

        const arr = {
          email: values.email,
          password: values.password
        };
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(arr)
        });

        let data;
        try {
          data = await res.json();
        } catch (err) {
          data = { message: "Invalid server response" };
        }

        if (!res.ok) {
          toast.error(data.message || "Login failed. Please try again.");
          setIsSending(false);
          return;
        }

        localStorage.setItem("token", data.token);

        const token = localStorage.getItem('token')

        const res2 = await fetch(`http://localhost:3000/api/users/me`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        const data2 = await res2.json();
        // setUserData(data2)
        console.log('saldj', data2)

        // let user = auth.currentUser
        // const userDocRef = doc(db, "todo", user.uid);
        // const userDoc = await getDoc(userDocRef);
        // const isAdminFromFirestore = userDoc.exists() && userDoc.data().isAdmin === true;

        // if (isAdminFromFirestore) {
        // } else {
        // }
        if (data2.role === 'user') {
          navigate("/todo");
          toast.success("Logged in!");

        }
        else if (data2.role === 'admin') {
          toast.success("Welcome Admin!");
          navigate("/admin-dashboard");

        }

      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsSending(false);

      }

    }
  });

  function handleeye() {
    setshow(!show)
    if (!show) {
      setpasswordType('text')
    }
    else {
      setpasswordType('password')
    }
  }
  return (
    <div className="signin-container ">
      <form onSubmit={formik.handleSubmit} className="signin py-4">
        <h2>Sign In</h2>
        <p>Enter your credentials to continue...</p>
        <input
          autoComplete="off"
          placeholder="Email"
          className="form-control w-75"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-danger small">{formik.errors.email}</div>
        )}

        <div className="w-100 d-flex justify-content-center password-container">
          <input
            autoComplete="off"
            placeholder="Password"
            className="form-control w-75"
            name="password"
            type={passwordType}
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <i className={show ? eyeopened : eyeclosed} onClick={handleeye}></i>

        </div>
        {formik.touched.password && formik.errors.password && (
          <div className="text-danger small">{formik.errors.password}</div>
        )}
        <button type="submit"
          className="btn btn-primary w-75"
          disabled={isSending} >
          Sign in
        </button>

        <div className={isSending ? 'd-block' : 'd-none'}>
          Please wait...
        </div>
        <div>
          <Link to="/Signup" style={{ textDecoration: 'none' }}>
            Sign up?{' '}
          </Link>
          if you don't have an account
        </div>
        <div>
          <Link to='/forget-password'>forget password</Link>
        </div>
      </form>
    </div>

  )
}
