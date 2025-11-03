import { h2, h3, ul } from "framer-motion/client";
import "./todolist.css"
import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db, } from "./firebaseConfig";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";




export default function Todolist({ todos, onClick, delClick, loading }) {
    const [view, setView] = useState(true);


    const user = auth.currentUser;

    useEffect(() => {
        async function getsavedview() {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch("http://localhost:3000/api/users/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                const data = await res.json();
                if (data.view !== undefined) {
                    setView(data.view);
                }
                // Remove this part as it shouldn't affect theme
                // else {
                //     document.body.classList.add("dark");
                //     setView(false)
                // }
            } catch (error) {
                console.error("Error fetching user preferences:", error);
                toast.error("Failed to load preferences");
            }
        }

        getsavedview();
    }, [])


    async function setviewvalue() {

        try {
            const newView = !view;
            setView(newView);

            const token = localStorage.getItem('token')
            const res = await fetch(`http://localhost:3000/api/users/me`,
                {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        view: newView
                    })
                }
            )
            const data = await res.json();
            console.log(data)
            toast.success(newView ? 'List View' : "Card View");
        } catch (error) {
            console.error("Error updating view:", error);
            toast.error("Failed to update view");
        }
    }
    if (loading) {
        return (
            <>
                <Skeleton width={180} height={35} style={{ margin: '30px 15px ' }} />
                <ul className="d-flex flex-row flex-wrap justify-content-start ms-0">
                    {Array(6).fill().map((_, index) => (
                        <li key={index} className="p-3 mb-3 ms-3  border rounded position-relative list-unstyled " style={{ width: "30%", height: '340px' }}>
                            <Skeleton width={'100%'} height={'150px'} />
                            <Skeleton width={180} height={20} />
                            <Skeleton width={180} height={20} />
                            <Skeleton width={200} height={15} style={{ marginTop: 5 }} />
                            <Skeleton width={220} height={15} style={{ marginTop: 5 }} />
                            <Skeleton width={200} height={15} style={{ marginTop: 5 }} />
                            <Skeleton width={240} height={15} style={{ marginTop: 5 }} />
                            <div className="d-flex justify-content-end mt-2">
                                <Skeleton width={30} height={30} style={{ marginLeft: 8, position: 'absolute', right: '12px', top: '220px' }} />
                                <Skeleton width={30} height={30} style={{ marginLeft: 8, position: 'absolute', right: '12px', top: '180px' }} />
                            </div>
                        </li>
                    ))}
                </ul>
            </>
        )
    }

    return (
        <div className="todolist">
            <div className="todoheading">
                <h2 className="py-md-3 py-0 ">Todo List <i className="bi bi-card-checklist "></i></h2>
                <button type="button"
                    className="btn "
                    onClick={() => { setviewvalue() }}>

                    <i class="bi bi-view-list fs-3"></i>
                </button>
            </div>
            <ul >


                {(todos.length === 0) ? (
                    <h2 className="notask">No Task Found!</h2>
                ) : (
                    todos.map((todo) => (
                        <li key={todo._id}
                            onClick={() => onClick(todo)}
                            className={
                                `${todo.checked ? "checked" : ""} 
                                 ${view ? "list" : ""}
                                 ${todo.Level === 'urgent' ? 'urgent' : todo.Level === 'imp' ? 'imp' : 'notImp'}`
                            }>
                            {(todo.Picture) ? <div className="todopic">
                                <img src={todo.Picture} alt="todo pic" />
                            </div> : <div className="todopic">
                                <h4>No image selected</h4>
                            </div>}

                            <h6>Title: {todo?.Title || "No data"}</h6>
                            <h6>Description: {todo?.Description || "No data"}</h6>
                            <h6>Location: {todo.Location ? todo.Location : 'No data'}</h6>
                            <h6>Address: {todo.Address ? todo.Address : 'No data'}</h6>
                            <h6>
                                Date and Time:{" "}
                                {todo.DateTime
                                    ? (todo.DateTime.toDate ? todo.DateTime.toDate() : new Date(todo.DateTime)).toLocaleString()
                                    : "No data"}
                            </h6>

                            <i className="bi bi-x-lg btnclose" onClick={(e) => {
                                e.stopPropagation();
                                delClick(todo._id);
                            }}></i>

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
                    )))}


            </ul>

        </div>

    )
}