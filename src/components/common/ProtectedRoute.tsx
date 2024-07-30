import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthSetup } from "../../hooks/useAuthSetup";
import Loader from "./Loader";

// 로그인 상태를 확인하고 로그인이 되어 있지 않다면 위치와 함께 로그인 페이지로 이동
export const ProtectedRoute = () => {
  const { isLogged, isChecking } = useAuthSetup();
  const location = useLocation();

  if (isChecking) return <Loader />;
  if (!isLogged) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};
