import { FiX, FiAlertTriangle, FiTrash2 } from 'react-icons/fi'

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative backdrop-blur-2xl bg-black/80 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <FiX size={24} />
        </button>

        {/* Icon */}
        <div className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center ${
          type === 'danger' 
            ? 'bg-red-500/20 border border-red-400/40' 
            : 'bg-yellow-500/20 border border-yellow-400/40'
        }`}>
          {type === 'danger' ? (
            <FiTrash2 className="text-red-400 text-2xl" />
          ) : (
            <FiAlertTriangle className="text-yellow-400 text-2xl" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <div className="text-white/70 text-center mb-6">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 backdrop-blur-md bg-white/10 border border-white/20 text-white py-3 rounded-xl hover:bg-white/20 transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              type === 'danger'
                ? 'backdrop-blur-md bg-red-500/30 border border-red-400/50 text-red-300 hover:bg-red-500/40'
                : 'backdrop-blur-md bg-yellow-500/30 border border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/40'
            }`}
          >
            {type === 'danger' ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
