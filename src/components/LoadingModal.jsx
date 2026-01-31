const LoadingModal = ({ isOpen, message = 'Please wait...' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
