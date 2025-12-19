import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
// import { post } from "../../express/src/routes";

export default function SignUp() {
  const [isSending, setIsSending] = useState(false)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // const [showPassword, setShowPassword]=useState(false)
  const [passwordType, setpasswordType] = useState('password')
  const [show, setshow] = useState(false)

  const eyeclosed = 'bi bi-eye-slash'
  const eyeopened = 'bi bi-eye'



  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setIsSending(true);


      const arr = {
        name: name,
        email: email,
        password: password
      };
      const r = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arr)
      });

      const data = await r.json();
      console.log(data)
      localStorage.setItem("accesstoken", data.accesstoken);
      localStorage.setItem("refreshtoken", data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user))

      console.log('Response from server:', data);
      toast.success("Account created successfully!");
      navigate("/Todos");
      setIsSending(false);


    } catch (err) {
      toast.error(err.message || "Sign up failed");
      setIsSending(false);

    }
  };
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
    <div className="signin-container">
      <form onSubmit={handleSignUp} className="signin py-4">
        <h2>Sign Up</h2>
        <p>Enter your details to continue...</p>

        <input
          placeholder="Full Name"
          className="form-control w-75"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Email"
          className="form-control w-75"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="w-100 d-flex justify-content-center password-container">
          <input
            autoComplete="on"
            placeholder="Password"
            className="form-control w-75"
            type={passwordType}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className={show ? eyeopened : eyeclosed} onClick={handleeye}></i>
        </div>

        <button type="submit" className="btn btn-primary w-75 mt-2" disabled={isSending}>
          Sign Up
        </button>
        <div className={isSending ? 'd-block' : 'd-none'}>
          Creating Account..
        </div>

        <div className="mt-3">
          <Link to="/Signin" style={{ textDecoration: "none" }}>
            Sign in?
          </Link>{" "}
          if you already have an account
        </div>
      </form>
    </div>
  );
}
