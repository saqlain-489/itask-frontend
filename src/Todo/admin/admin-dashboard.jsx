import AdminSidebar from "./adminSidebar";
import { useEffect, useState } from "react";
import { collection, getDocs, collectionGroup } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from "react-loading-skeleton";


export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTodos, setTotalTodos] = useState(0);
  const [avgTodos, setAvgTodos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);

  const adminEmail = "j@g.co";

 
  useEffect(() => {
    async function fetchData() {

      // }
      try {

        const token = localStorage.getItem('token')
        const res = await fetch(`http://localhost:3000/api/users/me`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },

          }
        )
        const data = await res.json();
        setUser(data)

      } catch (error) {
        console.error("Error fetching data:", err);
      }
    }

    async function fetchUserNumber() {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:3000/api/users/all', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });


      if (!res.ok) {
        console.error("Failed to fetch users:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      setTotalUsers(data.total)
    }
    async function fetchTodosNumber() {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:3000/api/todos/all', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });


      if (!res.ok) {
        console.error("Failed to fetch users:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      console.log(data)
      setTotalTodos(data.total_todos)
    }
    // setAvgTodos()
    // console.log(avgTodos)

    fetchData();
    fetchUserNumber();
    fetchTodosNumber();
    setLoading(false)
  }, []);

  const token = localStorage.getItem('token')
  if (!token) {
    return (
      <div
        className="d-flex justify-content-center align-items-center text-black p-2 text-center"
        style={{ height: "100vh", background: "aliceblue" }}
      >
        <h2>
          <Link to="/Signin" style={{ textDecoration: "none" }}>
            Sign in
          </Link>{" "}
          to access the Dashboard!
        </h2>
      </div>
    );
  }

  if (user.role === 'user') {
    return (
      <div
        className="d-flex justify-content-center align-items-center text-black p-2 text-center"
        style={{ height: "100vh", background: "aliceblue" }}
      >
        <h2>
          Access Denied! <br />
          Please login with your <span className="text-danger fw-bold">
            <Link to='/Signin' className=" text-decoration-none">Admin email</Link>
          </span> to view this page.
        </h2>
      </div>
    );
  }


  return (
    <div className="d-flex">
      <div className="sidepanel">
        <AdminSidebar />
      </div>
      <div className="admin-content" style={{ width: "80%" }}>
        <div className="p-4" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
          <h2 className="mb-4 text-center fw-bold">📊 Admin Dashboard</h2>

          {loading ? (
            <div className="d-flex justify-content-center flex-wrap gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="card shadow-sm p-3 text-center"
                  style={{ width: "250px", borderRadius: "12px" }}
                >
                  <Skeleton width={100} height={20} style={{ margin: "10px auto" }} />
                  <Skeleton width={80} height={30} style={{ margin: "10px auto" }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex justify-content-center flex-wrap gap-4">
              <div className="card shadow-sm p-3 text-center" style={{ width: "250px", borderRadius: "12px" }}>
                <h5>Total Users</h5>
                <h3 className="fw-bold text-primary">{totalUsers}</h3>
              </div>
              <div className="card shadow-sm p-3 text-center" style={{ width: "250px", borderRadius: "12px" }}>
                <h5>Total Todos</h5>
                <h3 className="fw-bold text-success">{totalTodos}</h3>
              </div>

              <div className="card shadow-sm p-3 text-center" style={{ width: "250px", borderRadius: "12px" }}>
                <h5>Avg Todos per User</h5>
                <h3 className="fw-bold text-warning">{Math.ceil(totalUsers/totalUsers)}</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
