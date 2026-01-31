import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth.api';
import { toast } from 'react-toastify';
import { KeyRound, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      toast.success('If an account exists, a reset link has been sent.');
      setEmail('');
      setEmailSent(true);
    } catch (error) {
      toast.error('Request failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-[10%] left-[30%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden relative z-10 border border-white/50">
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2 tracking-tight">Forgot Password?</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
              <input 
                type="email" 
                required 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !isEmailValid}
              className="w-full py-3.5 px-4 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold shadow-lg shadow-gray-400/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>

          {emailSent && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Didn’t receive the email? Please check your <strong>Spam / Junk</strong> folder. It may take a few minutes to arrive.
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;