import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { productApi } from '../api/productApi'
import { FiShoppingBag, FiArrowLeft, FiHeart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

  @keyframes orbDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(60px,-40px) scale(1.12)} 66%{transform:translate(-25px,45px) scale(0.93)} }
  @keyframes orbDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,30px) scale(1.08)} }
  @keyframes gridPulse { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
  @keyframes scanLine { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmerMove { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes glowPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes cardIn { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes heartBeat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
  @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  .fav-page { font-family:'Outfit',sans-serif; }
  .fav-bg-grid { position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px);background-size:60px 60px;animation:gridPulse 6s ease-in-out infinite; }
  .fav-orb-1 { position:fixed;pointer-events:none;z-index:0;top:-15%;left:-8%;width:55vw;height:55vw;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 70%);filter:blur(50px);animation:orbDrift1 18s ease-in-out infinite; }
  .fav-orb-2 { position:fixed;pointer-events:none;z-index:0;bottom:-20%;right:-12%;width:50vw;height:50vw;border-radius:50%;background:radial-gradient(circle,rgba(236,72,153,0.13) 0%,transparent 70%);filter:blur(55px);animation:orbDrift2 22s ease-in-out infinite; }
  .fav-scan { position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:0;background:linear-gradient(90deg,transparent,rgba(236,72,153,0.15),transparent);animation:scanLine 10s linear infinite; }

  .text-shimmer { background:linear-gradient(90deg,#e2e8ff 0%,#a78bfa 25%,#f0abfc 50%,#a78bfa 75%,#e2e8ff 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimmerMove 4s linear infinite; }
  .glow-line { height:1px;background:linear-gradient(90deg,transparent,rgba(236,72,153,0.6),rgba(139,92,246,0.55),transparent);animation:glowPulse 3s ease-in-out infinite; }

  .fav-card { animation:cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;position:relative;border-radius:22px;overflow:hidden;background:rgba(255,255,255,0.035);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.08);box-shadow:0 8px 32px rgba(0,0,0,0.45);transition:all 0.28s cubic-bezier(0.4,0,0.2,1); }
  .fav-card:hover { transform:translateY(-6px) scale(1.015);border-color:rgba(236,72,153,0.2);box-shadow:0 24px 56px rgba(0,0,0,0.55),0 0 0 1px rgba(236,72,153,0.1); }
  .fav-card-top { position:absolute;top:0;left:0;right:0;height:1.5px;z-index:2; }
  .fav-card-glow { position:absolute;inset:0;opacity:0;pointer-events:none;z-index:1;transition:opacity 0.3s ease;border-radius:22px; }
  .fav-card:hover .fav-card-glow { opacity:1; }

  .spinner { width:44px;height:44px;border-radius:50%;border:3px solid rgba(236,72,153,0.18);border-top-color:#ec4899;animation:spin 0.8s linear infinite; }

  .back-btn { display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:999px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);cursor:pointer;font-size:13px;font-family:'Outfit',sans-serif;transition:all 0.2s ease; }
  .back-btn:hover { background:rgba(255,255,255,0.09);color:#fff;transform:translateX(-2px); }

  .mag-btn { position:relative;overflow:hidden;transition:transform 0.2s ease,box-shadow 0.2s ease; }
  .mag-btn::before { content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,0.14),transparent);transform:translateX(-100%);transition:transform 0.5s ease; }
  .mag-btn:hover::before { transform:translateX(100%); }

  /* ── Responsive product grid ── */
  .fav-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
  @media(min-width:480px)  { .fav-grid { grid-template-columns:repeat(3,1fr); } }
  @media(min-width:768px)  { .fav-grid { grid-template-columns:repeat(4,1fr); } }
  @media(min-width:1024px) { .fav-grid { grid-template-columns:repeat(5,1fr); } }

  /* ── Header card padding responsive ── */
  .fav-header-card { padding: clamp(16px,4vw,28px) clamp(14px,4vw,32px); }

  /* ── Empty state padding responsive ── */
  .fav-empty { padding: clamp(40px,8vw,80px) clamp(16px,6vw,40px); }

  /* ── Loading box ── */
  .fav-loading-box {
    display:flex; flex-direction:column; align-items:center; gap:20;
    background:rgba(255,255,255,0.03); backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,0.07); border-radius:24px;
    padding: clamp(28px,6vw,52px) clamp(20px,8vw,72px);
    position:relative; overflow:hidden;
    width: min(90vw, 420px);
    text-align:center;
  }

  .footer-pill { display:inline-flex;align-items:center;gap:10px;padding:10px clamp(14px,4vw,28px);border-radius:999px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);backdrop-filter:blur(16px);box-shadow:0 8px 32px rgba(0,0,0,0.35);position:relative;overflow:hidden;animation:fadeSlideUp 0.6s 0.3s both; }

  ::-webkit-scrollbar { width:5px;background:#05040f; }
  ::-webkit-scrollbar-thumb { background:rgba(236,72,153,0.35);border-radius:3px; }
`

const ACCENTS = ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6', '#a855f7', '#db2777']

function Favorites() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(savedFavorites)

    const fetchProducts = async () => {
      try {
        const data = await productApi.getProducts({ limit: 1000 })
        setProducts(data.data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
      localStorage.setItem('favorites', JSON.stringify(next))
      window.dispatchEvent(new Event('storage'))
      return next
    })
  }

  const favoriteProducts = products.filter(product =>
    favorites.includes(product.id || product._id)
  )

  /* ── Loading ── */
  if (loading) return (
    <div className="fav-page" style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#030210 0%,#07051a 40%,#05040f 100%)', position: 'relative' }}>
      <style>{STYLES}</style>
      <div className="fav-bg-grid" /><div className="fav-orb-1" /><div className="fav-orb-2" /><div className="fav-scan" />
      <Navbar />
      <div style={{ position: 'relative', zIndex: 10, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
        <div className="fav-loading-box">
          <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
            <div className="spinner" style={{ position: 'absolute', inset: 0 }} />
            <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '2px solid rgba(139,92,246,0.2)', borderBottom: '2px solid #7c3aed', animation: 'spin 1.2s linear infinite reverse' }} />
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Loading Favorites</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Fetching your saved items...</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fav-page" style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#030210 0%,#07051a 40%,#05040f 100%)', position: 'relative' }}>
      <style>{STYLES}</style>

      <div className="fav-bg-grid" />
      <div className="fav-orb-1" />
      <div className="fav-orb-2" />
      <div className="fav-scan" />

      <Navbar />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1600, margin: '0 auto', padding: 'clamp(16px,3vw,28px) clamp(12px,3vw,16px) 60px' }}>

        {/* Back button */}
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => navigate('/products')} className="back-btn">
            <FiArrowLeft size={14} /> Back to Products
          </button>
        </div>

        {/* ── HEADER ── */}
        <div className="fav-header-card" style={{
          marginBottom: 28, borderRadius: 24,
          background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 16px 50px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.05)',
          position: 'relative', overflow: 'hidden',
          animation: 'fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,rgba(236,72,153,0.25),rgba(139,92,246,0.2))', border: '1px solid rgba(236,72,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FiHeart size={20} style={{ color: '#ec4899', animation: 'heartBeat 2s ease-in-out infinite' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ padding: '3px 12px', borderRadius: 999, background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.25)', color: '#f9a8d4', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Saved Items
                </span>
                {favoriteProducts.length > 0 && (
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>{favoriteProducts.length} items</span>
                )}
              </div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(20px,3vw,30px)', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
                My <span className="text-shimmer">Favorites</span>
              </h1>
            </div>
          </div>
        </div>

        {/* ── EMPTY STATE ── */}
        {favoriteProducts.length === 0 ? (
          <div className="fav-empty" style={{
            background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: 28,
            textAlign: 'center', position: 'relative', overflow: 'hidden',
            animation: 'fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
          }}>
            <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />

            {/* Rotating ring + heart */}
            <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 28px' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(236,72,153,0.2)', animation: 'rotateSlow 12s linear infinite' }}>
                <div style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, borderRadius: '50%', background: '#ec4899', boxShadow: '0 0 10px rgba(236,72,153,0.8)' }} />
              </div>
              <div style={{ position: 'absolute', inset: 16, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.15)', animation: 'rotateSlow 20s linear infinite reverse' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiHeart size={28} style={{ color: 'rgba(236,72,153,0.5)' }} />
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: 'clamp(1.2rem,4vw,1.6rem)', fontWeight: 800, color: '#fff', marginBottom: 10, fontFamily: "'Syne',sans-serif" }}>
              No Favorites Yet
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 'clamp(13px,1.5vw,14px)', lineHeight: 1.7, marginBottom: 28 }}>
              Tap the ❤️ on any product to save it here for later
            </p>
            <button
              onClick={() => navigate('/products')}
              className="mag-btn"
              style={{ padding: 'clamp(11px,2vw,13px) clamp(22px,4vw,32px)', borderRadius: 14, fontWeight: 700, fontSize: 'clamp(13px,1.5vw,14px)', cursor: 'pointer', background: 'linear-gradient(135deg,#db2777,#7c3aed)', border: 'none', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 24px rgba(219,39,119,0.4)', fontFamily: "'Outfit',sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(219,39,119,0.55)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(219,39,119,0.4)' }}
            >
              <FiShoppingBag size={16} /> Browse Products
            </button>
          </div>

        ) : (
          <>
            {/* Count bar */}
            <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>
                Showing <span style={{ color: 'rgba(236,72,153,0.9)', fontWeight: 700 }}>{favoriteProducts.length}</span> saved products
              </p>
            </div>

            {/* ── GRID ── */}
            <div className="fav-grid">
              {favoriteProducts.map((product, index) => {
                const accent = ACCENTS[index % ACCENTS.length]
                return (
                  <div
                    key={product.id || product._id}
                    className="fav-card"
                    style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s`, display: 'flex', flexDirection: 'column' }}
                  >
                    <div className="fav-card-top" style={{ background: `linear-gradient(90deg,transparent,${accent}99,transparent)` }} />
                    <div className="fav-card-glow" style={{ background: `radial-gradient(ellipse at top,${accent}0d 0%,transparent 70%)` }} />
                    <ProductCard
                      product={product}
                      isFavorite={true}
                      onToggleFavorite={toggleFavorite}
                    />
                  </div>
                )
              })}
            </div>

            {/* Footer pill */}
            <div style={{ marginTop: 52, display: 'flex', justifyContent: 'center' }}>
              <div className="footer-pill">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(236,72,153,0.3),transparent)' }} />
                <span style={{ fontSize: 15 }}>♥</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Outfit',sans-serif" }}>
                  {favoriteProducts.length} Favorite {favoriteProducts.length === 1 ? 'Product' : 'Products'}
                </span>
                <span style={{ fontSize: 15 }}>♥</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Favorites