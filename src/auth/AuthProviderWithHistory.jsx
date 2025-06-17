import { Auth0Provider } from "@auth0/auth0-react";

const AuthProviderWithHistory = ({ children }) => {
  const domain = "dev-e3kmwnwixxg4ihnc.us.auth0.com";
  const clientId = "TBbPKbYtt3iCx49fqutoTfxv8QACg5nx";

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProviderWithHistory;
