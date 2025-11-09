import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Todo/store/authslice";


const eyeclosed = 'bi bi-eye-slash'
const eyeopened = 'bi bi-eye'
export default function SignIn() {
  const [isSending, setIsSending] = useState(false)
  const [show, setshow] = useState(false)
  const [passwordType, setpasswordType] = useState('password')
  // const [userData, setUserData] = useState([])
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { loading, user, error } = useSelector((state) => state.auth);

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
        setIsSending(true)
        console.log('satrt')
        const userData = await dispatch(loginUser(values)).unwrap();

        if (userData.role === "user") {
          navigate("/Todos");
        } else {
          navigate("/admin-dashboard");
        }
        toast.success("Logged in!");
      } catch (err) {
        toast.error(err || "Login failed");
      } finally{
        setIsSending(false)
      }
    },

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
          id="signin-email"
          list="email-list"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-danger small">{formik.errors.email}</div>
        )}

        <datalist id="email-list">
          <option value="s@g.co" />
          <option value="j@g.co" />
          <option value="saqlainahmad489@gmail.com" />
        </datalist>

        <div className="w-100 d-flex justify-content-center password-container">
          <input
            autoComplete="off"
            placeholder="Password"
            className="form-control w-75"
            name="password"
            list="pass"

            type={passwordType}
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <i className={show ? eyeopened : eyeclosed} onClick={handleeye}></i>
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className="text-danger small">{formik.errors.password}</div>
        )}
          <datalist id="pass">
          <option value="123456" />

        </datalist>
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
