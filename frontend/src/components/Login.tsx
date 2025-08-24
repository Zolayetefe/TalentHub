import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    nav("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input className="w-full border p-2 mb-3 rounded" type="email" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border p-2 mb-4 rounded" type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full py-2 rounded bg-blue-600 text-white">Login</button>
        <p className="text-sm mt-3 text-center">
          No account? <Link to="/register" className="text-blue-600 underline">Register</Link>
        </p>
      </form>
    </div>
  );
}
