import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() => logout({ returnTo: window.location.origin })}
      style={styles.button}
    >
      Cerrar sesión
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: "#ef4444",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "5px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default LogoutButton;

