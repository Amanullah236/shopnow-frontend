import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import { productApi } from '../../api/productApi'
import { categoryApi } from '../../api/categoryApi'
import { FiArrowLeft, FiUpload } from 'react-icons/fi'

// Shared input class
const INPUT = "w-full px-3 py-2.5 md:px-4 md:py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 text-sm md:text-base"
const LABEL = "block text-white/70 text-sm mb-1.5"

function AddProduct() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [message, setMessage] = useState({ type: '', text: '' })

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', comparePrice: '',
    categoryId: '', stock: '', sku: '', brand: '',
    imageUrl: '', isFeatured: false,
  })

  useEffect(() => {
    if (!isAdmin) navigate('/')
    fetchCategories()
  }, [isAdmin, navigate])

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getCategories()
      setCategories(response.data)
    } catch (error) { console.error(error) }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      await productApi.createProduct({
        name: formData.name, slug,
        description: formData.description,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        categoryId: formData.categoryId,
        stock: parseInt(formData.stock),
        sku: formData.sku, brand: formData.brand,
        images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
        isFeatured: formData.isFeatured, isActive: true,
        ratings: { average: 0, count: 0 },
      })
      setMessage({ type: 'success', text: 'Product created successfully!' })
      setFormData({ name: '', description: '', price: '', comparePrice: '', categoryId: '', stock: '', sku: '', brand: '', imageUrl: '', isFeatured: false })
      setTimeout(() => navigate('/products'), 2000)
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create product' })
    } finally { setLoading(false) }
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-5 md:py-8">

        <button onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-5 backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full transition text-sm">
          <FiArrowLeft /> Back to Dashboard
        </button>

        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl">
          <h1 className="text-xl md:text-3xl font-bold text-white mb-5">Add New Product</h1>

          {message.text && (
            <div className={`mb-5 p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-500/20 border border-green-400/40 text-green-300' : 'bg-red-500/20 border border-red-400/40 text-red-300'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">

            <div>
              <label className={LABEL}>Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className={INPUT} placeholder="e.g. Wireless Headphones" />
            </div>

            <div>
              <label className={LABEL}>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className={INPUT} placeholder="Product description..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className={LABEL}>Price ($) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" min="0" className={INPUT} placeholder="89.99" />
              </div>
              <div>
                <label className={LABEL}>Compare Price ($)</label>
                <input type="number" name="comparePrice" value={formData.comparePrice} onChange={handleChange} step="0.01" min="0" className={INPUT} placeholder="129.99" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className={LABEL}>Category *</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className={INPUT}>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id} className="bg-gray-900">{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Stock Quantity *</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" className={INPUT} placeholder="50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className={LABEL}>SKU</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} className={INPUT} placeholder="WH-001" />
              </div>
              <div>
                <label className={LABEL}>Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} className={INPUT} placeholder="TechSound" />
              </div>
            </div>

            <div>
              <label className={LABEL}>Image URL</label>
              <div className="relative">
                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={INPUT + " pl-10"} placeholder="https://images.unsplash.com/..." />
                <FiUpload className="absolute left-3 top-3 text-white/50" size={14} />
              </div>
              <p className="text-white/40 text-xs mt-1.5">
                📌 Use Unsplash: <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">unsplash.com</a>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" name="isFeatured" id="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 rounded border-white/20 bg-white/10" />
              <label htmlFor="isFeatured" className="text-white/70 text-sm">Mark as Featured Product</label>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full py-2.5 md:py-3 rounded-xl font-semibold transition-all text-sm md:text-base ${loading ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'backdrop-blur-md bg-blue-500/30 border border-blue-400/50 text-white hover:bg-blue-500/40'}`}>
              {loading ? 'Creating...' : 'Create Product'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProduct