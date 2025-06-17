import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // <-- CORREGIDO
import axios from "axios"; // <-- AÑADIDO
import { canchas } from "../data/canchas";
import { format, addDays, subDays, startOfWeek, getMonth, getDay } from "date-fns"; // <-- CORREGIDO
import { es } from "date-fns/locale"; // <-- CORREGIDO

// --- CONFIGURACIÓN DE LA CONEXIÓN CON EL BACKEND ---
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api-reservas-canchas.onrender.com';
const API_URL = `${API_BASE_URL}/api`;

const bloques = {
  mañana: ["8:10 am", "9:55 am", "11:40 am"],
  tarde: ["2:30 pm", "4:15 pm", "6:00 pm"]
};

const Reserva = () => {
  const { id } = useParams();
  const cancha = canchas.find((c) => c.id.toString() === id);

  const [semanaActual, setSemanaActual] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  
  // ---> NUEVO ESTADO: Guarda las horas que ya están reservadas en la BD para el día seleccionado
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  // ---> NUEVO useEffect: Se ejecuta cuando cambia la fecha para LEER las reservas de la BD
  useEffect(() => {
    const fetchReservasDelDia = async () => {
      const fechaFormato = format(fechaSeleccionada, 'yyyy-MM-dd');
      try {
        const response = await axios.get(`${API_URL}/reservas?fecha=${fechaFormato}`);
        const horas = response.data.map(reserva => reserva.hora);
        setHorasOcupadas(horas);
      } catch (error) {
        console.error("Error al obtener las reservas:", error);
        setHorasOcupadas([]);
      }
    };
    fetchReservasDelDia();
  }, [fechaSeleccionada]); // Se dispara cada vez que cambia la fecha

  if (!cancha) return <div>Cancha no encontrada</div>;

  // ---> FUNCIÓN ACTUALIZADA: Ahora guarda en la BD a través de la API
  const guardarReserva = async () => {
    if (!horaSeleccionada) {
      alert("Por favor, selecciona una hora para continuar.");
      return;
    }
    const nuevaReserva = {
      canchaId: cancha.id,
      canchaNombre: cancha.nombre,
      fecha: format(fechaSeleccionada, "yyyy-MM-dd"),
      hora: horaSeleccionada,
      usuario: "Usuario Web", // En un futuro, esto vendría de Auth0
    };

    try {
      await axios.post(`${API_URL}/reservas`, nuevaReserva);
      alert("¡Reserva creada exitosamente!");
      
      // Actualiza la UI al instante para mostrar la nueva reserva como ocupada
      setHorasOcupadas([...horasOcupadas, horaSeleccionada]);
      setHoraSeleccionada(null);

    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Error: Este horario ya se encuentra reservado. Por favor, refresca la página.");
      } else {
        console.error("Error al crear la reserva:", error);
        alert("No se pudo crear la reserva. Intenta de nuevo más tarde.");
      }
    }
  };

  const seleccionarFecha = (dia) => {
    setFechaSeleccionada(dia);
    setHoraSeleccionada(null);
  };

  const irSemanaSiguiente = () => setSemanaActual(addDays(semanaActual, 7));
  const irSemanaAnterior = () => setSemanaActual(subDays(semanaActual, 7));
  const diasDeLaSemana = Array.from({ length: 5 }, (_, i) => addDays(semanaActual, i));
  const primerDia = diasDeLaSemana[0];
  const ultimoDia = diasDeLaSemana[4];
  const mesPrimerDia = format(primerDia, "MMMM", { locale: es });
  const mesUltimoDia = format(ultimoDia, "MMMM", { locale: es });
  const tituloMes =
