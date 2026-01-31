import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl">
            <Cloud className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Cloud Web Drive
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Securely store, manage, and access your files from anywhere.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all"
          >
            Get Started
          </Link>

          <Link
            to="/register"
            className="px-8 py-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 rounded-xl font-semibold shadow-sm transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;