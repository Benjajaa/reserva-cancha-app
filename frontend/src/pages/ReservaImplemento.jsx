import { useAuth0 } from '@auth0/auth0-react';
import { implementos } from "../data/implementos";
import { Link } from 'react-router-dom';

const ReservaImplemento = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Debes iniciar sesión para ver los implementos.</h2>
        <button onClick={() => loginWithRedirect()}>Iniciar sesión</button>
      </div>
    );
  }
  return (
    <div style={{ padding: "20px" }}>
      <h1>Implementos Disponibles</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {implementos.map((implemento) => (
          <li key={implemento.id} style={{ marginBottom: "20px" }}>
            <div style={{ background: "#1e3a8a", padding: "10px", borderRadius: "8px" }}>
              <h2 style={{ color: "#fff" }}>{implemento.nombre}</h2>
              <Link to={`/reserva-implemento/${implemento.id}`} style={{ color: "#1e3a8a", padding: "8px 12px", borderRadius: "4px", textDecoration: "none", background: "#FFFFFF" }}>Reservar</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservaImplemento;
