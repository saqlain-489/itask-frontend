import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    collectionGroup,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import AdminSidebar from "./adminSidebar";
import { toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { auth } from '../firebaseConfig';
import { Link } from "react-router-dom";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editingUserId, setEditingUserId] = useState(null);
    const [newName, setNewName] = useState("");
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
                console.log(data)
                setUser(data)
                console.log(user)

            } catch (err) {
                console.error("Error fetching data:", err);
            }
        }

        async function fetchAllUsers() {
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
            console.log('sad', data)
            setUsers(data.data)

            setLoading(false)
        }

        fetchData();
        fetchAllUsers();
    }, []);

    // useEffect(() => {
    //     async function fetchUsers() {
    //         try {
    //             if (!user || user.email !== adminEmail) return;

    //             const snapshot = await getDocs(collection(db, "todo"));
    //             const data = snapshot.docs.map((doc) => ({
    //                 id: doc.id,
    //                 ...doc.data(),
    //             }));
    //             setUsers(data);
    //             console.log(data)
    //         } catch (error) {
    //             console.error("Error fetching users:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }

    //     fetchUsers();
    // }, [user]);

    function highlightMatch(name, query) {
        if (!query.trim()) return name;
        const regex = new RegExp(`(${query})`, "gi");
        return name.replace(regex, "<mark>$1</mark>");
    }

    // 🔍 Filter users by name
    const filteredUsers = users.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase())
    );

    // ✏️ Edit user name
    // async function handleEdit(userId) {
    //     if (!newName.trim()) return alert("Name cannot be empty.");

    //     try {
    //         // await updateDoc(doc(db, "todo", userId), { name: newName });

    //           const token = localStorage.getItem('token')
    //         const res = await fetch(`http://localhost:3000/api/users/${userId}`,
    //             {
    //                 method: "PATCH",
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     name: newName
    //                 })
    //             }
    //         )
    //         const data = await res.json();
    //         console.log(data.name)
    //         setUsers((prev) =>
    //             prev.map((u) => (u._id === userId ? { ...u, name: newName } : u))
    //         );
    //         setEditingUserId(null);
    //         setNewName("");
    //         toast.success("User name updated successfully ");
    //     } catch (err) {
    //         toast.error("Error updating name:", err);
    //     }
    // }
    async function handleEdit(userId) {
        if (!newName.trim()) return alert("Name cannot be empty.");

        try {
            const token = localStorage.getItem('token')
            console.log("Updating user:", userId, "with name:", newName);

            const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newName
                })
            })

            console.log("Response status:", res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Error response:", errorText);
                toast.error(`Failed to update: ${res.status}`);
                return;
            }

            const data = await res.json();
            console.log("Updated user data:", data);
            setUsers((prev) =>
                prev.map((u) => (u._id === userId ? { ...u, name: newName } : u))
            );
            setEditingUserId(null);
            setNewName("");
            toast.success("Name updated successfully  ");

        } catch (err) {
            console.error("Error updating name:", err);
            toast.error("Error updating name: " + err.message);
        }
    }

    // ❌ Delete user
    async function handleDelete(userId) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user and all their tasks?"
        );
        if (!confirmDelete) return;

        try {
           
            const token = localStorage.getItem('token')
            // console.log("Updating user:", userId, "with name:", newName);

            const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
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
                toast.error(`Failed to update: ${res.status}`);
                return;
            }

            // const data = await res.json();
            setUsers((prev) => prev.filter((u) => u._id !== userId));
            toast.success("User deleted successfully ");
        } catch (err) {
            toast.error("Error deleting user:", err);
        }
    }

    if (loading) {
        return (
            <div className="admin-page d-flex">
                <div className="sidepanel">
                    <AdminSidebar />
                </div>

                <div
                    className="flex-grow-1 p-4"
                    style={{ background: "#f8f9fa", minHeight: "100vh" }}
                >
                    <h2 className="mb-4 fw-bold text-center">👥 All Users</h2>

                    {/* 🔍 Search bar */}
                    <div className="mb-4 text-center">
                        <input
                            type="text"
                            className="form-control w-50 mx-auto"
                            placeholder="Search by name ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered text-center align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array(users?.length || 6).fill().map((_, index) => (
                                    <tr key={index}>
                                        <td><Skeleton height={20} width={174} /></td>
                                        <td><Skeleton height={20} width={67} /></td>
                                        <td><Skeleton height={20} width={100} /></td>
                                        <td className="d-flex justify-content-center gap-2">
                                            <Skeleton height={30} width={60} />
                                            <Skeleton height={30} width={60} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        );
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
        <div className="admin-page d-flex">
            <div className="sidepanel">
                <AdminSidebar />
            </div>

            <div
                className="flex-grow-1 p-4"
                style={{ background: "#f8f9fa", minHeight: "100vh" }}
            >
                <h2 className="mb-4 fw-bold text-center">👥 All Users</h2>

                {/* 🔍 Search bar */}
                <div className="mb-4 text-center">
                    <input
                        type="text"
                        className="form-control w-50 mx-auto"
                        placeholder="Search by name ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* 🧑‍💻 User list */}


                {filteredUsers.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered text-center align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>User Id</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>
                                            {editingUserId === user._id ? (
                                                <input
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    className="form-control"
                                                />
                                            ) : (
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: highlightMatch(user.name || "No name", search),
                                                    }}
                                                />
                                            )}
                                        </td>

                                        <td>{user.email || "No email"}</td>
                                        <td>{user._id || "No id"}</td>
                                        <td>
                                            {user.createdAt}
                                        </td>
                                        <td>
                                            {editingUserId === user._id ? (
                                                <>
                                                    <button
                                                        className="btn btn-success btn-sm me-2 "
                                                        onClick={() => handleEdit(user._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => setEditingUserId(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-warning btn-sm me-2 "
                                                        onClick={() => {
                                                            setEditingUserId(user._id);
                                                            setNewName(user.name || "");
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(user._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center mt-5">No users found.</p>
                )}
            </div>
        </div>
    );
}
