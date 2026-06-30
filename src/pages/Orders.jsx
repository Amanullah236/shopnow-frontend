import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../api/orderApi'
import Navbar from '../components/Navbar'
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiShoppingBag, FiArrowLeft, FiTrash2 } from 'react-icons/fi'

function Orders() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    fetchOrders()
  }, [isAuthenticated, navigate])

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getMyOrders()
      setOrders(response.data || [])
      setLoading(false)
    } catch (err) {
      setError('Failed to load orders')
      setLoading(false)
    }
  }

  const handleClearOrders = async () => {
    if (!window.confirm('Are you sure you want to clear all orders?')) return
    try {
      await orderApi.clearOrders()
      setOrders([])
    } catch { alert('Failed to clear orders') }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':    return <FiClock className="text-yellow-400" />
      case 'processing': return <FiPackage className="text-blue-400" />
      case 'shipped':    return <FiTruck className="text-purple-400" />
      case 'delivered':  return <FiCheckCircle className="text-green-400" />
      case 'cancelled':  return <FiXCircle className="text-red-400" />
      default:           return <FiClock className="text-yellow-400" />
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending:    'bg-yellow-500/20 border-yellow-400/40 text-yellow-300',
      processing: 'bg-blue-500/20 border-blue-400/40 text-blue-300',
      shipped:    'bg-purple-500/20 border-purple-400/40 text-purple-300',
      delivered:  'bg-green-500/20 border-green-400/40 text-green-300',
      cancelled:  'bg-red-500/20 border-red-400/40 text-red-300',
    }
    return styles[status] || styles.pending
  }

  const formatPrice = (value) => {
    const num = parseFloat(value)
    return isNaN(num) ? '0.00' : num.toFixed(2)
  }

  if (!isAuthenticated) return null

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-8">
          <div className="text-white text-base">Loading orders...</div>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="backdrop-blur-2xl bg-red-500/20 border border-red-400/40 rounded-3xl p-8">
          <div className="text-red-300 text-base">{error}</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-3 md:px-4 py-5 md:py-8">

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-5 backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full transition text-sm"
        >
          <FiArrowLeft /> Back to Home
        </button>

        {/* Header */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-5 md:mb-8 shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              {/* ✅ text-xl mobile, text-3xl desktop */}
              <h1 className="text-xl md:text-3xl font-bold text-white mb-1">My Orders</h1>
              <p className="text-white/60 text-xs md:text-sm">Track and manage your orders</p>
            </div>
            {orders.length > 0 && (
              <button
                onClick={handleClearOrders}
                className="backdrop-blur-md bg-red-500/20 border border-red-400/40 text-red-300 px-3 py-2 md:px-4 rounded-xl hover:bg-red-500/30 transition-all font-semibold flex items-center gap-2 text-xs md:text-sm whitespace-nowrap"
              >
                <FiTrash2 /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-10 md:p-16 text-center shadow-2xl">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full w-20 h-20 md:w-32 md:h-32 mx-auto mb-5 flex items-center justify-center">
              <FiShoppingBag className="text-white/30 text-3xl md:text-5xl" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-white mb-2">No Orders Yet</h3>
            <p className="text-white/60 text-sm mb-5">Start shopping to see your orders here!</p>
            <button
              onClick={() => navigate('/products')}
              className="backdrop-blur-md bg-blue-500/30 border border-blue-400/50 text-white px-5 py-2.5 rounded-xl hover:bg-blue-500/40 transition-all font-semibold text-sm"
            >
              Start Shopping
            </button>
          </div>

        ) : (
          <div className="space-y-4 md:space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl hover:border-white/20 transition-all"
              >
                {/* Order Header */}
                <div className="p-4 md:p-6 border-b border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {/* ✅ text-base mobile, text-xl desktop */}
                        <h3 className="text-base md:text-xl font-bold text-white">{order.orderNumber}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusBadge(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                        </span>
                      </div>
                      <div className="text-white/60 text-xs">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col md:items-end items-center gap-3 md:gap-2">
                      {/* ✅ text-xl mobile, text-2xl desktop */}
                      <div className="text-xl md:text-2xl font-bold text-white">${formatPrice(order.totalPrice)}</div>
                      <div className={`text-xs font-semibold ${order.isPaid ? 'text-green-300' : 'text-yellow-300'}`}>
                        {order.isPaid ? '✓ Paid' : 'Payment Pending'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 md:p-6">
                  <h4 className="text-white font-semibold text-sm md:text-base mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex gap-3 p-3 md:p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl md:rounded-2xl">
                        <img
                          src={item.image || 'https://via.placeholder.com/100'}
                          alt={item.name}
                          className="w-14 h-14 md:w-20 md:h-20 object-cover rounded-lg border border-white/10 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-white font-semibold text-sm mb-1 truncate">{item.name}</h5>
                          <div className="text-white/60 text-xs">Qty: {item.quantity}</div>
                          <div className="text-white/60 text-xs">${formatPrice(item.price)} each</div>
                        </div>
                        <div className="text-white font-bold text-sm flex-shrink-0">${formatPrice(item.quantity * item.price)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-4 md:p-6 border-t border-white/10 bg-white/5">
                  {/* Price breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: 'Items', value: order.itemsPrice },
                      { label: 'Tax', value: order.taxPrice },
                      { label: 'Shipping', value: order.shippingPrice },
                      { label: 'Total', value: order.totalPrice, bold: true },
                    ].map(({ label, value, bold }) => (
                      <div key={label}>
                        <div className="text-white/60 text-xs mb-0.5">{label}</div>
                        <div className={`text-white text-sm ${bold ? 'font-bold' : 'font-semibold'}`}>${formatPrice(value)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="pt-4 border-t border-white/10">
                    <h5 className="text-white font-semibold text-sm mb-2">Shipping Address</h5>
                    <div className="text-white/70 text-xs space-y-0.5">
                      <p className="font-semibold text-white text-sm">{order.shippingAddress?.fullName}</p>
                      <p>{order.shippingAddress?.address}</p>
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                      <p>{order.shippingAddress?.country}</p>
                      <p className="mt-1">Phone: {order.shippingAddress?.phone}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-2 md:gap-3">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="flex-1 backdrop-blur-md bg-blue-500/20 border border-blue-400/40 text-blue-300 py-2.5 rounded-xl hover:bg-blue-500/30 transition-all font-semibold text-sm"
                    >
                      View Details
                    </button>
                    {(order.orderStatus === 'pending' || order.orderStatus === 'processing') && (
                      <button
                        onClick={async () => {
                          if (window.confirm('Cancel this order?')) {
                            try { await orderApi.cancelOrder(order.id); fetchOrders() }
                            catch { alert('Failed to cancel order') }
                          }
                        }}
                        className="flex-1 backdrop-blur-md bg-red-500/20 border border-red-400/40 text-red-300 py-2.5 rounded-xl hover:bg-red-500/30 transition-all font-semibold text-sm"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders