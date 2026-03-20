import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Ordenes from "./components/Ordenes";
import GestionUsuarios from "./pages/GestionUsuarios";
import Informacion from "./pages/Informacion";
import RetiroBodega from "./pages/RetiroBodega";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/app.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* SISTEMA */}
        <Route
          path="/ordenes"
          element={
            <PrivateRoute>
              <Ordenes />
            </PrivateRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <GestionUsuarios />
            </PrivateRoute>
          }
        />

        <Route
          path="/informacion"
          element={
            <PrivateRoute>
              <Informacion />
            </PrivateRoute>
          }
        />

        <Route
          path="/retiro-bodega"
          element={
            <PrivateRoute>
              <RetiroBodega />
            </PrivateRoute>
          }
        />

        {/* CUALQUIER RUTA INVALIDA */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;