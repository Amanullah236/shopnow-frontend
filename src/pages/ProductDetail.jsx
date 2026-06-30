import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../utils/CartContext'
import { useAuth } from '../context/AuthContext'
import { productApi } from '../api/productApi'
import Navbar from '../components/Navbar'
import { FiShoppingCart, FiHeart, FiArrowLeft, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WORD_LIMIT = 50

function truncateWords(text, limit) {
  if (!text) return ''
  const words = text.trim().split(/\s+/)
  if (words.length <= limit) return text
  return words.slice(0, limit).join(' ') + '...'
}

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isFavorite, setIsFavorite] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getProduct(id)
        setProduct(data.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load product')
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (product) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      setIsFavorite(favorites.includes(product.id))
    }
  }, [product])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart!', { icon: '🔒', duration: 3000 })
      setTimeout(() => navigate('/login'), 1000)
      return
    }
    setIsAdding(true)
    setTimeout(() => {
      addToCart(product, quantity)
      setIsAdding(false)
      setIsAdded(true)
      toast.success(`${product.name} added to cart!`, { icon: '🛒', duration: 2000 })
      setTimeout(() => setIsAdded(false), 2000)
    }, 500)
  }

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    if (isFavorite) {
      localStorage.setItem('favorites', JSON.stringify(favorites.filter(f => f !== product.id)))
      setIsFavorite(false)
      toast.success('Removed from favorites!', { icon: '💔', duration: 2000 })
    } else {
      localStorage.setItem('favorites', JSON.stringify([...favorites, product.id]))
      setIsFavorite(true)
      toast.success('Added to favorites!', { icon: '❤️', duration: 2000 })
    }
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setZoomPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading product...</div>
      </div>
    </div>
  )

  if (error || !product) return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400 text-xl">{error || 'Product not found'}</div>
      </div>
    </div>
  )

  const words = product.description?.trim().split(/\s+/) || []
  const isLong = words.length > WORD_LIMIT
  const displayedDesc = isLong && !descExpanded
    ? truncateWords(product.description, WORD_LIMIT)
    : product.description

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-6 backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full transition"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="relative backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-4 md:p-6">

            {/* Image */}
            <div
              className="relative overflow-hidden rounded-2xl border border-white/10"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.images?.[0]?.url || product.image || 'https://via.placeholder.com/400'}
                alt={product.name}
                className="w-full h-96 object-cover transition-transform duration-300"
                style={{
                  transform: isZooming ? 'scale(1.5)' : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                }}
              />
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <span className="text-white/50 uppercase text-xs tracking-wider">{product.category?.name || 'Category'}</span>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mt-2 mb-3">{product.name}</h1>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-yellow-400 text-sm">⭐ {product.ratings?.average || 0}</span>
                <span className="text-white/50 text-sm">({product.ratings?.count || 0} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">${product.price}</span>
                {product.comparePrice && (
                  <span className="text-white/30 line-through">${product.comparePrice}</span>
                )}
              </div>

              {/* ── Description with See More ── */}
              <div className="mb-5">
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                  {displayedDesc}
                </p>
                {isLong && (
                  <button
                    onClick={() => setDescExpanded(v => !v)}
                    className="flex items-center gap-1 mt-2 text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors"
                  >
                    {descExpanded ? (
                      <><FiChevronUp size={15} /> See Less</>
                    ) : (
                      <><FiChevronDown size={15} /> See More</>
                    )}
                  </button>
                )}
              </div>

              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-2 backdrop-blur-md bg-green-500/20 border border-green-400/40 text-green-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 self-start">
                  <FiCheck /> In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 backdrop-blur-md bg-red-500/20 border border-red-400/40 text-red-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 self-start">
                  Out of Stock
                </span>
              )}

              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-white/70 font-semibold">Quantity:</span>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">-</button>
                  <span className="text-white text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">+</button>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || isAdded || product.stock === 0}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${isAdded
                      ? 'bg-green-500/30 border border-green-400/50 text-green-300'
                      : product.stock === 0
                        ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                        : 'bg-blue-500/30 border border-blue-400/50 text-white hover:bg-blue-500/40'
                    }`}
                >
                  {isAdded ? <FiCheck /> : <FiShoppingCart />}
                  {isAdded ? 'Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleToggleFavorite}
                  className={`px-5 py-3 rounded-xl font-bold transition-all ${isFavorite
                      ? 'bg-red-500/30 border border-red-400/50 text-red-300'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    }`}
                >
                  <FiHeart fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              {(product.brand || product.sku) && (
                <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                  {product.brand && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/50">Brand:</span>
                      <span className="text-white font-semibold">{product.brand}</span>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/50">SKU:</span>
                      <span className="text-white font-semibold">{product.sku}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail