import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice";
import todoReducer from './todoslice';
import adminReducer from './adminslice'



export const store = configureStore({
    reducer: {
        auth: authReducer,
        todos: todoReducer,
        admin: adminReducer
    },
});

export default store;
