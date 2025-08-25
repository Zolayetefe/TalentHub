import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white flex flex-col justify-center items-center text-center px-6 py-32">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          TalentHub
        </h1>
        <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mb-8">
          Connecting talented developers with innovative companies. Post jobs,
          apply instantly, and grow your career.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/login"
            className="bg-white text-blue-700 font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-500 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-green-600 transition"
          >
            Register
          </Link>
          <Link
            to="/jobs"
            className="bg-blue-900 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-950 transition"
          >
            Browse Jobs
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose TalentHub?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                For Job Seekers
              </h3>
              <p className="text-gray-600">
                Discover jobs, apply with one click, and track your applications in real-time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                For Employers
              </h3>
              <p className="text-gray-600">
                Post job openings, manage applicants, and hire top talent efficiently.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Fast & Efficient
              </h3>
              <p className="text-gray-600">
                Seamless hiring process with real-time updates and instant notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 text-white text-center py-16">
        <h2 className="text-3xl font-bold mb-3">
          Start your journey with TalentHub
        </h2>
        <p className="text-blue-200 mb-6">
          Find your dream job or your next great hire today.
        </p>
        <Link
          to="/jobs"
          className="bg-green-500 text-white font-medium px-8 py-4 rounded-lg shadow hover:shadow-lg hover:bg-green-600 transition"
        >
          View Jobs
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
