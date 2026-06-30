import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../utils/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const CARD_STYLES = `
  .pc-root {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1),
                box-shadow 0.25s cubic-bezier(0.4,0,0.2,1),
                border-color 0.25s ease;
    cursor: pointer;
  }
  .pc-root:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.25);
    border-color: rgba(139,92,246,0.35);
  }

  /* Image */
  .pc-img-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    background: rgba(0,0,0,0.3);
  }
  .pc-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
    display: block;
  }
  .pc-root:hover .pc-img { transform: scale(1.06); }

  .pc-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.55) 100%);
    transition: opacity 0.25s ease;
  }

  /* Fav btn */
  .pc-fav {
    position: absolute; top: 8px; right: 8px;
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.55);
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
  }
  .pc-fav:hover { transform: scale(1.12); border-color: rgba(248,113,113,0.6); color: #f87171; }
  .pc-fav.active { background: rgba(239,68,68,0.2); border-color: rgba(248,113,113,0.5); color: #f87171; }

  /* Discount badge */
  .pc-badge {
    position: absolute; top: 8px; left: 8px;
    padding: 2px 8px; border-radius: 999px;
    font-size: 10px; font-weight: 700;
    background: rgba(239,68,68,0.25);
    border: 1px solid rgba(248,113,113,0.4);
    color: #fca5a5;
    backdrop-filter: blur(6px);
  }

  /* Body */
  .pc-body {
    padding: 10px 12px 12px;
    background: rgba(0,0,0,0.25);
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .pc-cat {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(196,181,253,0.6);
    margin-bottom: 3px;
  }
  .pc-name {
    font-size: 13px; font-weight: 600;
    color: rgba(255,255,255,0.9);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 8px;
    transition: color 0.2s;
  }
  .pc-root:hover .pc-name { color: #fff; }

  .pc-price-row {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .pc-price {
    font-size: 15px; font-weight: 800;
    color: #fff;
  }
  .pc-old-price {
    font-size: 11px; color: rgba(255,255,255,0.3);
    text-decoration: line-through; margin-left: 4px;
    font-weight: 400;
  }
  .pc-rating {
    display: flex; align-items: center; gap: 3px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 999px;
    padding: 2px 7px;
    font-size: 11px; font-weight: 600;
    color: rgba(255,255,255,0.75);
  }

  /* Stock */
  .pc-stock-low {
    font-size: 10px; font-weight: 600;
    color: #fdba74;
    background: rgba(249,115,22,0.12);
    border: 1px solid rgba(249,115,22,0.25);
    border-radius: 999px; padding: 2px 8px;
    display: inline-block; margin-bottom: 8px;
  }
  .pc-stock-out {
    font-size: 10px; font-weight: 600;
    color: #fca5a5;
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 999px; padding: 2px 8px;
    display: inline-block; margin-bottom: 8px;
  }

  /* Cart btn */
  .pc-btn {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 7px 0; border-radius: 10px;
    font-size: 12px; font-weight: 600;
    border: 1px solid rgba(139,92,246,0.3);
    background: rgba(139,92,246,0.12);
    color: rgba(196,181,253,0.9);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .pc-btn:hover {
    background: rgba(139,92,246,0.28);
    border-color: rgba(139,92,246,0.55);
    color: #fff;
  }
  .pc-btn:disabled {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.25);
    cursor: not-allowed;
  }
  .pc-btn.added {
    background: rgba(34,197,94,0.15);
    border-color: rgba(34,197,94,0.35);
    color: #86efac;
  }
`

function ProductCard({ product, isFavorite, onToggleFavorite }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const handleFav = (e) => {
    e.stopPropagation()
    onToggleFavorite(product.id)
  }

  const handleCart = (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error('Please login first!', { icon: '🔒' })
      return
    }
    addToCart(product, 1)
    toast.success('Added to cart!', { icon: '🛒', duration: 1500 })
  }

  const imgSrc = product.images?.[0]?.url || product.image || 'https://via.placeholder.com/400'
  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const discount = hasDiscount
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <>
      <style>{CARD_STYLES}</style>
      <div className="pc-root" onClick={() => navigate(`/product/${product.id}`)}>

        {/* Image */}
        <div className="pc-img-wrap">
          <img src={imgSrc} alt={product.name} className="pc-img" />
          <div className="pc-img-overlay" />

          {/* Fav */}
          <button className={`pc-fav${isFavorite ? ' active' : ''}`} onClick={handleFav}>
            <FiHeart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* Discount */}
          {hasDiscount && <span className="pc-badge">-{discount}%</span>}
        </div>

        {/* Body */}
        <div className="pc-body">
          <div className="pc-cat">{product.category?.name || 'Category'}</div>
          <div className="pc-name">{product.name}</div>

          <div className="pc-price-row">
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span className="pc-price">${product.price}</span>
              {hasDiscount && <span className="pc-old-price">${product.comparePrice}</span>}
            </div>
            <div className="pc-rating">
              <span style={{ color: '#facc15', fontSize: 10 }}>★</span>
              {product.ratings?.average || 0}
            </div>
          </div>

          {product.stock <= 5 && product.stock > 0 && (
            <div className="pc-stock-low">Only {product.stock} left!</div>
          )}
          {product.stock === 0 && (
            <div className="pc-stock-out">Out of Stock</div>
          )}

          <button
            className={`pc-btn${product.stock === 0 ? '' : ''}`}
            onClick={handleCart}
            disabled={product.stock === 0}
          >
            <FiShoppingCart size={13} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </>
  )
}

export default ProductCard