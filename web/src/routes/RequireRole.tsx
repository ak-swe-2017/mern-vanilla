import { Navigate } from "react-router-dom";
import { useAuth } from "../auth";
export default function RequireRole({
  role,
  children,
}: {
  role: "admin" | "user";
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
