import { useAuth0 } from "@auth0/auth0-react";
import { canchas } from "../data/canchas";
import { Link } from "react-router-dom";

const Canchas = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Debes iniciar sesión para ver las canchas.</h2>
        <button onClick={() => loginWithRedirect()}>Iniciar sesión</button>
      </div>
    );
  }
  return (
    <div style={{ padding: "20px" }}>
      <h1>Canchas Disponibles</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {canchas.map((cancha) => (
          <li key={cancha.id} style={{ marginBottom: "20px" }}>
            <div style={{ background: "#1e3a8a", padding: "10px", borderRadius: "8px" }}>
              <h2 style={{ color: "#fff" }}>{cancha.nombre}</h2>
              {cancha.superficie && <p style={{ color: "#fff" }}>Superficie: {cancha.superficie}</p>}
              <Link to={`/reserva/${cancha.id}`} style={{ color: "#1e3a8a", padding: "8px 12px", borderRadius: "4px", textDecoration: "none", background: "#FFFFFF" }}>Reservar</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Canchas;