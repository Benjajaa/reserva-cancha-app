import { useAuth0 } from '@auth0/auth0-react';

const Home = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h1>¡Bienvenido, {user.name}!</h1>
          <img src={user.picture} alt="foto" />
          <p>{user.email}</p>
        </>
      ) : (
        <p>¡Bienvenido! Por favor inicia sesión para continuar.</p>
      )}
    </div>
  );
};

export default Home;

