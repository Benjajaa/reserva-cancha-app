import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "../pages/Home";
import ReservaCancha from "../pages/ReservaCancha";
import ReservaImplemento from "../pages/ReservaImplemento";
import Navbar from "../components/Navbar";
import Reserva from "../pages/Reserva";
import ReservaImplementoDetalle from '../pages/Reserva-Implementos';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cancha" element={<ReservaCancha />} />
        <Route path="/implementos"element={<ReservaImplemento />} />
        <Route path="/reserva/:id" element={<Reserva />} />
        <Route path="/reserva-implemento/:id" element={<ReservaImplementoDetalle />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

