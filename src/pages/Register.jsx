import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register as registerApi } from '../api/auth.api';
import { toast } from 'react-toastify';

import { Cloud } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const passwordRules = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password)
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerApi(formData);
      toast.success('Activation link sent! Please check your email.');
      setFormData({ firstName: '', lastName: '', email: '', password: '' });
      setEmailSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute top-0 left-0 w-[40%] h-[60%] rounded-full bg-indigo-100/50 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden relative z-10 border border-white/50">
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
              <Cloud className="w-8 h-8 text-white" />
            </div>
          </div>

          <p className="text-center text-sm font-semibold text-blue-600 tracking-wide mb-1">Cloud Web Drive</p>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2 tracking-tight">Create Account</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">Start your secure cloud journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2 space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">First Name</label>
                <input 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  required 
                  placeholder="John"
                  value={formData.firstName} 
                  onChange={e => setFormData({...formData, firstName: e.target.value})} 
                />
              </div>
              <div className="w-1/2 space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Last Name</label>
                <input 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  required 
                  placeholder="Doe"
                  value={formData.lastName} 
                  onChange={e => setFormData({...formData, lastName: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
              <input 
                type="email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                required 
                placeholder="john@example.com"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
            
            <div className="space-y-3 relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
              <input 
                type="password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                required 
                placeholder="Min. 8 characters"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />

              <ul className="text-xs space-y-1 mt-2">
                <li className={passwordRules.length ? 'text-green-600' : 'text-gray-400'}>• At least 8 characters</li>
                <li className={passwordRules.uppercase ? 'text-green-600' : 'text-gray-400'}>• One uppercase letter</li>
                <li className={passwordRules.lowercase ? 'text-green-600' : 'text-gray-400'}>• One lowercase letter</li>
                <li className={passwordRules.number ? 'text-green-600' : 'text-gray-400'}>• One number</li>
              </ul>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !isPasswordValid}
              className="w-full py-3.5 px-4 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : 'Sign Up'}
            </button>
          </form>
          
          {emailSent && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Didn’t receive the email? Please check your <strong>Spam / Junk</strong> folder. It may take a few minutes to arrive.
            </div>
          )}

          <div className="mt-8 text-center">
            <span className="text-gray-500 text-sm">Already have an account? </span>
            <Link to="/login" className="text-blue-600 hover:text-indigo-600 font-bold text-sm transition-colors">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;