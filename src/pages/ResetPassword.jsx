import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword, getResetPasswordInfo } from '../api/auth.api';
import { toast } from 'react-toastify';
import { Lock } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const navigate = useNavigate();

  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password)
  };

  const passwordValid = Object.values(passwordRules).every(Boolean);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordValid) {
      toast.error('Password must be at least 8 characters and include uppercase, lowercase, and a number');
      return;
    }

    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, password, confirmPassword);
      toast.success('Password updated successfully. Please log in again.');
      navigate('/login');
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.msg ||
        'Reset failed. Please request a new password reset link.';

      toast.error(message);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getResetPasswordInfo(token);
        setEmail(data.email);
        setIsTokenValid(true);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || 'Your reset link is invalid or has expired. Please request a new one.'
        );
        navigate('/login');
      } finally {
        setIsCheckingToken(false);
      }
    })();
  }, [token, navigate]);

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
          <div className="mb-6">
            <p className="text-center text-gray-400 mb-3 text-xs">Password must contain:</p>
            <ul className="text-xs space-y-1 text-center">
              <li className={passwordRules.length ? 'text-green-600' : 'text-gray-400'}>• At least 8 characters</li>
              <li className={passwordRules.uppercase ? 'text-green-600' : 'text-gray-400'}>• One uppercase letter</li>
              <li className={passwordRules.lowercase ? 'text-green-600' : 'text-gray-400'}>• One lowercase letter</li>
              <li className={passwordRules.number ? 'text-green-600' : 'text-gray-400'}>• One number</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" aria-disabled={!isTokenValid || isCheckingToken}>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Confirm Password</label>
              <input 
                type="password" 
                required 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                disabled={!isTokenValid || isCheckingToken}
              />
            </div>

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
              disabled={isLoading || isCheckingToken || !isTokenValid || !passwordValid || !passwordsMatch}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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