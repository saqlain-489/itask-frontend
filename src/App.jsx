import { BrowserRouter, Routes, Route, Link,Navigate } from "react-router-dom";
import './App.css'
import TodoContainer from './Todo/todo.jsx'
import Theme from "./Todo/theme.jsx"
import Inputpage from "./Todo/todoInput.jsx";
import Editpage from "./Todo/edittodo.jsx";
// import Authpage from "./Todo/authpage.jsx";
import { Toaster } from "react-hot-toast";
import Landing from "./Todo/landing Page/landing.jsx";
import SignIn from "./Todo/SignIn.jsx";
import SignUp from "./Todo/SignUp.jsx";
import Notfound from "./Todo/error404.jsx";
import Profile from "./Todo/profile.jsx";
import AdminDashboard from "./Todo/admin/admin-dashboard.jsx"; 
import AdminUsers from "./Todo/admin/AdminUsers.jsx";
import AdminTodos from "./Todo/admin/AdminTodos.jsx";






export default function App() {
  return (
    <BrowserRouter>

       <Routes>
      <Route path="/" element={<Navigate to="/iTask" />} />

      <Route path="/iTask" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path='/profile' element={<Profile />} />
      <Route path="/todo" element={<TodoContainer />} />
      <Route path="/todoinput" element={<Inputpage />} />
      <Route path="/edittodo" element={<Editpage />} />
      <Route path="admin-dashboard" element={<AdminDashboard/>} />
      <Route path="Admin-Users" element={<AdminUsers/>} />
      <Route path="Admin-Todos" element={<AdminTodos/>} />


      <Route path="*" element={<Notfound/>}/>
    </Routes>
    <Toaster position="top-right" reverseOrder={false} />
    </BrowserRouter>
    
  );
}

 