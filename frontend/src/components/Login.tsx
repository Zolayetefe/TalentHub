import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    
    // Redirect to the intended page or dashboard
    const redirectTo = location.state?.redirectTo || "/dashboard";
    nav(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-white">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Login</h2>
        <input 
          className="w-full border border-gray-300 p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-600" 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          className="w-full border border-gray-300 p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600" 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button 
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          style={{ backgroundColor: '#1E40AF' }}
        >
          Login
        </button>
        <p className="text-sm mt-3 text-center">
          No account? <Link to="/register" className="text-green-600 hover:text-green-700 underline transition-colors" style={{ color: '#10B981' }}>Register</Link>
        </p>
      </form>
    </div>
  );
}