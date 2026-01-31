import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword, getResetPasswordInfo } from '../api/auth.api';
import { toast } from 'react-toastify';
import { Lock } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!passwordValid.test(password)) {
      toast.error('Password must be at least 8 characters and include uppercase, lowercase, and a number');
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(token, password);
      toast.success('Password has been reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  useState(() => {
    (async () => {
      try {
        const { data } = await getResetPasswordInfo(token);
        setEmail(data.email);
      } catch {
        toast.error('Invalid or expired reset link');
        navigate('/login');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-[10%] left-[30%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden relative z-10 border border-white/50">
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-6">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
               <Lock className="w-8 h-8 text-blue-600" />
             </div>
          </div>

          <p className="text-center text-sm font-semibold text-blue-600 tracking-wide mb-1">Cloud Web Drive</p>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2 tracking-tight">Set New Password</h2>
          <p className="text-center text-gray-500 mb-4 text-sm">
            Reset password for <strong>{email}</strong>
          </p>
          <p className="text-center text-gray-400 mb-8 text-xs">
            Password must be at least 8 characters and include uppercase, lowercase, and a number.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">New Password</label>
              <input 
                type="password" 
                required 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;