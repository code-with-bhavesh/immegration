import { Navigate } from "react-router";
import { useAppSelector } from "../../store/store";
import envConfig from "../../config/config";
import { Auth0Provider } from "@auth0/auth0-react";

function AuthoriuzationRoute(props: any) {
  const { children } = props;
  const { authConfig } = useAppSelector((state: any) => state.authReducer);

  return (
    <Auth0Provider
      domain={authConfig?.authData?.domain || ""}
      clientId={authConfig?.authData?.clientId || ""}
      useRefreshTokens={true}
      authorizationParams={{
        redirect_uri: envConfig.REDIRECT_URI,
        scope: "openid profile email read:current_user",
        audience: authConfig?.authData?.audience || "",
      }}
    >
      {children}
    </Auth0Provider>
  );
}

export default AuthoriuzationRoute;
