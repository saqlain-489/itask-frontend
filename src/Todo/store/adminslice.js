import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "./todoslice";


export const fetchUsersData = createAsyncThunk(
    "admin/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetchWithAuth(`${import.meta.env.VITE_APP_API_URL}/api/users/all`,
                { method: "GET" }
            );
            const data = await res.json();
            console.log(data)
            if (!res.ok) throw new Error(data.message);
            return { users: data.data, total_user: data.total };

        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);
export const fetchTodos = createAsyncThunk(
    "admin/fetchTodos",
    async (page = 1, { rejectWithValue }) => {
        try {
            const pageSize = 9;
            const res = await fetchWithAuth(`${import.meta.env.VITE_APP_API_URL}/api/todos/all?page=${page}&pageSize=${pageSize}`,
                { method: "GET" }
            );
            const data = await res.json();
            console.log(data)
            if (!res.ok) throw new Error(data.message);
            return { todos: data.data, total_todos: data.total_todos ?? data.total, totalPages: data.total_pages ?? Math.ceil((data.total_todos ?? data.total) / pageSize), page };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const editUserName = createAsyncThunk(
    "admin/editUserName",
    async (payload, { rejectWithValue }) => {
        const { userId, newName } = payload;
        // console.log("Received:", userId, newName);
        try {
            const res = await fetchWithAuth(`${import.meta.env.VITE_APP_API_URL}/api/users/${userId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: newName
                    })
                }
            );
            if (!res.ok) {
                const errorText = await res.text();
                console.error("Error response:", errorText);
                toast.error(`Failed to update: ${res.status}`);
                return;
            }

            const data = await res.json();
            console.log(data)
            return { name: data.name, id: userId };

        } catch (err) {
            return rejectWithValue(err.message);
        }
    }


);

export const deleteUser = createAsyncThunk(
    "todos/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetchWithAuth(`${import.meta.env.VITE_APP_API_URL}/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return id;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);
export const deleteTodo = createAsyncThunk(
    "todos/deleteTodo",
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetchWithAuth(`${import.meta.env.VITE_APP_API_URL}/api/todos/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Delete failed');
            toast.success("Todo deleted successfully!");
            return id;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// export const searchTodos = createAsyncThunk(
//     "todos/searchTodos",
//     async (query, { rejectWithValue }) => {
//         try {
//             const res = await fetchWithAuth(
//                 `http://localhost:3000/api/todos/search?query=${encodeURIComponent(query)}`
//             );

//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message);
//             return data.data;
//         } catch (err) {
//             return rejectWithValue(err.message);
//         }
//     }
// );





const adminslice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        totalUsers: 0,
        todos: [],
        totalTodos: 0,
        avgTodos: 0,
        page: 1,
        pageSize: 9,
        totalPages: 1,
        isLoading: false,
        error: null,
    },
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        removealldata: (state) => {
            state.todos = [];
            state.totalTodos = 0;
            state.totalPages = 1;
            state.users = [],
            state.totalUsers = 0,
            state.totalPages = 1,
            state.avgTodos = 0
      
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsersData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsersData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload.users;
                state.totalUsers = action.payload.total_user;
            })
            .addCase(fetchUsersData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(editUserName.fulfilled, (state, action) => {
                const user = state.users.find((u) => u._id === action.payload.id);
                if (user) user.name = action.payload.name;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((u) => u._id !== action.payload);
                state.totalUsers -= 1;
            })
            .addCase(fetchTodos.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.todos = action.payload.todos;
                state.totalTodos = action.payload.total_todos;
                state.totalPages = action.payload.totalPages ?? state.totalPages;
                state.page = action.payload.page ?? state.page;
                state.avgTodos = state.totalUsers
                    ? (state.totalTodos / state.totalUsers)
                    : 0;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.todos = state.todos.filter((t) => t._id !== action.payload);
                state.totalTodos -= 1;
            })
        // .addCase(searchTodos.pending, (state) => {
        //     state.isLoading = true;
        // })
        // .addCase(searchTodos.fulfilled, (state, action) => {
        //     state.isLoading = false;
        //     state.todos = Array.isArray(action.payload) ? action.payload : [];
        // })
        // .addCase(searchTodos.rejected, (state, action) => {
        //     state.isLoading = false;
        //     state.error = action.payload;
        // });
    },
});

export const { setPage,removealldata } = adminslice.actions;
export default adminslice.reducer;