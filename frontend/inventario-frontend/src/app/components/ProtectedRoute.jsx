// components/ProtectedRoute.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // si no hay token, redirige a login
    }
  }, []);

  return <>{children}</>;
}
