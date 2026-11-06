import { useNavigate } from "react-router";
import { AuthPage } from "../ui";

export function AuthScreen() {
  const navigate = useNavigate();

  // Wire onSignIn/onSignUp to the auth client when the backend flow is ready.
  return <AuthPage onGuest={() => navigate("/")} />;
}
