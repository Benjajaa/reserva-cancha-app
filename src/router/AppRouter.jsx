import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ReservaCancha from "../pages/ReservaCancha";
import ReservaImplemento from "../pages/ReservaImplemento";
import Navbar from "../components/Navbar";
import Reserva from "../pages/Reserva";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cancha" element={<ReservaCancha />} />
        <Route path="/implementos" element={<ReservaImplemento />} />
        <Route path="/reserva/:id" element={<Reserva />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

