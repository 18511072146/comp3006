import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'virtual:uno.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HotelPage from './pages/hotel.tsx'
import LoginPage from './pages/login.tsx'
import SignUpPage from './pages/signup.tsx'
import ManageHotelPage from './pages/manageHotel.tsx'
import Chat from './components/chat.tsx'

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/hotel/:hotelId", element: <HotelPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/hotel/manage", element: <ManageHotelPage /> },
  { path: "/chat", element: <Chat /> }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
