import { useNavigate } from 'react-router-dom'
import { useCart } from '../utils/CartContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiShoppingCart } from 'react-icons/fi'
import toast from 'react-hot-toast'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

  @keyframes orbDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(60px,-40px) scale(1.12)} 66%{transform:translate(-25px,45px) scale(0.93)} }
  @keyframes orbDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,30px) scale(1.08)} }
  @keyframes gridPulse { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
  @keyframes scanLine { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmerMove { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes glowPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes badgePop { 0%{transform:scale(0) rotate(-15deg);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
  @keyframes cardIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  .cart-page { font-family:'Outfit',sans-serif; }

  .cart-bg-grid { position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px);background-size:60px 60px;animation:gridPulse 6s ease-in-out infinite; }
  .cart-orb-1 { position:fixed;pointer-events:none;z-index:0;top:-15%;left:-8%;width:55vw;height:55vw;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 70%);filter:blur(50px);animation:orbDrift1 18s ease-in-out infinite; }
  .cart-orb-2 { position:fixed;pointer-events:none;z-index:0;bottom:-20%;right:-12%;width:50vw;height:50vw;border-radius:50%;background:radial-gradient(circle,rgba(236,72,153,0.13) 0%,transparent 70%);filter:blur(55px);animation:orbDrift2 22s ease-in-out infinite; }
  .cart-scan { position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:0;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.12),transparent);animation:scanLine 10s linear infinite; }

  .text-shimmer { background:linear-gradient(90deg,#e2e8ff 0%,#a78bfa 25%,#f0abfc 50%,#a78bfa 75%,#e2e8ff 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimmerMove 4s linear infinite; }
  .glow-line { height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.6),rgba(236,72,153,0.55),transparent);animation:glowPulse 3s ease-in-out infinite; }

  .glass-card { background:rgba(255,255,255,0.03);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.08);border-radius:22px;box-shadow:0 8px 40px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06);transition:all 0.3s ease; }

  .cart-item { animation:cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .cart-item:hover { border-color:rgba(255,255,255,0.13) !important; transform:translateY(-2px); box-shadow:0 16px 48px rgba(0,0,0,0.5); }

  .qty-btn { display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.8);cursor:pointer;font-size:18px;font-weight:700;transition:all 0.2s ease;flex-shrink:0; }
  .qty-btn:hover { background:rgba(139,92,246,0.2);border-color:rgba(139,92,246,0.4);color:#fff;transform:scale(1.08); }

  .del-btn { display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);color:#f87171;cursor:pointer;transition:all 0.2s ease;flex-shrink:0; }
  .del-btn:hover { background:rgba(239,68,68,0.22);border-color:rgba(239,68,68,0.4);transform:scale(1.08); }

  .checkout-btn { width:100%;padding:14px;background:linear-gradient(135deg,#4f46e5,#7c3aed,#a21caf);border:none;border-radius:14px;color:#fff;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.25s ease;position:relative;overflow:hidden; }
  .checkout-btn::before { content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent);transform:translateX(-100%);transition:transform 0.5s ease; }
  .checkout-btn:hover::before { transform:translateX(100%); }
  .checkout-btn:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,0.5); }

  .clear-btn { width:100%;padding:13px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:14px;color:#f87171;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s ease; }
  .clear-btn:hover { background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.35); }

  .back-btn { display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:999px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);cursor:pointer;font-size:13px;font-family:'Outfit',sans-serif;transition:all 0.2s ease; }
  .back-btn:hover { background:rgba(255,255,255,0.09);color:#fff;border-color:rgba(255,255,255,0.18); }

  .empty-ring { width:110px;height:110px;border-radius:50%;margin:0 auto 24px;background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:center;animation:badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }

  /* Sticky summary */
  @media (min-width: 1024px) { .order-summary { position:sticky;top:88px; } }

  /* Mobile grid */
  .cart-grid { display:grid;grid-template-columns:1fr;gap:20px; }
  @media (min-width: 1024px) { .cart-grid { grid-template-columns:1fr 360px; } }

  /* Mobile image */
  .cart-img-wrap { flex-shrink:0; }

  ::-webkit-scrollbar { width:5px;background:#05040f; }
  ::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.35);border-radius:3px; }
