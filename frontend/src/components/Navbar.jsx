import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Reservas UCN</h2>
      <ul style={styles.navList}>
        <li><Link to="/" style={styles.link}></Link></li>
        {isAuthenticated && (
          <>
            <li><Link to="/cancha" style={styles.link}>Canchas</Link></li>
            <li><Link to="/implementos" style={styles.link}>Implementos</Link></li>
          </>
        )}
      </ul>
      <div style={styles.authSection}>
        {isAuthenticated ? (
          <>
            <span style={styles.link}>{user.name}</span>
            <img
              src={user.picture}
              alt="Perfil"
              style={styles.avatar}
            />
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e3a8a",
    padding: "10px 20px",
    color: "#fff"
  },
  logo: {
    margin: 0
  },
  navList: {
    display: "flex",
    listStyle: "none",
    gap: "20px",
    margin: 0
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold"
  },
  authSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%"
  }
};

export default Navbar;
