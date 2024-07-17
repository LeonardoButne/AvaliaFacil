import React from "react"
import { Routes, Route } from "react-router-dom"

const Home = React.lazy(() => import("../Pages/Home"));

export const RoutesComponent = () => {
    return (
        <>
        <React.Suspense >
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </React.Suspense>
        </>
    )
}