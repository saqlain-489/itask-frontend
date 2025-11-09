import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshtoken');
    console.log("got refresh call")
    if (!refreshToken) {
        console.log('No refresh token available');
    }

    const res = await fetch('http://localhost:3000/api/auth/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Token refresh failed');
    }

    localStorage.setItem('accesstoken', data.accessToken);
    console.log(localStorage.getItem('accesstoken'))
    return data.accesstoken;
};


export const fetchWithAuth = async (url, options = {}) => {
    let token = localStorage.getItem('accesstoken');


    let res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        },
    });

    if (res.status === 401 || res.status === 403) {
        try {
            token = await refreshAccessToken();

            res = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("done refresh call")

        } catch (refreshError) {

            console.log('failed')
            localStorage.removeItem('accesstoken');
            localStorage.removeItem('refreshtoken');
            localStorage.removeItem('user');
            window.location.href = '/signin';
            throw new Error('Session expired. Please login again.');
        }
    }
    return res;
};

// Fetch all todos
export const fetchTodos = createAsyncThunk(
    "todos/fetchTodos",
    async (page = 1, { rejectWithValue }) => {
        try {
            const res = await fetchWithAuth(
                `http://localhost:3000/api/todos?page=${page}&pageSize=6`
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return { todos: data.data, total: data.total_todos, totalPages: data.total_pages };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const createTodo = createAsyncThunk(
    "todos/createTodo",
    async (payload, { rejectWithValue }) => {
        try {
            const { values, imageUrl } = payload;

            const res = await fetchWithAuth('http://localhost:3000/api/todos', {
                method: "POST",
                body: JSON.stringify({
                    ...values,
                    checked: false,
                    Picture: imageUrl,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            console.log('created:', data);
            if (!res.ok) throw new Error(data.message);

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Delete todo
export const deleteTodo = createAsyncThunk(
    "todos/deleteTodo",
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetchWithAuth(`http://localhost:3000/api/todos/${id}`, {
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

// Toggle todo checked
export const toggleTodo = createAsyncThunk(
    "todos/toggleTodo",
    async (todo, { rejectWithValue }) => {
        try {
            const res = await fetchWithAuth(`http://localhost:3000/api/todos/${todo._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ checked: !todo.checked }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return { id: todo._id, checked: !todo.checked };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Search todos
export const searchTodos = createAsyncThunk(
    "todos/searchTodos",
    async (query, { rejectWithValue }) => {
        try {
            const res = await fetchWithAuth(
                `http://localhost:3000/api/todos/search?query=${encodeURIComponent(query)}`
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const todoSlice = createSlice({
    name: "todos",
    initialState: {
        todos: [],
        totalTodos: 0,
        page: 1,
        totalPages: 1,
        isLoading: false,
        error: null,
    },
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        sortNewest: (state) => {
            state.todos.sort(
                (a, b) => new Date(b.DateTime) - new Date(a.DateTime)
            );
        },
        sortOldest: (state) => {
            state.todos.sort(
                (a, b) => new Date(a.DateTime) - new Date(b.DateTime)
            );
        },
        removetodos: (state) => {
            state.todos = [];
            state.totalTodos = 0;
            state.totalPages = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.todos = action.payload.todos;
                state.totalTodos = action.payload.total;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createTodo.fulfilled, (state, action) => {
                state.todos.unshift(action.payload);
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.todos = state.todos.filter((t) => t._id !== action.payload);
                state.totalTodos -= 1;
            })
            .addCase(toggleTodo.fulfilled, (state, action) => {
                const todo = state.todos.find((t) => t._id === action.payload.id);
                if (todo) todo.checked = action.payload.checked;
            })
            .addCase(searchTodos.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(searchTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.todos = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(searchTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setPage, sortNewest, sortOldest, removetodos } = todoSlice.actions;
export default todoSlice.reducer;