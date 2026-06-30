import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiPlus } from 'react-icons/fi'

function AdminDashboard() {
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [stats] = useState({
    totalProducts: 15,
    totalOrders: 48,
    totalUsers: 127,
    totalRevenue: 12450,
  })

  useEffect(() => {
    if (!isAdmin) navigate('/')
  }, [isAdmin, navigate])

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-5 md:py-8">

        {/* Header */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-5 md:mb-8 shadow-2xl">
          <h1 className="text-xl md:text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-white/60 text-sm">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-5 md:mb-8">
          {[
            { icon: <FiPackage className="text-blue-400 text-lg md:text-2xl" />, color: 'blue', value: stats.totalProducts, label: 'Products' },
            { icon: <FiShoppingBag className="text-green-400 text-lg md:text-2xl" />, color: 'green', value: stats.totalOrders, label: 'Orders' },
            { icon: <FiUsers className="text-purple-400 text-lg md:text-2xl" />, color: 'purple', value: stats.totalUsers, label: 'Users' },
            { icon: <FiDollarSign className="text-yellow-400 text-lg md:text-2xl" />, color: 'yellow', value: `$${stats.totalRevenue}`, label: 'Revenue' },
          ].map(({ icon, color, value, label }) => (
            <div key={label} className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`backdrop-blur-md bg-${color}-500/20 border border-${color}-400/40 p-2 md:p-3 rounded-lg md:rounded-xl`}>
                  {icon}
                </div>
                <span className="text-white/60 text-xs">Total</span>
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-white mb-0.5">{value}</h3>
              <p className="text-white/60 text-xs md:text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl">
          <h2 className="text-base md:text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { label: 'Add Product', path: '/admin/products/add', color: 'blue', icon: <FiPlus className="text-lg md:text-2xl" /> },
              { label: 'Manage Products', path: '/admin/products', color: 'purple', icon: <FiPackage className="text-lg md:text-2xl" /> },
              { label: 'Manage Orders', path: '/admin/orders', color: 'green', icon: <FiShoppingBag className="text-lg md:text-2xl" /> },
            ].map(({ label, path, color, icon }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`backdrop-blur-md bg-${color}-500/30 border border-${color}-400/50 text-white p-4 md:p-6 rounded-xl md:rounded-2xl hover:bg-${color}-500/40 hover:scale-105 transition-all flex items-center justify-center gap-3`}
              >
                {icon}
                <span className="font-semibold text-sm md:text-base">{label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard