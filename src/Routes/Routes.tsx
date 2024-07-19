import React from "react"
import { Routes, Route } from "react-router-dom"

const Home = React.lazy(() => import("../Pages/Home"));
const Login = React.lazy(() => import("../Pages/Login"));
const CadastroConsumidor = React.lazy(() => import("../Pages/CadastroConsumidor"));
const CadastroEcommerce = React.lazy(() => import("../Pages/CadastroEcommerce"));

const TipoCadastro = React.lazy(() => import("../Pages/TipoCadastro"));
const PerfilEcommerce = React.lazy(() => import("../Pages/PerfilEcommerce"));
const EcommerceDashboard = React.lazy(() => import("../Pages/EcommerceDashboard"));



export const RoutesComponent = () => {
    return (
        <>
        <React.Suspense >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro_consumidor" element={<CadastroConsumidor />} />
          <Route path="/cadastro_ecommerce" element={<CadastroEcommerce />} />
          <Route path="/tipo_cadastro" element={<TipoCadastro />} />
          <Route path="/perfil/:ecommerce_id" element={<PerfilEcommerce />} />
          <Route path="/dashboard" element={<EcommerceDashboard />} />

        </Routes>
      </React.Suspense>
        </>
    )
}