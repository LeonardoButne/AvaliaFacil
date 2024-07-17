import React from "react"
import { Routes, Route } from "react-router-dom"

const Home = React.lazy(() => import("../Pages/Home"));
const Login = React.lazy(() => import("../Pages/Login"));

export const RoutesComponent = () => {
    return (
        <>
        <React.Suspense >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </React.Suspense>
        </>
    )
}