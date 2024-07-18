import React from "react"
import { Routes, Route } from "react-router-dom"

const Home = React.lazy(() => import("../Pages/Home"));
const Login = React.lazy(() => import("../Pages/Login"));
const CadastroConsumidor = React.lazy(() => import("../Pages/CadastroConsumidor"));


export const RoutesComponent = () => {
    return (
        <>
        <React.Suspense >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro_consumidor" element={<CadastroConsumidor />} />

        </Routes>
      </React.Suspense>
        </>
    )
}