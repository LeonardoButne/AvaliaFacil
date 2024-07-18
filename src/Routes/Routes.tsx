import React from "react"
import { Routes, Route } from "react-router-dom"

const Home = React.lazy(() => import("../Pages/Home"));
const Login = React.lazy(() => import("../Pages/Login"));
const CadastroConsumidor = React.lazy(() => import("../Pages/CadastroConsumidor"));
const TipoCadastro = React.lazy(() => import("../Pages/TipoCadastro"));
const PerfilEcommerce = React.lazy(() => import("../Pages/PerfilEcommerce"));


export const RoutesComponent = () => {
    return (
        <>
        <React.Suspense >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro_consumidor" element={<CadastroConsumidor />} />
          <Route path="/tipo_cadastro" element={<TipoCadastro />} />
          <Route path="/perfil/:ecommerce_id" element={<PerfilEcommerce />} />

        </Routes>
      </React.Suspense>
        </>
    )
}