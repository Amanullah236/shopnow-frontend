import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../api/orderApi'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'
import {
  FiArrowLeft, FiPackage, FiTruck, FiCheckCircle,
  FiXCircle, FiClock, FiMapPin, FiCreditCard
} from 'react-icons/fi'

function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    fetchOrder()
  }, [isAuthenticated, navigate, id])

  const fetchOrder = async () => {
    try {
      const response = await orderApi.getOrder(id)
      setOrder(response.data)
      setLoading(false)
    } catch (error) {
      toast.error('Failed to load order')
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    setCancelLoading(true)
    const loadingToast = toast.loading('Cancelling order...')
    try {
      await orderApi.cancelOrder(id)
      toast.success('Order cancelled successfully!', { id: loadingToast })
      fetchOrder()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order', { id: loadingToast })
    } finally {
      setCancelLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FiClock className="text-yellow-400" />,
      processing: <FiPackage className="text-blue-400" />,
      shipped: <FiTruck className="text-purple-400" />,
      delivered: <FiCheckCircle className="text-green-400" />,
      cancelled: <FiXCircle className="text-red-400" />,
    }
    return icons[status] || <FiClock />
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 border-yellow-400/40 text-yellow-300',
      processing: 'bg-blue-500/20 border-blue-400/40 text-blue-300',
      shipped: 'bg-purple-500/20 border-purple-400/40 text-purple-300',
      delivered: 'bg-green-500/20 border-green-400/40 text-green-300',
      cancelled: 'bg-red-500/20 border-red-400/40 text-red-300',
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
          <div className="text-white text-base">Loading order...</div>
        </div>
      </div>
    </div>
  )

  if (!order) return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-6 text-center">
          <div className="text-white text-base mb-4">Order not found</div>
          <button
            onClick={() => navigate('/orders')}
            className="backdrop-blur-md bg-blue-500/30 border border-blue-400/50 text-white px-5 py-2.5 rounded-xl hover:bg-blue-500/40 transition-all text-sm font-semibold"
          >
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-3 md:px-4 py-5 md:py-8">

        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-5 backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full transition text-sm"
        >
          <FiArrowLeft /> Back to My Orders
        </button>

        {/* Order Header */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-5 md:mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {/* ✅ text-lg mobile → text-3xl desktop */}
                <h1 className="text-lg md:text-3xl font-bold text-white">{order.orderNumber}</h1>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusBadge(order.orderStatus)}`}>
                  {getStatusIcon(order.orderStatus)}
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
              </div>
              <p className="text-white/60 text-xs md:text-sm">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>

            {(order.orderStatus === 'pending' || order.orderStatus === 'processing') && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="backdrop-blur-md bg-red-500/20 border border-red-400/40 text-red-300 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm self-start md:self-auto"
              >
                {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5 md:space-y-8">

            {/* Order Items */}
            <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl">
              {/* ✅ text-base mobile → text-2xl desktop */}
              <h2 className="text-base md:text-2xl font-bold text-white mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-3 p-3 md:p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl md:rounded-2xl">
                    <img
                      src={item.image || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="w-14 h-14 md:w-20 md:h-20 object-cover rounded-lg border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm mb-1 truncate">{item.name}</h3>
                      <div className="text-white/60 text-xs">Qty: {item.quantity}</div>
                      <div className="text-white/60 text-xs">${formatPrice(item.price)} each</div>
                    </div>
                    <div className="text-white font-bold text-sm shrink-0">
                      ${formatPrice(item.quantity * item.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl">
              <h2 className="text-base md:text-2xl font-bold text-white mb-4">Order Status</h2>
              <div className="space-y-3 md:space-y-4">

                {[
                  {
                    key: 'pending',
                    active: true,
                    color: 'yellow',
                    icon: <FiClock size={16} />,
                    label: 'Order Placed',
                    sub: new Date(order.createdAt).toLocaleString(),
                  },
                  {
                    key: 'processing',
                    active: ['processing', 'shipped', 'delivered'].includes(order.orderStatus),
                    color: 'blue',
                    icon: <FiPackage size={16} />,
                    label: 'Processing',
                    sub: 'Your order is being prepared',
                  },
                  {
                    key: 'shipped',
                    active: ['shipped', 'delivered'].includes(order.orderStatus),
                    color: 'purple',
                    icon: <FiTruck size={16} />,
                    label: 'Shipped',
                    sub: 'Order is on the way',
                  },
                  {
                    key: 'delivered',
                    active: order.orderStatus === 'delivered',
                    color: 'green',
                    icon: <FiCheckCircle size={16} />,
                    label: 'Delivered',
                    sub: order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : 'Pending delivery',
                  },
                ].map(({ key, active, color, icon, label, sub }) => (
                  <div key={key} className={`flex items-center gap-3 ${active ? `text-${color}-300` : 'text-white/30'}`}>
                    <div className={`w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 ${active ? `bg-${color}-500/20 border-2 border-${color}-400` : 'bg-white/5 border border-white/10'}`}>
                      {icon}
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base">{label}</div>
                      <div className="text-xs text-white/50">{sub}</div>
                    </div>
                  </div>
                ))}

                {order.orderStatus === 'cancelled' && (
                  <div className="flex items-center gap-3 text-red-300">
                    <div className="w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-red-500/20 border-2 border-red-400 shrink-0">
                      <FiXCircle size={16} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base">Order Cancelled</div>
                      <div className="text-xs text-white/50">This order has been cancelled</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <FiMapPin className="text-blue-400" />
                <h2 className="text-base md:text-2xl font-bold text-white">Shipping Address</h2>
              </div>
              <div className="text-white/70 text-sm space-y-0.5">
                <p className="font-semibold text-white">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                <p>{order.shippingAddress?.country}</p>
                <p className="mt-1.5">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5 md:space-y-8">

            {/* Payment Info */}
            <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <FiCreditCard className="text-green-400" />
                <h2 className="text-base md:text-xl font-bold text-white">Payment</h2>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Method:</span>
                  <span className="text-white font-semibold capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Status:</span>
                  <span className={`font-semibold ${order.isPaid ? 'text-green-300' : 'text-yellow-300'}`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                {order.isPaid && order.paidAt && (
                  <div className="text-white/50 text-xs">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl">
              <h2 className="text-base md:text-xl font-bold text-white mb-3">Order Summary</h2>
              <div className="space-y-2.5">
                {[
                  { label: 'Items Price', value: order.itemsPrice },
                  { label: 'Tax', value: order.taxPrice },
                  { label: 'Shipping', value: order.shippingPrice },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-white/70 text-sm">
                    <span>{label}:</span>
                    <span className="text-white">${formatPrice(value)}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-2.5 flex justify-between font-bold">
                  <span className="text-white text-sm md:text-base">Total:</span>
                  <span className="text-white text-sm md:text-lg">${formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="backdrop-blur-2xl bg-blue-500/10 border border-blue-400/30 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl">
              <h3 className="text-sm md:text-lg font-bold text-white mb-1.5">Need Help?</h3>
              <p className="text-white/70 text-xs mb-3">
                Contact our support team if you have any questions about your order.
              </p>
              <button className="w-full backdrop-blur-md bg-blue-500/20 border border-blue-400/40 text-blue-300 py-2 rounded-xl hover:bg-blue-500/30 transition-all font-semibold text-sm">
                Contact Support
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail