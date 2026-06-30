import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { orderApi } from '../../api/orderApi'
import Navbar from '../../components/Navbar'
import ConfirmModal from '../../components/ConfirmModal'
import toast from 'react-hot-toast'
import {
  FiArrowLeft, FiSearch, FiEye, FiPackage, FiTruck,
  FiCheckCircle, FiXCircle, FiClock, FiFilter, FiTrash2
} from 'react-icons/fi'

function ManageOrders() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [updateLoading, setUpdateLoading] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    if (!isAdmin) navigate('/')
    fetchOrders()
  }, [isAdmin, navigate])

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getAllOrders()
      setOrders(response.data || [])
      setLoading(false)
    } catch (error) {
      toast.error('Failed to load orders')
      setLoading(false)
    }
  }

  const handleClearAllOrders = async () => {
    if (!window.confirm('Clear orders view?')) return
    setOrders([])
    toast.success('Orders view cleared!')
  }

  const handleStatusChange = (order) => {
    setSelectedOrder(order)
    setNewStatus(order.orderStatus)
    setShowStatusModal(true)
  }

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return
    setUpdateLoading(selectedOrder.id)
    const loadingToast = toast.loading('Updating...')
    try {
      await orderApi.updateOrderStatus(selectedOrder.id, { orderStatus: newStatus })
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, orderStatus: newStatus } : o))
      toast.success('Status updated!', { id: loadingToast })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed', { id: loadingToast })
    } finally {
      setUpdateLoading(null)
      setSelectedOrder(null)
      setShowStatusModal(false)
    }
  }

  const getStatusBadge = (status) => ({
    pending: 'bg-yellow-500/20 border-yellow-400/40 text-yellow-300',
    processing: 'bg-blue-500/20 border-blue-400/40 text-blue-300',
    shipped: 'bg-purple-500/20 border-purple-400/40 text-purple-300',
    delivered: 'bg-green-500/20 border-green-400/40 text-green-300',
    cancelled: 'bg-red-500/20 border-red-400/40 text-red-300',
  }[status] || 'bg-yellow-500/20 border-yellow-400/40 text-yellow-300')

  const getStatusIcon = (status) => ({
    pending: <FiClock />, processing: <FiPackage />,
    shipped: <FiTruck />, delivered: <FiCheckCircle />, cancelled: <FiXCircle />,
  }[status] || <FiClock />)

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch && (filterStatus === 'all' || order.orderStatus === filterStatus)
  })

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    processing: orders.filter(o => o.orderStatus === 'processing').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
  }

  if (!isAdmin) return null

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

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />

      <ConfirmModal
        isOpen={showStatusModal}
        onClose={() => { setShowStatusModal(false); setSelectedOrder(null) }}
        onConfirm={handleStatusUpdate}
        title="Update Order Status"
        message={
          <div className="space-y-3 text-left">
            <p className="text-white/70 text-sm">Order: <span className="text-white font-semibold">{selectedOrder?.orderNumber}</span></p>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">New Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white focus:outline-none text-sm">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                  <option key={s} value={s} className="bg-gray-900 capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        }
        type="warning"
      />

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-5 md:py-8">

        <button onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-5 backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full transition text-sm">
          <FiArrowLeft /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-8 shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white mb-0.5">Manage Orders</h1>
              <p className="text-white/60 text-xs md:text-sm">{orders.length} orders total</p>
            </div>
            {orders.length > 0 && (
              <button onClick={handleClearAllOrders}
                className="backdrop-blur-md bg-red-500/20 border border-red-400/40 text-red-300 px-3 py-2 rounded-xl hover:bg-red-500/30 transition-all font-semibold flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
                <FiTrash2 /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mb-4 md:mb-8">
          {[
            { label: 'Total', value: stats.total, cls: 'bg-black/40 border-white/10', val: 'text-white' },
            { label: 'Pending', value: stats.pending, cls: 'bg-yellow-500/10 border-yellow-400/30', val: 'text-yellow-300' },
            { label: 'Processing', value: stats.processing, cls: 'bg-blue-500/10 border-blue-400/30', val: 'text-blue-300' },
            { label: 'Shipped', value: stats.shipped, cls: 'bg-purple-500/10 border-purple-400/30', val: 'text-purple-300' },
            { label: 'Delivered', value: stats.delivered, cls: 'bg-green-500/10 border-green-400/30', val: 'text-green-300' },
            { label: 'Cancelled', value: stats.cancelled, cls: 'bg-red-500/10 border-red-400/30', val: 'text-red-300' },
          ].map(({ label, value, cls, val }) => (
            <div key={label} className={`backdrop-blur-2xl border rounded-xl p-3 md:p-4 ${cls}`}>
              <div className="text-white/60 text-xs mb-0.5">{label}</div>
              <div className={`text-lg md:text-2xl font-bold ${val}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2.5 pl-10 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 text-sm" />
              <FiSearch className="absolute left-3 top-3 text-white/50" size={14} />
            </div>
            <div className="relative">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2.5 pl-10 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white focus:outline-none appearance-none text-sm">
                <option value="all" className="bg-gray-900">All Orders</option>
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                  <option key={s} value={s} className="bg-gray-900 capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <FiFilter className="absolute left-3 top-3 text-white/50" size={14} />
            </div>
          </div>
        </div>

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-10 md:p-16 text-center shadow-2xl">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full w-20 h-20 md:w-32 md:h-32 mx-auto mb-5 flex items-center justify-center">
              <FiPackage className="text-white/30 text-3xl md:text-5xl" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-white mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-white/60 text-sm">
              {searchTerm || filterStatus !== 'all' ? 'Try different search or filter' : 'Orders will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl hover:border-white/20 transition-all">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base md:text-xl font-bold text-white">{order.orderNumber}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusBadge(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                        </span>
                      </div>
                      <div className="text-white/60 text-xs">
                        <span className="font-semibold text-white">{order.user?.name}</span>
                        <span className="mx-1">•</span>
                        {order.user?.email}
                      </div>
                      <div className="text-white/50 text-xs mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="backdrop-blur-md bg-blue-500/20 border border-blue-400/40 text-blue-300 px-3 py-2 rounded-xl hover:bg-blue-500/30 transition-all flex items-center gap-1.5 font-semibold text-xs md:text-sm">
                        <FiEye size={13} /> View
                      </button>
                      <button onClick={() => handleStatusChange(order)} disabled={updateLoading === order.id}
                        className="backdrop-blur-md bg-green-500/20 border border-green-400/40 text-green-300 px-3 py-2 rounded-xl hover:bg-green-500/30 transition-all flex items-center gap-1.5 font-semibold text-xs md:text-sm disabled:opacity-50">
                        <FiPackage size={13} /> {updateLoading === order.id ? '...' : 'Status'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-white/10">
                    {[
                      { label: 'Items', value: `${order.items?.length || 0} items` },
                      { label: 'Total', value: `$${order.totalPrice}`, bold: true },
                      { label: 'Payment', value: order.paymentMethod },
                      { label: 'Paid', value: order.isPaid ? '✓ Paid' : 'Pending', color: order.isPaid ? 'text-green-300' : 'text-yellow-300' },
                    ].map(({ label, value, bold, color }) => (
                      <div key={label}>
                        <div className="text-white/60 text-xs mb-0.5">{label}</div>
                        <div className={`text-sm font-semibold capitalize ${bold ? 'text-white font-bold' : ''} ${color || 'text-white'}`}>{value}</div>
                      </div>
                    ))}
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

export default ManageOrders