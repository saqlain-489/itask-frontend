import Search from "./todosearch.jsx";
import TodoList from "./todolist.jsx";
import { useEffect, useState, useRef } from "react";
import Theme from "./theme.jsx";
import { db, auth } from "./firebaseConfig";
import {
  query,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  getDocs,
  where,
  orderBy,
  limit,
  startAfter
} from "firebase/firestore";
// import Pagination from "./pagination.jsx";
import { Link } from "react-router-dom";
import Sidepanel from "./sidepanel.jsx";
import { useNavigate } from "react-router-dom";
// import { query, collection, getDocs, } from "firebase/firestore";
import { getCountFromServer } from "firebase/firestore";
import toast from "react-hot-toast";


export default function TodoContainer() {
  const [todos, setTodos] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [searchquery, setSearchQuery] = useState("");
  const [isloading, setisloading] = useState(true);
  // const [PostperPage, setPostperPage] = useState(6);
  const [lastDoc, setLastDoc] = useState(null);
  const [page, setPage] = useState(1);
  const [HasNextPage, setHasNextPage] = useState(true)
  const [totalTodos, setTotalTodos] = useState(0);
  const [pageCursors, setPageCursors] = useState([]);


  const PostperPage = 6

  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos(1);
    setPage(1);
   
  }, []);

  const totalPages = Math.ceil(totalTodos / PostperPage);

  async function fetchTodos(pageNum = page) {
    setisloading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:3000/api/todos?page=${pageNum}&pageSize=${PostperPage}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("Fetched Todos:", data);

    // console.log(data.data.createdAt)
      setTodos(data.data);
      setAllTodos(data.data);
      setTotalTodos(data.total_todos);
      setisloading(false);

  
      setHasNextPage(data.data.length === PostperPage);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setisloading(false);
    }
  }



  // async function fetchTodos(startAfterDoc = null, isNext = true) {
  //   setisloading(true);
  //   const tasksRef = collection(db, "todo", user.uid, "tasks");

  //   let q = query(tasksRef, orderBy("createdAt", "desc"), limit(PostperPage));

  //   if (startAfterDoc) {
  //     q = query(tasksRef, orderBy("createdAt", "desc"), startAfter(startAfterDoc), limit(PostperPage));
  //   }

  //   const snapshot = await getDocs(q);
  //   const data = snapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));

  //   setTodos(data);
  //   setAllTodos(data);

  //   const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  //   if (isNext) {
  //     // Add new cursor when moving forward
  //     setPageCursors((prev) => [...prev, lastVisible]);
  //   }

  //   setLastDoc(lastVisible);
  //   setHasNextPage(data.length === PostperPage);
  //   setisloading(false);
  // }


  // async function fetchTotalTodosCount() {
  //   const tasksRef = collection(db, "todo", user.uid, "tasks");
  //   const snapshot = await getCountFromServer(tasksRef);
  //   const total = snapshot.data().count;
  //   return total;
  // }

  //  Toggle completion status

  async function handleToggle(ctodo) {

    const updatedTodos = todos.map((todo) =>
      todo._id === ctodo._id ? { ...todo, checked: !todo.checked } : todo
    );
    setTodos(updatedTodos);
    setAllTodos(updatedTodos);
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3000/api/todos/${ctodo._id}`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checked: !ctodo.checked
        })
      }
    )
    const data = await res.json();
    console.log(data)

  }

  //  Search function
  async function handleChange(e) {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);

    if (value.trim() === "") {
  
      await fetchTodos();
      return;
    }

    const results = todos.filter((t) =>
      t.Title?.toLowerCase().includes(value.toLowerCase())
    );
    setTodos(results);
  }



  // 🔹 Delete todo
  async function handleClick(id) {
    try {
      // const tododoc = doc(db, "todo", user.uid, "tasks", id);
      // await deleteDoc(tododoc);
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:3000/api/todos/${id}`,
        {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      const data = await res.json()
      toast.success(data.message)
      console.log(id)
      const remaining = allTodos.filter((t) => t._id !== id);
      setTodos(remaining);
      setAllTodos(remaining);
      fetchTodos();

    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  }


  // }
function handlenew() {
  const sorted = [...allTodos].sort((a, b) => {
    const dateA = new Date(a.DateTime);
    const dateB = new Date(b.DateTime);
    return dateB - dateA; 
  });
  setTodos(sorted);
}

  //  Sort (Oldest first)
  function handleold() {
    const sorted = [...allTodos].sort((a, b) => {
    const dateA = new Date(a.DateTime);
    const dateB = new Date(b.DateTime);
      return dateA - dateB;
    });
    setTodos(sorted);
  }

  const token = localStorage.getItem('token')
  return (
    <>
      {token ? (
        <>
          <div className="todopage">
            <div className="sidepanel">
              <Sidepanel />
            </div>


            <div className="todocontainer">
              <Theme
                onNewclick={handlenew}
                onOldclick={handleold}
              />

              <Search
                query={searchquery}
                onChange={handleChange}
              />

              <TodoList
                todos={todos}
                onClick={handleToggle}
                delClick={handleClick}
                loading={isloading}
              />

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
                    // ✅ Only increment page if there was data on the next page
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
      ) : (
        <div
          className="d-flex justify-content-center align-items-center text-black p-2 text-center"
          style={{ height: "100vh", background: "aliceblue" }}
        >
          <h2>
            <Link to="/Signin" style={{ textDecoration: "none" }}>
              Sign in?{" "}
            </Link>
            &nbsp;to access your itTask panel!
          </h2>
        </div>
      )}
    </>
  );
}