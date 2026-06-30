import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { productApi } from '../../api/productApi'
import { categoryApi } from '../../api/categoryApi'
import Navbar from '../../components/Navbar'
import { FiArrowLeft, FiUpload } from 'react-icons/fi'

const INPUT = "w-full px-3 py-2.5 md:px-4 md:py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 text-sm md:text-base"
const LABEL = "block text-white/70 text-sm mb-1.5"

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [message, setMessage] = useState({ type: '', text: '' })

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', comparePrice: '',
    categoryId: '', stock: '', sku: '', brand: '',
    imageUrl: '', isFeatured: false, isActive: true,
  })

  useEffect(() => {
    if (!isAdmin) navigate('/')
    fetchCategories()
    fetchProduct()
  }, [isAdmin, navigate, id])

  const fetchCategories = async () => {
    try { const r = await categoryApi.getCategories(); setCategories(r.data) }
    catch (e) { console.error(e) }
  }

  const fetchProduct = async () => {
    try {
      const r = await productApi.getProduct(id)
      const p = r.data
      setFormData({
        name: p.name || '', description: p.description || '',
        price: p.price || '', comparePrice: p.comparePrice || '',
        categoryId: p.categoryId || '', stock: p.stock || '',
        sku: p.sku || '', brand: p.brand || '',
        imageUrl: p.images?.[0]?.url || '',
        isFeatured: p.isFeatured || false,
        isActive: p.isActive !== undefined ? p.isActive : true,
      })
      setFetchLoading(false)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load product' })
      setFetchLoading(false)
    }
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
      await productApi.updateProduct(id, {
        name: formData.name, slug,
        description: formData.description,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        categoryId: formData.categoryId,
        stock: parseInt(formData.stock),
        sku: formData.sku, brand: formData.brand,
        images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
        isFeatured: formData.isFeatured, isActive: formData.isActive,
      })
      setMessage({ type: 'success', text: 'Product updated successfully!' })
      setTimeout(() => navigate('/admin/products'), 2000)
    } catch (e) {
      setMessage({ type: 'error', text: e.response?.data?.message || 'Failed to update product' })
    } finally { setLoading(false) }
  }

  if (!isAdmin) return null

  if (fetchLoading) return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-8">
          <div className="text-white text-base">Loading product...</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-5 md:py-8">

        <button onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-5 backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full transition text-sm">
          <FiArrowLeft /> Back to Products
        </button>

        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl">
          <h1 className="text-xl md:text-3xl font-bold text-white mb-5">Edit Product</h1>

          {message.text && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-500/20 border border-green-400/40 text-green-300' : 'bg-red-500/20 border border-red-400/40 text-red-300'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className={LABEL}>Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className={INPUT} />
            </div>

            <div>
              <label className={LABEL}>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className={INPUT} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Price ($) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" min="0" className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Compare Price ($)</label>
                <input type="number" name="comparePrice" value={formData.comparePrice} onChange={handleChange} step="0.01" min="0" className={INPUT} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Category *</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className={INPUT}>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id} className="bg-gray-900">{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Stock *</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" className={INPUT} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>SKU</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} className={INPUT} />
              </div>
            </div>

            <div>
              <label className={LABEL}>Image URL</label>
              <div className="relative">
                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={INPUT + " pl-10"} />
                <FiUpload className="absolute left-3 top-3 text-white/50" size={14} />
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'isFeatured', id: 'isFeatured', label: 'Mark as Featured Product', checked: formData.isFeatured },
                { name: 'isActive', id: 'isActive', label: 'Product is Active', checked: formData.isActive },
              ].map(({ name, id, label, checked }) => (
                <div key={id} className="flex items-center gap-3">
                  <input type="checkbox" name={name} id={id} checked={checked} onChange={handleChange} className="w-4 h-4 rounded border-white/20 bg-white/10" />
                  <label htmlFor={id} className="text-white/70 text-sm">{label}</label>
                </div>
              ))}
            </div>

            <button type="submit" disabled={loading}
              className={`w-full py-2.5 md:py-3 rounded-xl font-semibold transition-all text-sm md:text-base ${loading ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'backdrop-blur-md bg-blue-500/30 border border-blue-400/50 text-white hover:bg-blue-500/40'}`}>
              {loading ? 'Updating...' : 'Update Product'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProduct