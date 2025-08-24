import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-semibold mb-3">TalentHub</h1>
      <p className="mb-6">Find jobs, apply quickly, and manage postings.</p>
      <div className="flex gap-3">
        <Link to="/login" className="px-4 py-2 rounded bg-blue-600 text-white">Login</Link>
        <Link to="/register" className="px-4 py-2 rounded bg-green-600 text-white">Register</Link>
      </div>
    </main>
  );
}
