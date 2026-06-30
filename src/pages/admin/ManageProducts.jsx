import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { productApi } from '../../api/productApi'
import Navbar from '../../components/Navbar'
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiArrowLeft, FiEye } from 'react-icons/fi'

function ManageProducts() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
    }
    fetchProducts()
  }, [isAdmin, navigate])

  const fetchProducts = async () => {
    try {
      const response = await productApi.getProducts()
      setProducts(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return
    }

    setDeleteLoading(productId)
    try {
      await productApi.deleteProduct(productId)
      setMessage({ type: 'success', text: 'Product deleted successfully!' })
      
      // Remove from list
      setProducts(products.filter(p => p.id !== productId))
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to delete product' 
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  // Filter products by search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAdmin) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-8">
            <div className="text-white text-xl">Loading products...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-6 backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full transition"
        >
          <FiArrowLeft />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Products</h1>
              <p className="text-white/60">{products.length} products total</p>
            </div>
            
            <button
              onClick={() => navigate('/admin/products/add')}
              className="backdrop-blur-md bg-blue-500/30 border border-blue-400/50 text-white px-6 py-3 rounded-xl hover:bg-blue-500/40 transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <FiPlus /> Add New Product
            </button>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-400/40 text-green-300'
              : 'bg-red-500/20 border border-red-400/40 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Search Bar */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, category, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50"
            />
            <FiSearch className="absolute left-4 top-4 text-white/50" />
          </div>
        </div>

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-16 text-center shadow-2xl">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <FiSearch className="text-white/30 text-5xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {searchTerm ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-white/60 mb-6">
              {searchTerm ? 'Try a different search term' : 'Add your first product to get started!'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/admin/products/add')}
                className="backdrop-blur-md bg-blue-500/30 border border-blue-400/50 text-white px-6 py-3 rounded-xl hover:bg-blue-500/40 transition-all inline-flex items-center gap-2"
              >
                <FiPlus /> Add Product
              </button>
            )}
          </div>
        ) : (
          <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/70 font-semibold">Image</th>
                    <th className="text-left p-4 text-white/70 font-semibold">Name</th>
                    <th className="text-left p-4 text-white/70 font-semibold">Category</th>
                    <th className="text-left p-4 text-white/70 font-semibold">Price</th>
                    <th className="text-left p-4 text-white/70 font-semibold">Stock</th>
                    <th className="text-left p-4 text-white/70 font-semibold">Status</th>
                    <th className="text-center p-4 text-white/70 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      {/* Image */}
                      <td className="p-4">
                        <img
                          src={product.images?.[0]?.url || 'https://via.placeholder.com/100'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border border-white/10"
                        />
                      </td>
                      
                      {/* Name */}
                      <td className="p-4">
                        <div className="text-white font-semibold">{product.name}</div>
                        <div className="text-white/50 text-sm">{product.brand || 'No brand'}</div>
                      </td>
                      
                      {/* Category */}
                      <td className="p-4">
                        <span className="backdrop-blur-md bg-purple-500/20 border border-purple-400/40 text-purple-300 px-3 py-1 rounded-full text-sm">
                          {product.category?.name || 'No category'}
                        </span>
                      </td>
                      
                      {/* Price */}
                      <td className="p-4">
                        <div className="text-white font-semibold">${product.price}</div>
                        {product.comparePrice && (
                          <div className="text-white/50 text-sm line-through">${product.comparePrice}</div>
                        )}
                      </td>
                      
                      {/* Stock */}
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.stock > 10
                            ? 'bg-green-500/20 border border-green-400/40 text-green-300'
                            : product.stock > 0
                            ? 'bg-orange-500/20 border border-orange-400/40 text-orange-300'
                            : 'bg-red-500/20 border border-red-400/40 text-red-300'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      
                      {/* Status */}
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.isActive
                            ? 'bg-green-500/20 border border-green-400/40 text-green-300'
                            : 'bg-gray-500/20 border border-gray-400/40 text-gray-300'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* View */}
                          <button
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="backdrop-blur-md bg-blue-500/20 border border-blue-400/40 text-blue-300 p-2 rounded-lg hover:bg-blue-500/30 transition-all"
                            title="View Product"
                          >
                            <FiEye />
                          </button>
                          
                          {/* Edit */}
                          <button
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            className="backdrop-blur-md bg-green-500/20 border border-green-400/40 text-green-300 p-2 rounded-lg hover:bg-green-500/30 transition-all"
                            title="Edit Product"
                          >
                            <FiEdit2 />
                          </button>
                          
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={deleteLoading === product.id}
                            className="backdrop-blur-md bg-red-500/20 border border-red-400/40 text-red-300 p-2 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Product"
                          >
                            {deleteLoading === product.id ? '...' : <FiTrash2 />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4 p-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex gap-4 mb-4">
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/100'}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg border border-white/10"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{product.name}</h3>
                      <p className="text-white/50 text-sm mb-2">{product.category?.name}</p>
                      <div className="text-white font-bold">${product.price}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.stock > 10
                        ? 'bg-green-500/20 text-green-300'
                        : product.stock > 0
                        ? 'bg-orange-500/20 text-orange-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      Stock: {product.stock}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.isActive
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex-1 backdrop-blur-md bg-blue-500/20 border border-blue-400/40 text-blue-300 py-2 rounded-lg hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <FiEye /> View
                    </button>
                    <button
                      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                      className="flex-1 backdrop-blur-md bg-green-500/20 border border-green-400/40 text-green-300 py-2 rounded-lg hover:bg-green-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deleteLoading === product.id}
                      className="backdrop-blur-md bg-red-500/20 border border-red-400/40 text-red-300 p-2 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageProducts