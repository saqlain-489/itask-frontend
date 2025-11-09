import AdminSidebar from './adminSidebar';
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { Link } from 'react-router-dom';
import Skeleton from "react-loading-skeleton";
import { useSelector, useDispatch } from 'react-redux';
import { editUserName, fetchTodos, fetchUsersData, setPage, deleteTodo } from "../store/adminslice";
import { fetchWithAuth } from "../store/todoslice";




export default function AdminTodos() {
  const [search, setSearch] = useState("");
  const PostperPage = 9;

  const { user } = useSelector((state) => state.auth);
  const { todos, totalTodos, avgTodos, page, totalPages, isLoading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(fetchTodos(page));
  }, [dispatch, page]);


  const filteredTodos = useMemo(() => {
    if (!search.trim()) return todos;
    return todos.filter((u) =>
      u.userId?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, todos]);

  // async function delClick(todoId) {
  //   try {
  //     const res = await fetchWithAuth(`http://localhost:3000/api/todos/${todoId}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!res.ok) {
  //       const errorText = await res.text();
  //       console.error("Error response:", errorText);
  //       toast.error(`Failed to delete: ${res.status}`);
  //       return;
  //     }

  //     // re-fetch current page after successful delete
  //     dispatch(fetchTodos(page));
  //     toast.success("Todo deleted successfully!");
  //   } catch (err) {
  //     console.error("Error deleting todo:", err);
  //     toast.error("Error deleting todo: " + err.message);
  //   }
  // }

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

  if (isLoading) {
    return (
      <div className="d-flex">
        <div className="sidepanel">
          <AdminSidebar />
        </div>
        <div className="admin-content  p-4" style={{ width: '80%' }}>
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
          <ul className="d-flex flex-row flex-wrap justify-content-start ms-0">
            {Array(6).fill().map((_, index) => (
              <li key={index} className=" mb-3 ms-3  border rounded position-relative list-unstyled " style={{ width: "30%", height: '340px' }}>
                <Skeleton width={'100%'} height={'150px'} />
                <Skeleton width={180} height={20} style={{ marginTop: 10, marginLeft: 10 }} />
                <Skeleton width={180} height={20} style={{ marginTop: 10, marginLeft: 10 }} />
                <Skeleton width={200} height={15} style={{ marginTop: 10, marginLeft: 10 }} />
                <Skeleton width={220} height={15} style={{ marginTop: 10, marginLeft: 10 }} />
                <Skeleton width={200} height={15} style={{ marginTop: 10, marginLeft: 10 }} />
                <Skeleton width={240} height={15} style={{ marginTop: 10, marginLeft: 10 }} />
                <div className="d-flex justify-content-end mt-2">
                  <Skeleton width={30} height={30} style={{ marginLeft: 8, position: 'absolute', right: '12px', top: '200px' }} />
                  <Skeleton width={30} height={30} style={{ marginLeft: 8, position: 'absolute', right: '12px', top: '160px' }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

    )
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
              {filteredTodos.length !== 0 ? (
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
                        dispatch(deleteTodo(todo._id)).then(() => {
                          dispatch(fetchTodos(page));
                        });

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
              ) : (

                <h2 className="notask">No Todos!</h2>
              )}
            </ul>
          </div>
          <div className="pagination">
            <button
              onClick={() => {
                if (page > 1) {
                  dispatch(setPage(page - 1));
                  dispatch(fetchTodos(page - 1));
                }
              }}
              disabled={page === 1}
            >
              Previous
            </button>

            <span className="mx-3">
              Page {page} of {totalPages} ({totalTodos} total)
            </span>

            <button
              onClick={() => {
                if (page < totalPages) {
                  dispatch(setPage(page + 1));
                  dispatch(fetchTodos(page + 1));
                }
              }}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
