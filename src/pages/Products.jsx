import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { productApi } from '../api/productApi'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

  @keyframes orbDrift1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(50px,-35px) scale(1.1); }
    66%      { transform: translate(-25px,45px) scale(0.93); }
  }
  @keyframes orbDrift2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-40px,30px) scale(1.08); }
  }
  @keyframes gridPulse {
    0%,100% { opacity:0.03; }
    50%      { opacity:0.07; }
  }
  @keyframes scanLine {
    from { transform: translateY(-100%); }
    to   { transform: translateY(100vh); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeSlideUp {
    from { opacity:0; transform:translateY(30px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes shimmerMove {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes cardIn {
    from { opacity:0; transform:translateY(20px) scale(0.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes glowPulse {
    0%,100% { opacity:0.5; }
    50%      { opacity:1; }
  }
  @keyframes badgePop {
    0%   { transform:scale(0) rotate(-15deg); opacity:0; }
    70%  { transform:scale(1.15); }
    100% { transform:scale(1); opacity:1; }
  }

  *, *::before, *::after { box-sizing: border-box; }

  .prod-page { font-family:'Outfit',sans-serif; }

  .prod-bg-grid {
    position:fixed; inset:0; pointer-events:none; z-index:0;
    background-image: linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),
                      linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px);
    background-size:60px 60px;
    animation: gridPulse 6s ease-in-out infinite;
  }
  .prod-orb-1 {
    position:fixed; pointer-events:none; z-index:0;
    top:-15%; left:-8%; width:55vw; height:55vw; border-radius:50%;
    background:radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 70%);
    filter:blur(50px); animation:orbDrift1 18s ease-in-out infinite;
  }
  .prod-orb-2 {
    position:fixed; pointer-events:none; z-index:0;
    bottom:-20%; right:-12%; width:50vw; height:50vw; border-radius:50%;
    background:radial-gradient(circle,rgba(236,72,153,0.13) 0%,transparent 70%);
    filter:blur(55px); animation:orbDrift2 22s ease-in-out infinite;
  }
  .prod-scan {
    position:fixed; left:0; right:0; height:2px; pointer-events:none; z-index:0;
    background:linear-gradient(90deg,transparent,rgba(139,92,246,0.12),transparent);
    animation:scanLine 10s linear infinite;
  }

  .prod-header-anim { animation: fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }

  .text-shimmer {
    background: linear-gradient(90deg,#e2e8ff 0%,#a78bfa 25%,#f0abfc 50%,#a78bfa 75%,#e2e8ff 100%);
    background-size:200% auto;
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:shimmerMove 4s linear infinite;
  }

  .cat-pill {
    display:inline-flex; align-items:center; gap:6px;
    padding:8px 18px; border-radius:999px; cursor:pointer;
    font-family:'Outfit',sans-serif; font-size:0.82rem; font-weight:600;
    border:1px solid rgba(255,255,255,0.1);
    background:rgba(255,255,255,0.04);
    color:rgba(255,255,255,0.55);
    transition:all 0.22s cubic-bezier(0.4,0,0.2,1);
    white-space:nowrap;
  }
  .cat-pill:hover {
    background:rgba(255,255,255,0.09);
    color:#fff;
    border-color:rgba(255,255,255,0.18);
    transform:translateY(-1px);
  }
  .cat-pill.active {
    background:rgba(139,92,246,0.22);
    border-color:rgba(139,92,246,0.5);
    color:#c4b5fd;
    box-shadow:0 0 16px rgba(139,92,246,0.2);
  }

  .prod-card-wrap {
    position:relative; border-radius:22px; overflow:hidden;
    background:rgba(255,255,255,0.035);
    backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
    border:1px solid rgba(255,255,255,0.08);
    box-shadow:0 8px 32px rgba(0,0,0,0.45);
    transition:all 0.28s cubic-bezier(0.4,0,0.2,1);
    animation:cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  .prod-card-wrap:hover {
    transform:translateY(-6px) scale(1.015);
    border-color:rgba(255,255,255,0.14);
    box-shadow:0 24px 56px rgba(0,0,0,0.55);
  }
  .prod-card-top-line {
    position:absolute; top:0; left:0; right:0; height:1.5px; z-index:2;
  }
  .prod-card-hover-glow {
    position:absolute; inset:0; opacity:0; pointer-events:none; z-index:1;
    transition:opacity 0.3s ease;
    border-radius:22px;
  }
  .prod-card-wrap:hover .prod-card-hover-glow { opacity:1; }

  .glow-line {
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(139,92,246,0.6),rgba(236,72,153,0.55),transparent);
    animation:glowPulse 3s ease-in-out infinite;
  }

  .empty-icon-ring {
    width:100px; height:100px; border-radius:50%; margin:0 auto 24px;
    background:rgba(139,92,246,0.08); border:1px solid rgba(139,92,246,0.2);
    display:flex; align-items:center; justify-content:center;
    animation:badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .spinner {
    width:46px; height:46px; border-radius:50%;
    border:3px solid rgba(139,92,246,0.18);
    border-top-color:#7c3aed;
    animation:spin 0.8s linear infinite;
  }

  .footer-pill {
    display:inline-flex; align-items:center; gap:10px;
    padding:10px 20px; border-radius:999px;
    background:rgba(255,255,255,0.05);
    border:1px solid rgba(255,255,255,0.09);
    backdrop-filter:blur(16px);
    box-shadow:0 8px 32px rgba(0,0,0,0.35);
    position:relative; overflow:hidden;
    animation:fadeSlideUp 0.6s 0.3s both;
  }

  /* ── Responsive Grid ── */
  .prod-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  @media (min-width: 480px)  { .prod-grid { grid-template-columns: repeat(2, 1fr); gap:12px; } }
  @media (min-width: 640px)  { .prod-grid { grid-template-columns: repeat(3, 1fr); gap:14px; } }
  @media (min-width: 900px)  { .prod-grid { grid-template-columns: repeat(4, 1fr); gap:16px; } }
  @media (min-width: 1200px) { .prod-grid { grid-template-columns: repeat(5, 1fr); gap:18px; } }
  @media (min-width: 1500px) { .prod-grid { grid-template-columns: repeat(6, 1fr); gap:20px; } }

  /* ── Responsive Header ── */
  .prod-header {
    margin-bottom: 20px;
    border-radius: 18px;
    padding: 16px;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.07);
    box-shadow: 0 16px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
    position: relative;
    overflow: hidden;
  }
  @media (min-width: 640px) {
    .prod-header { padding: 20px 24px; border-radius: 20px; margin-bottom: 24px; }
  }
  @media (min-width: 1024px) {
    .prod-header { padding: 28px 32px; border-radius: 24px; margin-bottom: 28px; }
  }

  /* ── Responsive Title ── */
  .prod-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.02em;
    margin: 0;
  }
  @media (min-width: 640px)  { .prod-title { font-size: 26px; } }
  @media (min-width: 1024px) { .prod-title { font-size: 34px; } }

  /* ── Responsive Container ── */
  .prod-container {
    position: relative;
    z-index: 10;
    max-width: 1600px;
    margin: 0 auto;
    padding: 16px 12px 48px;
  }
  @media (min-width: 640px)  { .prod-container { padding: 20px 16px 56px; } }
  @media (min-width: 1024px) { .prod-container { padding: 28px 24px 60px; } }

  /* ── Header inner row ── */
  .prod-header-row {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  @media (min-width: 640px) {
    .prod-header-row {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
  }

  /* ── Clear filter button ── */
  .clear-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 16px; border-radius: 999px;
    background: rgba(139,92,246,0.14);
    border: 1px solid rgba(139,92,246,0.32);
    color: #c4b5fd; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
    font-family: 'Outfit', sans-serif;
    align-self: flex-start;
  }
  @media (min-width: 640px) { .clear-btn { align-self: center; } }

  /* ── Loading box ── */
  .loading-box {
    display: flex; flex-direction: column; align-items: center; gap: 20px;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    padding: 40px 24px;
    position: relative; overflow: hidden;
    width: 100%;
    max-width: 340px;
  }
  @media (min-width: 640px) { .loading-box { padding: 52px 72px; } }

  /* scrollbar */
  ::-webkit-scrollbar { width:5px; background:#05040f; }
  ::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.35); border-radius:3px; }
  .cat-scroll { scrollbar-width:none; }
  .cat-scroll::-webkit-scrollbar { display:none; }
`

const ACCENTS = ['#6366f1', '#8b5cf6', '#06b6d4', '#059669', '#db2777', '#d97706', '#3b82f6', '#a855f7']

function Products() {
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(location.state?.selectedCategory || null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [favorites, setFavorites] = useState([])
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    const s = localStorage.getItem('productsScroll')
    if (s) window.scrollTo({ top: Number(s), behavior: 'auto' })
    return () => localStorage.setItem('productsScroll', window.scrollY)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  useEffect(() => { fetchProducts() }, [selectedCategory])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = selectedCategory
        ? await productApi.getProductsByCategory(selectedCategory.id)
        : await productApi.getProducts({ limit: 1000 })
      const list = data.data || data || []
      setProducts(list)
      setProductCount(list.length)
      setError('')
    } catch (err) {
      console.error('Products fetch error:', err)
      setProducts([])
      setProductCount(0)
      setError('Could not load products')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
      localStorage.setItem('favorites', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="prod-page" style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#030210 0%,#07051a 40%,#05040f 100%)', position: 'relative' }}>
      <style>{STYLES}</style>

      <div className="prod-bg-grid" />
      <div className="prod-orb-1" />
      <div className="prod-orb-2" />
      <div className="prod-scan" />

      <Navbar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      <div className="prod-container">

        {/* ══ HEADER ══ */}
        <div className="prod-header prod-header-anim">
          <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />

          <div className="prod-header-row">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                <span style={{
                  padding: '3px 12px', borderRadius: 999,
                  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
                  color: '#c4b5fd', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                  {selectedCategory ? 'Filtered' : 'All Products'}
                </span>
                {!loading && (
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
                    {productCount} items
                  </span>
                )}
              </div>

              <h1 className="prod-title">
                {selectedCategory
                  ? <span className="text-shimmer">{selectedCategory.name}</span>
                  : <span style={{ color: '#fff' }}>Shop <span className="text-shimmer">Everything</span></span>
                }
              </h1>

              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 4, marginBottom: 0 }}>
                {selectedCategory
                  ? `Browsing products in ${selectedCategory.name}`
                  : 'Discover our best deals and latest arrivals'}
              </p>
            </div>

            {selectedCategory && (
              <button
                className="clear-btn"
                onClick={() => setSelectedCategory(null)}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.26)'; e.currentTarget.style.transform = 'scale(1.03)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.14)'; e.currentTarget.style.transform = 'scale(1)' }}
              >
                ✕ Clear filter
              </button>
            )}
          </div>
        </div>

        {/* ══ LOADING ══ */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, padding: '20px 0' }}>
            <div className="loading-box">
              <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
              <div style={{ position: 'relative', width: 60, height: 60 }}>
                <div className="spinner" style={{ position: 'absolute', inset: 0 }} />
                <div style={{
                  position: 'absolute', inset: 8, borderRadius: '50%',
                  border: '2px solid rgba(236,72,153,0.2)',
                  borderBottom: '2px solid #db2777',
                  animation: 'spin 1.2s linear infinite reverse',
                }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                  Loading Products
                </p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0 }}>
                  {selectedCategory ? `Fetching ${selectedCategory.name}...` : 'Getting everything ready...'}
                </p>
              </div>
            </div>
          </div>

          /* ══ EMPTY ══ */
        ) : products.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24,
            padding: '60px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
            <div className="empty-icon-ring">
              <svg style={{ width: 44, height: 44, color: 'rgba(139,92,246,0.6)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 style={{ fontSize: 'clamp(1.2rem,4vw,1.6rem)', fontWeight: 800, color: '#fff', marginBottom: 10, fontFamily: "'Syne',sans-serif" }}>
              No Products Found
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
              {selectedCategory
                ? `${selectedCategory.name} mein abhi koi product nahi hai`
                : 'Admin panel se pehla product add karein!'}
            </p>
            {error && (
              <p style={{ color: '#f87171', fontSize: 12, marginTop: 12, padding: '8px 16px', borderRadius: 8, background: 'rgba(248,113,113,0.08)', display: 'inline-block' }}>
                {error}
              </p>
            )}
          </div>

          /* ══ PRODUCTS GRID ══ */
        ) : (
          <>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: "'Outfit',sans-serif", margin: 0 }}>
                Showing <span style={{ color: 'rgba(139,92,246,0.9)', fontWeight: 700 }}>{productCount}</span> products
                {selectedCategory && <> in <span style={{ color: '#c4b5fd', fontWeight: 600 }}>{selectedCategory.name}</span></>}
              </p>
            </div>

            {/* Grid */}
            <div className="prod-grid">
              {products.map((product, index) => {
                const accent = ACCENTS[index % ACCENTS.length]
                return (
                  <div
                    key={product.id}
                    className="prod-card-wrap"
                    style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}
                  >
                    <div
                      className="prod-card-top-line"
                      style={{ background: `linear-gradient(90deg,transparent,${accent}99,transparent)` }}
                    />
                    <div
                      className="prod-card-hover-glow"
                      style={{ background: `radial-gradient(ellipse at top,${accent}0d 0%,transparent 70%)` }}
                    />
                    <ProductCard
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}>
              <div className="footer-pill">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)' }} />
                <span style={{ fontSize: 16 }}>✦</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Outfit',sans-serif" }}>
                  {productCount} Products
                  {selectedCategory && ` · ${selectedCategory.name}`}
                </span>
                <span style={{ fontSize: 16 }}>✦</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Products