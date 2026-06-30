import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-8">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check admin access
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute