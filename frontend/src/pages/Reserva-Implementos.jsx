import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { implementos } from "../data/implementos";
import axios from "axios";
import { format } from "date-fns";
import { useAuth0 } from '@auth0/auth0-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_URL = `${API_BASE_URL}/api`;

const ReservaImplementoDetalle = () => {
  const { id } = useParams();
  const implemento = implementos.find((i) => i.id.toString() === id);
  const { user } = useAuth0();

  const [fecha, setFecha] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [cantidad, setCantidad] = useState(1);
  const [stockDisponible, setStockDisponible] = useState(null);

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      try {
        const res = await axios.get(`${API_URL}/reservas-implementos`, {
          params: { fecha, implementoId: id }
        });

        const cantidadReservada = res.data.reduce((total, r) => total + r.cantidad, 0);
        const stockTotal = implemento.stock || 10; // Stock predeterminado
        setStockDisponible(stockTotal - cantidadReservada);
      } catch (err) {
        console.error("Error al obtener reservas:", err);
        setStockDisponible(null);
      }
    };

    fetchDisponibilidad();
  }, [fecha, id, implemento]);

  const guardarReserva = async () => {
    if (!user || !implemento) return;

    if (cantidad < 1 || cantidad > stockDisponible) {
      alert("Cantidad inválida o insuficiente stock.");
      return;
    }

    try {
      await axios.post(`${API_URL}/reservas-implementos`, {
        implementoId: implemento.id,
        implementoNombre: implemento.nombre,
        fecha,
        cantidad,
        usuario: user.name,
      });
      alert("¡Reserva creada exitosamente!");
      setCantidad(1);
    } catch (err) {
      console.error("Error al crear la reserva:", err);
      alert("Error al crear la reserva.");
    }
  };

  if (!implemento) return <div>Implemento no encontrado</div>;

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h2>Reservar {implemento.nombre}</h2>

      <div style={{ marginBottom: "16px" }}>
        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={{ marginLeft: "8px", padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>Cantidad:</label>
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          style={{ marginLeft: "8px", width: "60px", padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <strong>Stock disponible:</strong> {stockDisponible !== null ? stockDisponible : "Cargando..."}
      </div>

      <button
        onClick={guardarReserva}
        style={{
          backgroundColor: "#3b82f6",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Confirmar Reserva
      </button>
    </div>
  );
};

export default ReservaImplementoDetalle;

