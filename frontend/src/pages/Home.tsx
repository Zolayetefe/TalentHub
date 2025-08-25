import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Briefcase, Users, Rocket } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white flex flex-col justify-center items-center text-center px-4 sm:px-6 py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-10"></div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight animate-fade-in-up">
          Welcome to TalentHub
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-3xl mb-8 animate-fade-in-up animation-delay-200">
          Connecting talented developers with innovative companies. Discover opportunities, post jobs, and build your future.
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 animate-fade-in-up animation-delay-400">
          <Link
            to="/login"
            className="bg-white text-blue-900 font-semibold px-6 sm:px-8 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            Register
          </Link>
          <Link
            to="/jobs"
            className="bg-blue-900 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-950 transition-all duration-300 transform hover:-translate-y-1"
          >
            Browse Jobs
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 text-center mb-12">
            Why Choose TalentHub?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Briefcase className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                For Job Seekers
              </h3>
              <p className="text-gray-600">
                Explore thousands of job opportunities, apply instantly, and track your applications in real-time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                For Employers
              </h3>
              <p className="text-gray-600">
                Post job openings, review top talent, and streamline your hiring process with ease.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Rocket className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                Fast & Efficient
              </h3>
              <p className="text-gray-600">
                Experience a seamless platform with real-time updates and instant notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white text-center py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Start Your Journey Today
        </h2>
        <p className="text-blue-200 max-w-2xl mx-auto mb-8">
          Whether you're seeking your dream job or looking for top talent, TalentHub is your platform for success.
        </p>
        <Link
          to="/jobs"
          className="inline-block bg-green-600 text-white font-semibold px-8 sm:px-10 py-4 rounded-lg shadow-lg hover:shadow-xl hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1"
        >
          Explore Jobs Now
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Home;