getMonth(primerDia) === getMonth(ultimoDia)
  ? mesPrimerDia.charAt(0).toUpperCase() + mesPrimerDia.slice(1)
  : `${mesPrimerDia.charAt(0).toUpperCase() + mesPrimerDia.slice(1)} / ${mesUltimoDia.charAt(0).toUpperCase() + mesUltimoDia.slice(1)}`;

  return (
    <div style={{ fontFamily: "sans-serif", padding: "24px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Reservar {cancha.nombre}</h2>

      
       <div>

<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>

    <h3 style={{ margin: "0", textTransform: "capitalize", fontSize: "1.2rem" }}>
      {tituloMes}
    </h3>
    <a href="#" style={{ color: "#3b82f6", textDecoration: "none" }}>Otras fechas disponibles</a>
  </div>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <button onClick={irSemanaAnterior} style={styles.arrowButton}>&#8249;</button>
    <div style={{ display: "flex", gap: "8px" }}>
      {diasDeLaSemana.map((dia) => {
        const esSeleccionado = format(dia, "yyyy-MM-dd") === format(fechaSeleccionada, "yyyy-MM-dd");
        return (
          <button
            key={dia.toString()}
            onClick={() => seleccionarFecha(dia)}
            style={{ ...styles.dateButton, ...(esSeleccionado ? styles.dateButtonSelected : {}) }}
          >
            <span style={{ fontSize: "0.8rem", textTransform: "capitalize" }}>{format(dia, "E", { locale: es })}</span>
            <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{format(dia, "dd")}</span>
          </button>
        );
      })}
    </div>
    <button onClick={irSemanaSiguiente} style={styles.arrowButton}>&#8250;</button>
  </div>
</div>

      {/* Selector de Hora (con lógica de deshabilitación actualizada) */}
      <div style={{ marginTop: "32px" }}>
        {['mañana', 'tarde'].map(periodo => (
          <div key={periodo}>
            <p style={{ margin: '24px 0 8px 0', textTransform: 'capitalize' }}>{periodo}</p>
            <div style={styles.bloqueHorario}>
              {bloques[periodo].map(hora => {
                // ---> LÓGICA DE DESHABILITACIÓN ACTUALIZADA
                const esMiercoles = getDay(fechaSeleccionada) === 3;
                const esHoraBloqueada = hora === "9:55 am";
                const estaOcupada = horasOcupadas.includes(hora);
                const estaDeshabilitado = (esMiercoles && esHoraBloqueada) || estaOcupada;

                return (
                  <button
                    key={hora}
                    onClick={() => setHoraSeleccionada(hora)}
                    disabled={estaDeshabilitado}
                    style={{
                      ...styles.timeButton,
                      ...(estaDeshabilitado ? styles.timeButtonDisabled : {}),
                      ...(hora === horaSeleccionada ? styles.timeButtonSelected : {}),
                    }}
                  >
                    {hora}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Resumen y Botón de Confirmación (sin cambios en su JSX) */}
{horaSeleccionada && (
  <div style={{ marginTop: "32px", textAlign: "center" }}>
    <div style={{ padding: "16px", backgroundColor: "#1e3a8a", borderRadius: "8px", color: "#fff" }}>
      <strong>Resumen de la reserva:</strong><br />
      {format(fechaSeleccionada, "EEEE, dd 'de' MMMM", { locale: es })} a las {horaSeleccionada}
    </div>
    <button
      onClick={guardarReserva}
      style={{
        marginTop: "16px",
        backgroundColor: "#22c55e",
        color: "white",
        padding: "12px 20px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Confirmar reserva
    </button>
  </div>
)}
    </div>
  );
};

// --- Estilos (sin cambios) ---
const styles = {
  arrowButton: {
    background: "transparent",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "0 10px"
  },

  dateButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent',
    borderRadius: '8px',
    padding: '8px',
    background: '#f3f4f6',
    color: 'black',
    cursor: 'pointer',
    width: '50px',
    height: '50px'
  },

  dateButtonSelected: {
    background: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6'
  },

  timeButtonDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    cursor: 'not-allowed',
    borderColor: '#e5e7eb'
  },

  timeButton: {
    padding: "10px 16px",
    background: "white",
    color: "black",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s, color 0.2s"
  },

  timeButtonSelected: {
    background: "#3b82f6",
    color: "white",
    border: "1px solid #3b82f6"
  },

  bloqueHorario: {
    borderTop: '1px solid #eee',
    paddingTop: '16px',
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  }
};

export default Reserva;