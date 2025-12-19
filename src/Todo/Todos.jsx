import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchTodos, deleteTodo, toggleTodo, sortNewest, sortOldest, setPage } from "../Todo/store/todoslice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Search from "./todosearch.jsx";
import TodoList from "./todolist.jsx";
import Theme from "./theme.jsx";
import Sidepanel from "./sidepanel.jsx";
import { fetchTodos, deleteTodo, toggleTodo, sortNewest, sortOldest, setPage, searchTodos } from "./store/todoslice.js";
// import ChatWidget from "./chat.jsx";

export default function TodoContainer() {
    const [searchquery, setSearchQuery] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { todos, isLoading, totalTodos, page } = useSelector((state) => state.todos);

    useEffect(() => {
        const token = localStorage.getItem("accesstoken");
        if (!token) {
            navigate("/signin");
            return;
        }
        dispatch(fetchTodos(1));
    }, [dispatch]);
    // async function handleChange(e) {
    //     const value = e.target.value.toLowerCase();
    //     setSearchQuery(value);

    //     if (value.trim() === "") {

    //         setTodos(allTodos);
    //         return;
    //     }

    //     const token = localStorage.getItem("token");

    //     try {
    //         const res = await fetch(
    //             `http://localhost:3000/api/todos/search?query=${encodeURIComponent(value)}`,
    //             {
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`,
    //                 },
    //             }
    //         );

    //         const data = await res.json();

    //         if (Array.isArray(data.data)) {
    //             setTodos(data.data);
    //         } else {
    //             setTodos([]);
    //         }

    //     } catch (err) {
    //         console.error("Error searching todos:", err);
    //     }
    // }
    const totalPages = Math.ceil(totalTodos / 6);

    return (
        <div className="todopage">
            <div className="sidepanel">
                <Sidepanel />
            </div>

            <div className="todocontainer">
                <Theme
                    onNewclick={() => dispatch(sortNewest())}
                    onOldclick={() => dispatch(sortOldest())}
                />

                <Search
                    query={searchquery}
                    onChange={(e) => {
                        const value = e.target.value.toLowerCase();
                        setSearchQuery(value);
                        // console.log('SJD')
                        if (value.trim() === "") {
                            dispatch(fetchTodos(page));
                        } else {
                            dispatch(searchTodos(value));
                        }
                    }}
                />

                <TodoList
                    todos={todos}
                    onClick={(todo) => dispatch(toggleTodo(todo))}
                    delClick={(id) => {
                        dispatch(deleteTodo(id)).then(() => {
                            dispatch(fetchTodos(page));
                        });
                    }}
                    loading={isLoading}
                />

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
                            dispatch(setPage(page + 1));
                            dispatch(fetchTodos(page + 1));
                        }}
                        disabled={todos.length < 6}
                    >
                        Next
                    </button>
                </div>
            </div>
            {/* <ChatWidget/> */}
        </div>
    );
}

