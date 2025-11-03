import AdminSidebar from './adminSidebar';
import { useEffect, useState, useMemo } from "react";
import {
  collectionGroup,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast } from "react-hot-toast";
import { Link } from 'react-router-dom';
import Skeleton from "react-loading-skeleton";
import Pagination from '../pagination';
import { auth } from '../firebaseConfig';

export default function AdminTodos() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [PostperPage] = useState(9);
  const [HasNextPage, setHasNextPage] = useState(true);
  const [totalTodos, setTotalTodos] = useState(0);
  const [user, setUser] = useState([]);

  // const adminEmail = "j@g.co";
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
        console.log(data)
        setUser(data)
        console.log(user)

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    
    fetchData();
    fetchTodos(1);
    setLoading(false)
  }, []);

  async function fetchTodos(pageNum = page) {
    const token = localStorage.getItem('token');

    const res = await fetch(`http://localhost:3000/api/todos/all?page=${pageNum}&pageSize=${PostperPage}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });


    if (!res.ok) {
      console.error("Failed to fetch todos:", res.status, res.statusText);
      return;
    }

    const data = await res.json();
    setTodos(data.data);
    setTotalTodos(data.total_todos);
    setHasNextPage(data.data.length === PostperPage);
  }

  // useEffect(() => {
  //   async function fetchUsersdata() {
  //     try {
  //       if (!user || user.email !== adminEmail) return;

  //       const snapshot = await getDocs(collectionGroup(db, 'tasks'));
  //       const data = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         path: doc.ref.path,
  //         ...doc.data(),
  //       }));
  //       setTodos(data);
  //       setLoading(false)
  //       console.log("Fetched todos:", data);
  //     } catch (error) {
  //       toast.error('Error fetching data');
  //       console.error(error);
  //     }
  //   }

  //   fetchUsersdata();
  // }, [user]);

  const filteredTodos = useMemo(() => {
    if (!search.trim()) return todos;
    return todos.filter((u) =>
      u.userId?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, todos]);

  async function delClick(todoId) {
    try {
      const token = localStorage.getItem('token'); // ✅ Define token HERE
      
      const res = await fetch(`http://localhost:3000/api/todos/${todoId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        toast.error(`Failed to delete: ${res.status}`);
        return;
      }

      setTodos((prev) => prev.filter((t) => t._id !== todoId));
      toast.success("Todo deleted successfully!");
    } catch (err) {
      console.error("Error deleting todo:", err);
      toast.error("Error deleting todo: " + err.message);
    }
  }

  // const lastIndex = currentPage * PostperPage;
  // const firstIndex = lastIndex - PostperPage;
  // const currenttodos = filteredTodos.slice(firstIndex, lastIndex);
  // console.log(currenttodos)
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

  if (loading) {
    return (
      <div className="d-flex">
        <div className="sidepanel">
          <AdminSidebar />
        </div>
        <div className="admin-content w-75 p-4">
          <div className="mb-4 text-center">
            <input
              type="text"
              className="form-control w-50 mx-auto"
              placeholder="Search by User Id"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="todoheading d-flex justify-content-between align-items-center">
            <h2 className="py-md-3 py-0">All Todos <i className="bi bi-card-checklist"></i></h2>
          </div>
          <ul className='d-flex gap-3 flex-wrap'>
            {Array(4).fill(0).map((_, i) => (
              <li key={i} className="p-3 pb-0 border rounded   list-unstyled position-relative " style={{ width: '45%' }}>
                <h6><Skeleton width={150} /></h6>
                <h6><Skeleton width={200} /></h6>
                <h6><Skeleton width={180} /></h6>
                <h6><Skeleton width={220} /></h6>
                <h6><Skeleton width={250} /></h6>
                <h6><Skeleton width={120} /></h6>
                <h6><Skeleton width={160} /></h6>
                <div className="d-flex justify-content-end mt-2">
                  <Skeleton width={30} height={30} style={{ marginLeft: 8, position: 'absolute', right: '12px', top: '50px' }} />
                  <Skeleton width={30} height={30} style={{ marginLeft: 8, position: 'absolute', right: '12px', top: '10px' }} />
                </div>
              </li>
            ))}

          </ul>
        </div>
      </div>

    )
  }
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



  return (
    <>
      <div className="d-flex">
        <div className="sidepanel">
          <AdminSidebar />
        </div>
        <div className="admin-content  p-4" style={{ width: '80%' }}>
          <div className="todolist">

            <div className="mb-4 text-center">
              <input
                type="text"
                className="form-control w-75 ms-3"
                placeholder="Search by User Id"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="todoheading d-flex justify-content-between align-items-center">
              <h2 className="py-md-3 py-0">All Todos <i className="bi bi-card-checklist"></i></h2>
            </div>

            <ul>
              {filteredTodos.length === 0 ? (
                <h2 className="notask">No Todos!</h2>
              ) : (
                filteredTodos.map((todo) => (
                  <li key={todo._id} className='border-0'>
                    {(todo.Picture) ? <div className="todopic">
                      <img src={todo.Picture} alt="todo pic" />
                    </div> : <div className="todopic">
                      <h4>No image selected</h4>
                    </div>}
                    <h6>Title: {todo.Title || 'No data'}</h6>
                    <h6>Description: {todo.Description || 'No data'}</h6>
                    <h6>Location: {todo.Location || 'No data'}</h6>
                    <h6>Address: {todo.Address || 'No data'}</h6>
                    <h6>
                      Date and Time:{" "}
                      {todo.DateTime || "No data"}
                    </h6>
                    <h6>Priority Level: {todo.Level || 'N/A'}</h6>
                    <h6>User ID: {todo.userId || 'Unknown'}</h6>


                    <i
                      className="bi bi-x-lg btnclose"
                      onClick={(e) => {
                        e.stopPropagation();
                        delClick(todo._id);
                      }}
                    ></i>


                    <Link
                      to="/edittodo"
                      state={{ todo: todo }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i
                        className="bi bi-pencil-square btnedit"
                        onClick={() => console.log("Editing:", todo)}
                      ></i>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="pagination">
                <button
                  onClick={async () => {
                    if (page > 1) {
                      const newPage = page - 1;
                      setPage(newPage);
                      await fetchTodos(newPage);
                    }
                  }}
                  disabled={page === 1}
                >
                  Previous
                </button>

                <span className="mx-3">
                  Page {page} of {Math.ceil(totalTodos / PostperPage)} ({totalTodos} total)
                </span>

                <button
                  onClick={async () => {
                    const newPage = page + 1;
                    await fetchTodos(newPage);
                    if (HasNextPage) setPage(newPage);
                  }}
                  disabled={!HasNextPage}
                >
                  Next
                </button>
              </div>
        </div>
      </div>
    </>
  );
}
