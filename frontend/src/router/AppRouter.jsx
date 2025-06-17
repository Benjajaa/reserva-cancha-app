// frontend/src/router/AppRouter.jsx (Versión Corregida)

// =====> CAMBIO 1: La importación ahora es directa desde el paquete
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "../pages/Home";
import ReservaCancha from "../pages/ReservaCancha";
import ReservaImplemento from "../pages/ReservaImplemento";
import Navbar from "../components/Navbar";
import Reserva from "../pages/Reserva";

const AppRouter = () => {
  return (
    // =====> CAMBIO 2: Se usa "BrowserRouter" en lugar de "Router"
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cancha" element={<ReservaCancha />} />
        <Route path="/implementos"element={<ReservaImplemento />} />
        <Route path="/reserva/:id" element={<Reserva />} />
      </Routes>
    </BrowserRouter> // <===== Y se cierra con el mismo nombre
  );
};

export default AppRouter;

