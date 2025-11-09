import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./Todo/AuthProvider.jsx";
import { Provider } from "react-redux";

import store from './Todo/store/store.js';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Provider store={store}>
      <StrictMode>
        <App />
      </StrictMode>
    </Provider>
  </AuthProvider>

)

