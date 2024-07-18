import React from "react"
import { Routes, Route } from "react-router-dom"

const Home = React.lazy(() => import("../Pages/Home"));
const Login = React.lazy(() => import("../Pages/Login"));
const CadastroConsumidor = React.lazy(() => import("../Pages/CadastroConsumidor"));
const TipoCadastro = React.lazy(() => import("../Pages/TipoCadastro"));


export const RoutesComponent = () => {
    return (
        <>
        <React.Suspense >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro_consumidor" element={<CadastroConsumidor />} />
          <Route path="/tipo_cadastro" element={<TipoCadastro />} />

        </Routes>
      </React.Suspense>
        </>
    )
}