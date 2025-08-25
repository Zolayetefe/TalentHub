import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { Role } from "../types/types";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("applicant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name.trim(), email.toLowerCase(), password, role);
    nav("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Create account</h2>
        <input className="w-full border p-2 mb-3 rounded" placeholder="Full name" value={name}
               onChange={(e) => setName(e.target.value)} required />
        <input className="w-full border p-2 mb-3 rounded" type="email" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border p-2 mb-3 rounded" type="password" placeholder="Password (min 6)"
               value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        <select className="w-full border p-2 mb-4 rounded" value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="applicant">Applicant</option>
          <option value="employer">Employer</option>
        </select>
        <button className="w-full py-2 rounded bg-green-600 text-white">Register</button>
        <p className="text-sm mt-3 text-center">
          Have an account? <Link to="/login" className="text-blue-600 underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
