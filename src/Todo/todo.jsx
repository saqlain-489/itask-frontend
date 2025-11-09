// import Search from "./todosearch.jsx";
// import TodoList from "./todolist.jsx";
// import { useEffect, useState, useRef } from "react";
// import Theme from "./theme.jsx";

// import { Link } from "react-router-dom";
// import Sidepanel from "./sidepanel.jsx";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";


// export default function TodoContainer() {
//   const [todos, setTodos] = useState([]);
//   const [allTodos, setAllTodos] = useState([]);
//   const [searchquery, setSearchQuery] = useState("");
//   const [isloading, setisloading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const [lastDoc, setLastDoc] = useState(null);
//   const [page, setPage] = useState(1);
//   const [HasNextPage, setHasNextPage] = useState(true)
//   const [totalTodos, setTotalTodos] = useState(0);
//   const [pageCursors, setPageCursors] = useState([]);


//   const PostperPage = 6

//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setIsAuthenticated(false);
//       navigate("/signin");
//       return;
//     }

//     setIsAuthenticated(true);
//     setPage(1);
//     fetchTodos(1);
//   }, []);

//   const totalPages = Math.ceil(totalTodos / PostperPage);

//   async function fetchTodos(pageNum = page) {
//     setisloading(true);
//     const token = localStorage.getItem("token");

//     try {
//       const res = await fetch(
//         `http://localhost:3000/api/todos?page=${pageNum}&pageSize=${PostperPage}`,
//         {
//           headers: {
//             "Authorization": `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();
//       console.log("Fetched Todos:", data);


//       setTodos(data.data);
//       setAllTodos(data.data);
//       setTotalTodos(data.total_todos);
//       setisloading(false);


//       setHasNextPage(data.data.length === PostperPage);
//     } catch (err) {
//       console.error("Error fetching todos:", err);
//       setisloading(false);
//     }
//   }


//   // //  Toggle completion status
//   async function handleToggle(ctodo) {

//     const updatedTodos = todos.map((todo) =>
//       todo._id === ctodo._id ? { ...todo, checked: !todo.checked } : todo
//     );
//     setTodos(updatedTodos);
//     setAllTodos(updatedTodos);
//     const token = localStorage.getItem('token')
//     const res = await fetch(`http://localhost:3000/api/todos/${ctodo._id}`,
//       {
//         method: "PATCH",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           checked: !ctodo.checked
//         })
//       }
//     )
//     const data = await res.json();
//     console.log(data)

//   }

//   // //  Search function
  



//   // 🔹 Delete todo
//   async function handleClick(id) {
//     try {
//       // const tododoc = doc(db, "todo", user.uid, "tasks", id);
//       // await deleteDoc(tododoc);
//       const token = localStorage.getItem('token')
//       const res = await fetch(`http://localhost:3000/api/todos/${id}`,
//         {
//           method: 'DELETE',
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       )
//       const data = await res.json()
//       toast.success(data.message)
//       console.log(id)
//       const remaining = allTodos.filter((t) => t._id !== id);
//       setTodos(remaining);
//       setAllTodos(remaining);
//       fetchTodos();

//     } catch (err) {
//       console.error("Error deleting todo:", err);
//     }
//   }


//   // }
//   function handlenew() {
//     const sorted = [...allTodos].sort((a, b) => {
//       const dateA = new Date(a.DateTime);
//       const dateB = new Date(b.DateTime);
//       return dateB - dateA;
//     });
//     setTodos(sorted);
//   }

//   //  Sort (Oldest first)
//   function handleold() {
//     const sorted = [...allTodos].sort((a, b) => {
//       const dateA = new Date(a.DateTime);
//       const dateB = new Date(b.DateTime);
//       return dateA - dateB;
//     });
//     setTodos(sorted);
//   }

//   const token = localStorage.getItem('token')
//   // Replace the token check in render with loading state
//   if (isAuthenticated === null) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="d-flex justify-content-center align-items-center text-black p-2 text-center"
//         style={{ height: "100vh", background: "aliceblue" }}>
//         <h2>
//           <Link to="/Signin" style={{ textDecoration: "none" }}>
//             Sign in?{" "}
//           </Link>
//           &nbsp;to access your itTask panel!
//         </h2>
//       </div>
//     );
//   }

//   return (
//     <div className="todopage">
//       <div className="sidepanel">
//         <Sidepanel />
//       </div>


//       <div className="todocontainer">
//         <Theme
//           onNewclick={handlenew}
//           onOldclick={handleold}
//         />


//         <TodoList
//           todos={todos}
//           onClick={handleToggle}
//           delClick={handleClick}
//           loading={isloading}
//         />

//         <div className="pagination">
//           <button
//             onClick={async () => {
//               if (page > 1) {
//                 const newPage = page - 1;
//                 setPage(newPage);
//                 await fetchTodos(newPage);
//               }
//             }}
//             disabled={page === 1}
//           >
//             Previous
//           </button>

//           <span className="mx-3">
//             Page {page} of {Math.ceil(totalTodos / PostperPage)} ({totalTodos} total)
//           </span>

//           <button
//             onClick={async () => {
//               const newPage = page + 1;
//               await fetchTodos(newPage);

//               if (HasNextPage) setPage(newPage);
//             }}
//             disabled={!HasNextPage}
//           >
//             Next
//           </button>
//         </div>


//       </div>
//     </div>
//   );
// }

// // import React from 'react'

// // const TodoContainer = () => {
// //   return (
// //     <div>
// //       sdasds
// //     </div>
// //   )
// // }

// // export default TodoContainer