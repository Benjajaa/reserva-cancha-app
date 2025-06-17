import { useAuth0 } from "../../frontend/node_modules/@auth0/auth0-react/src";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button onClick={() => loginWithRedirect()} style={styles.button}>
      Iniciar sesión
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: "#fff",
    color: "#1e3a8a",
    padding: "6px 12px",
    borderRadius: "5px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default LoginButton;