`

/* ── Shared page shell ── */
const PageShell = ({ children }) => (
  <div className="cart-page" style={{ minHeight:'100vh', background:'linear-gradient(160deg,#030210 0%,#07051a 40%,#05040f 100%)', position:'relative' }}>
    <style>{STYLES}</style>
    <div className="cart-bg-grid" />
    <div className="cart-orb-1" />
    <div className="cart-orb-2" />
    <div className="cart-scan" />
    <Navbar />
    <div style={{ position:'relative', zIndex:10, maxWidth:1200, margin:'0 auto', padding:'28px 16px 60px' }}>
      {children}
    </div>
  </div>
)

function Cart() {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const { isAuthenticated } = useAuth()

  /* ── Not logged in ── */
  if (!isAuthenticated) {
    return (
      <PageShell>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
          <div className="glass-card" style={{ maxWidth:440, width:'100%', padding:'56px 40px', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div className="glow-line" style={{ position:'absolute', top:0, left:0, right:0 }} />
            <div className="empty-ring">
              <FiShoppingBag size={44} style={{ color:'rgba(139,92,246,0.6)' }} />
            </div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:900, color:'#fff', marginBottom:10 }}>
              Please <span className="text-shimmer">Login</span>
            </h2>
            <p style={{ color:'rgba(255,255,255,0.38)', fontSize:14, marginBottom:28, lineHeight:1.7 }}>
              You need to be logged in to view your cart
            </p>
            <button onClick={() => navigate('/login')} className="checkout-btn">
              Login Now →
            </button>
          </div>
        </div>
      </PageShell>
    )
  }

  /* ── Empty cart ── */
  if (cartItems.length === 0) {
    return (
      <PageShell>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
          <div className="glass-card" style={{ maxWidth:440, width:'100%', padding:'56px 40px', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div className="glow-line" style={{ position:'absolute', top:0, left:0, right:0 }} />
            <div className="empty-ring">
              <FiShoppingBag size={44} style={{ color:'rgba(139,92,246,0.6)' }} />
            </div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:900, color:'#fff', marginBottom:10 }}>
              Cart is <span className="text-shimmer">Empty</span>
            </h2>
            <p style={{ color:'rgba(255,255,255,0.38)', fontSize:14, marginBottom:28, lineHeight:1.7 }}>
              Add some products to get started!
            </p>
            <button onClick={() => navigate('/products')} className="checkout-btn">
              Continue Shopping →
            </button>
          </div>
        </div>
      </PageShell>
    )
  }

  const handleRemoveItem = (itemId, itemName) => {
    removeFromCart(itemId)
    toast.success(`${itemName} removed from cart!`, { icon:'🗑️', duration:2000 })
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart()
      toast.success('Cart cleared!', { icon:'🧹', duration:2000 })
    }
  }

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <PageShell>

      {/* Back btn + heading */}
      <div style={{ marginBottom:24 }}>
        <button onClick={() => navigate('/products')} className="back-btn" style={{ marginBottom:20 }}>
          <FiArrowLeft size={14}/> Continue Shopping
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:46, height:46, borderRadius:14, background:'linear-gradient(135deg,#7c3aed,#db2777)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 18px rgba(124,58,237,0.4)', flexShrink:0 }}>
            <FiShoppingCart size={20} color="#fff"/>
          </div>
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(22px,3vw,32px)', fontWeight:900, color:'#fff', letterSpacing:'-0.02em' }}>
              Shopping <span className="text-shimmer">Cart</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13 }}>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
          </div>
        </div>
      </div>

      <div className="cart-grid">

        {/* ── Cart Items ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {cartItems.map((item, index) => (
            <div
              key={item.id || item._id}
              className="glass-card cart-item"
              style={{ padding:'20px', animationDelay:`${index * 0.06}s`, position:'relative', overflow:'hidden' }}
            >
              {/* Top accent */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:'linear-gradient(90deg,transparent,rgba(139,92,246,0.5),rgba(236,72,153,0.4),transparent)' }} />

              <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                {/* Image */}
                <div className="cart-img-wrap" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:8, flexShrink:0 }}>
                  <img
                    src={item.images?.[0]?.url || item.image || 'https://via.placeholder.com/100'}
                    alt={item.name}
                    onClick={() => navigate(`/product/${item.id || item._id}`)}
                    style={{ width:80, height:80, objectFit:'cover', borderRadius:10, cursor:'pointer', transition:'transform 0.3s ease', display:'block' }}
                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                  />
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, marginBottom:4 }}>
                    <h3
                      onClick={() => navigate(`/product/${item.id || item._id}`)}
                      style={{ color:'#fff', fontWeight:700, fontSize:15, fontFamily:"'Syne',sans-serif", cursor:'pointer', lineHeight:1.4, transition:'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color='#a78bfa'}
                      onMouseLeave={e => e.currentTarget.style.color='#fff'}
                    >
                      {item.name}
                    </h3>
                    <button onClick={() => handleRemoveItem(item.id || item._id, item.name)} className="del-btn">
                      <FiTrash2 size={15}/>
                    </button>
                  </div>

                  {(item.category?.name || item.category) && (
                    <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:12 }}>
                      {item.category?.name || item.category}
                    </p>
                  )}

                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                    {/* Qty controls */}
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}>−</button>
                      <span style={{ color:'#fff', fontWeight:700, fontSize:15, fontFamily:"'Syne',sans-serif", minWidth:22, textAlign:'center' }}>{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}>+</button>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign:'right' }}>
                      <div style={{ color:'#fff', fontWeight:900, fontSize:18, fontFamily:"'Syne',sans-serif" }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>
                        ${item.price} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Order Summary ── */}
        <div className="order-summary">
          <div className="glass-card" style={{ padding:'28px', position:'relative', overflow:'hidden' }}>
            <div className="glow-line" style={{ position:'absolute', top:0, left:0, right:0 }} />

            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:900, color:'#fff', marginBottom:24 }}>
              Order Summary
            </h2>

            {/* Line items */}
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ color:'rgba(255,255,255,0.5)', fontSize:13 }}>
                  Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})
                </span>
                <span style={{ color:'#fff', fontWeight:700, fontSize:14 }}>${getCartTotal().toFixed(2)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ color:'rgba(255,255,255,0.5)', fontSize:13 }}>Shipping</span>
                <span style={{ color:'#34d399', fontWeight:700, fontSize:13 }}>Free ✓</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ color:'rgba(255,255,255,0.5)', fontSize:13 }}>Tax</span>
                <span style={{ color:'rgba(255,255,255,0.5)', fontSize:13 }}>Calculated at checkout</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height:1, background:'rgba(255,255,255,0.07)', marginBottom:20 }} />

            {/* Total */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <span style={{ color:'#fff', fontWeight:800, fontSize:17, fontFamily:"'Syne',sans-serif" }}>Total</span>
              <span style={{ color:'#fff', fontWeight:900, fontSize:22, fontFamily:"'Syne',sans-serif" }}>
                ${getCartTotal().toFixed(2)}
              </span>
            </div>

            {/* Trust badges */}
            <div style={{ display:'flex', justifyContent:'center', gap:16, marginBottom:20 }}>
              {['🔒 Secure', '↩️ Returns', '⚡ Fast'].map((b,i) => (
                <span key={i} style={{ color:'rgba(255,255,255,0.3)', fontSize:11, fontWeight:500 }}>{b}</span>
              ))}
            </div>

            <button onClick={() => navigate('/checkout')} className="checkout-btn" style={{ marginBottom:12 }}>
              Proceed to Checkout →
            </button>

            <button onClick={handleClearCart} className="clear-btn">
              🗑️ Clear Cart
            </button>
          </div>

          {/* Promo note */}
          <div style={{ marginTop:14, padding:'14px 18px', borderRadius:14, background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.15)', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:18 }}>🎉</span>
            <span style={{ color:'rgba(255,255,255,0.45)', fontSize:12, lineHeight:1.6 }}>
              You qualify for <strong style={{ color:'#34d399' }}>free shipping</strong> on this order!
            </span>
          </div>
        </div>

      </div>
    </PageShell>
  )
}

export default Cart