import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface LogoutButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

const variantToClasses: Record<NonNullable<LogoutButtonProps["variant"]>, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-gray-700 hover:text-gray-900",
};

const LogoutButton: React.FC<LogoutButtonProps> = ({ className = "", variant = "secondary" }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onClick = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  return (
    <button onClick={onClick} className={`px-4 py-2 rounded ${variantToClasses[variant]} ${className}`}>
      Logout
    </button>
  );
};

export default LogoutButton; 