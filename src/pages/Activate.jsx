import { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activate } from '../api/auth.api';
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';

const Activate = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const effectRan = useRef(false);
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const activateAccount = async () => {
      try {
        await activate(token);
        setStatus('success');
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    activateAccount();
  }, [token]);

  // Auto-redirect on success
  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/login');
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center transition-all">
        
        {status === 'verifying' && (
          <div className="flex flex-col items-center animate-pulse">
            <Loader className="w-16 h-16 text-blue-600 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying...</h2>
            <p className="text-gray-500">Please wait while we activate your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Activated!</h2>
            <p className="text-gray-500 mb-6">Your account is now active. You can log in and start using the service.</p>
            <p className="text-sm text-gray-400 mb-6">Redirecting in {countdown}s...</p>
            <button 
              onClick={() => navigate('/login')} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              Go to Login <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Activation Failed</h2>
            <p className="text-gray-500 mb-6">The activation link may be invalid or has already been used.</p>
            <button 
              onClick={() => navigate('/login')} 
              className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activate;