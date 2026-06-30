import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../utils/CartContext'
import { orderApi } from '../api/orderApi'
import Navbar from '../components/Navbar'
import { FiCreditCard, FiMapPin, FiPackage, FiArrowLeft, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  @keyframes orbDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(60px,-40px) scale(1.12)} 66%{transform:translate(-25px,45px) scale(0.93)} }
  @keyframes orbDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,30px) scale(1.08)} }
  @keyframes gridPulse { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
  @keyframes scanLine { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes stepIn { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
  @keyframes shimmerMove { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes glowPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

  .co-page { font-family:'Outfit',sans-serif; }
  .co-bg-grid { position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px);background-size:60px 60px;animation:gridPulse 6s ease-in-out infinite; }
  .co-orb-1 { position:fixed;pointer-events:none;z-index:0;top:-15%;left:-8%;width:55vw;height:55vw;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 70%);filter:blur(50px);animation:orbDrift1 18s ease-in-out infinite; }
  .co-orb-2 { position:fixed;pointer-events:none;z-index:0;bottom:-20%;right:-12%;width:50vw;height:50vw;border-radius:50%;background:radial-gradient(circle,rgba(236,72,153,0.13) 0%,transparent 70%);filter:blur(55px);animation:orbDrift2 22s ease-in-out infinite; }
  .co-scan { position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:0;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.12),transparent);animation:scanLine 10s linear infinite; }

  .co-card { background:rgba(255,255,255,0.03);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.08);border-radius:24px;box-shadow:0 16px 50px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.05);position:relative;overflow:hidden; }
  .co-anim { animation:fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
  .step-anim { animation:stepIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }

  .text-shimmer { background:linear-gradient(90deg,#e2e8ff 0%,#a78bfa 25%,#f0abfc 50%,#a78bfa 75%,#e2e8ff 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimmerMove 4s linear infinite; }
  .glow-line { height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.6),rgba(236,72,153,0.55),transparent);animation:glowPulse 3s ease-in-out infinite; }

  .co-input { width:100%;padding:11px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:13px;color:#fff;font-family:'Outfit',sans-serif;font-size:13.5px;outline:none;transition:all 0.25s ease;box-sizing:border-box; }
  .co-input::placeholder { color:rgba(255,255,255,0.28); }
  .co-input:focus { background:rgba(139,92,246,0.08);border-color:rgba(139,92,246,0.4);box-shadow:0 0 0 3px rgba(139,92,246,0.1); }

  .co-btn-primary { width:100%;padding:12px;border:none;border-radius:14px;color:#fff;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.25s ease;position:relative;overflow:hidden;background:linear-gradient(135deg,#4f46e5,#7c3aed,#a21caf); }
  .co-btn-primary::before { content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent);transform:translateX(-100%);transition:transform 0.5s ease; }
  .co-btn-primary:hover::before { transform:translateX(100%); }
  .co-btn-primary:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,0.5); }
  .co-btn-primary:disabled { opacity:0.5;cursor:not-allowed;transform:none; }

  .co-btn-success { width:100%;padding:12px;border:none;border-radius:14px;color:#fff;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.25s ease;position:relative;overflow:hidden;background:linear-gradient(135deg,#059669,#10b981); }
  .co-btn-success:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(5,150,105,0.45); }
  .co-btn-success:disabled { opacity:0.5;cursor:not-allowed;transform:none; }

  .co-btn-ghost { width:100%;padding:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:14px;color:rgba(255,255,255,0.7);font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.22s ease; }
  .co-btn-ghost:hover { background:rgba(255,255,255,0.09);color:#fff;transform:translateY(-1px); }

  .pay-option { display:block;cursor:pointer;border-radius:16px;padding:14px 16px;transition:all 0.22s ease;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03); }
  .pay-option:hover { background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.14); }
  .pay-option.selected { background:rgba(139,92,246,0.1);border-color:rgba(139,92,246,0.4);box-shadow:0 0 16px rgba(139,92,246,0.12); }

  /* ── Responsive layout ── */
  .co-layout {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  @media (min-width: 1024px) {
    .co-layout {
      display: grid;
      grid-template-columns: 1fr 1fr 380px;
      gap: 24px;
      align-items: start;
    }
    .co-main-col { grid-column: span 2; }
    .co-sidebar-col { grid-column: span 1; }
  }

  /* ── Two-col form grid collapses on small screens ── */
  .co-two-col { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  @media (max-width:520px) { .co-two-col { grid-template-columns:1fr; } }

  ::-webkit-scrollbar { width:5px;background:#05040f; }
  ::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.35);border-radius:3px; }
`

const LABEL = { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, marginBottom: 7, letterSpacing: '0.08em', textTransform: 'uppercase' }
const STEPS = [
  { num: 1, label: 'Shipping', icon: <FiMapPin size={16} />, color: '#3b82f6' },
  { num: 2, label: 'Payment', icon: <FiCreditCard size={16} />, color: '#8b5cf6' },
  { num: 3, label: 'Review', icon: <FiCheck size={16} />, color: '#10b981' },
]

function Checkout() {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingInfo, setShippingInfo] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: 'Pakistan' })
  const [paymentMethod, setPaymentMethod] = useState('cod')

  const handleShippingChange = (e) => setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value })

  const handlePlaceOrder = async () => {
    setLoading(true); setError('')
    const toastId = toast.loading('Placing your order...')
    try {
      const orderData = {
        items: cartItems.map(item => ({ product: item.id || item._id, name: item.name, image: item.images?.[0]?.url || item.image, quantity: item.quantity, price: item.price })),
        shippingAddress: shippingInfo,
        paymentMethod,
        itemsPrice: getCartTotal(),
        taxPrice: getCartTotal() * 0.1,
        shippingPrice: 0,
        totalPrice: getCartTotal() + (getCartTotal() * 0.1),
      }
      await orderApi.createOrder(orderData)
      toast.dismiss(toastId)
      toast.success('Order placed successfully! 🎉', { icon: '✅', duration: 3000 })
      clearCart()
      setTimeout(() => navigate('/orders'), 1000)
    } catch (err) {
      toast.dismiss(toastId)
      const msg = err.response?.data?.message || 'Failed to place order'
      toast.error(msg, { icon: '❌', duration: 4000 })
      setError(msg); setLoading(false)
    }
  }

  const subtotal = getCartTotal()
  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (cartItems.length === 0) return (
    <div className="co-page" style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#030210 0%,#07051a 40%,#05040f 100%)', position: 'relative' }}>
      <style>{STYLES}</style>
      <div className="co-bg-grid" /><div className="co-orb-1" /><div className="co-orb-2" /><div className="co-scan" />
      <Navbar />
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
        <div className="co-card co-anim" style={{ maxWidth: 460, width: '100%', textAlign: 'center', padding: '60px clamp(24px,5vw,40px)' }}>
          <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <FiPackage size={34} style={{ color: 'rgba(139,92,246,0.5)' }} />
          </div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 10 }}>Cart is Empty</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 28 }}>Add some products before checkout</p>
          <button onClick={() => navigate('/products')} className="co-btn-primary" style={{ padding: '12px 32px', width: 'auto' }}>
            Start Shopping →
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="co-page" style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#030210 0%,#07051a 40%,#05040f 100%)', position: 'relative' }}>
      <style>{STYLES}</style>
      <div className="co-bg-grid" /><div className="co-orb-1" /><div className="co-orb-2" /><div className="co-scan" />
      <Navbar />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '28px clamp(14px,3vw,16px) 60px' }}>

        {/* Back + Title */}
        <div className="co-anim" style={{ marginBottom: 24 }}>
          <button onClick={() => navigate('/cart')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: 13, fontFamily: "'Outfit',sans-serif", marginBottom: 16, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}>
            <FiArrowLeft size={14} /> Back to Cart
          </button>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
            <span style={{ color: '#fff' }}>Check</span><span className="text-shimmer">out</span>
          </h1>
        </div>

        {/* Step indicator */}
        <div className="co-card co-anim" style={{ marginBottom: 24, padding: 'clamp(16px,2.5vw,20px) clamp(14px,3vw,24px)', animationDelay: '0.05s' }}>
          <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STEPS.map((s, idx) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ width: 'clamp(34px,5vw,42px)', height: 'clamp(34px,5vw,42px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: currentStep >= s.num ? `${s.color}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${currentStep >= s.num ? s.color + '55' : 'rgba(255,255,255,0.09)'}`, color: currentStep >= s.num ? s.color : 'rgba(255,255,255,0.3)', transition: 'all 0.35s ease', boxShadow: currentStep >= s.num ? `0 0 14px ${s.color}22` : 'none' }}>{s.icon}</div>
                  <span style={{ marginTop: 6, fontSize: 'clamp(9px,1.1vw,11px)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: currentStep >= s.num ? '#fff' : 'rgba(255,255,255,0.28)', transition: 'color 0.35s', whiteSpace: 'nowrap' }}>{s.label}</span>
                </div>
                {idx < 2 && (
                  <div style={{ flex: 1, height: 1, margin: '0 4px', marginBottom: 18, background: currentStep > s.num ? 'linear-gradient(90deg,#7c3aed,#10b981)' : 'rgba(255,255,255,0.08)', transition: 'background 0.5s ease' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 12, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* ── Responsive Layout ── */}
        <div className="co-layout">

          {/* ── Main Steps ── */}
          <div className="co-main-col" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="co-card step-anim">
                <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
                <div style={{ padding: 'clamp(20px,4vw,28px) clamp(16px,4vw,28px) clamp(24px,4vw,32px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><FiMapPin size={16} /></div>
                    <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(16px,2vw,20px)', fontWeight: 900, color: '#fff', margin: 0 }}>Shipping Address</h2>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="co-two-col">
                      {[['fullName', 'Full Name', 'John Doe', 'text'], ['phone', 'Phone Number', '+92 300 1234567', 'tel']].map(([name, label, ph, type]) => (
                        <div key={name}><label style={LABEL}>{label}</label><input type={type} name={name} value={shippingInfo[name]} onChange={handleShippingChange} required placeholder={ph} className="co-input" /></div>
                      ))}
                    </div>
                    {[['addressLine1', 'Address Line 1', 'House No, Street', 'text'], ['addressLine2', 'Address Line 2 (Optional)', 'Apartment, Suite, etc.', 'text']].map(([name, label, ph, type]) => (
                      <div key={name}><label style={LABEL}>{label}</label><input type={type} name={name} value={shippingInfo[name]} onChange={handleShippingChange} required={name !== 'addressLine2'} placeholder={ph} className="co-input" /></div>
                    ))}
                    <div className="co-two-col">
                      {[['city', 'City', 'Karachi'], ['state', 'State/Province', 'Sindh'], ['zipCode', 'Zip Code', '75500'], ['country', 'Country', 'Pakistan']].map(([name, label, ph]) => (
                        <div key={name}><label style={LABEL}>{label}</label><input type="text" name={name} value={shippingInfo[name]} onChange={handleShippingChange} required placeholder={ph} className="co-input" /></div>
                      ))}
                    </div>
                    <button className="co-btn-primary" style={{ marginTop: 8 }} onClick={() => {
                      const { fullName, phone, addressLine1, city, state, zipCode } = shippingInfo
                      if (fullName && phone && addressLine1 && city && state && zipCode) {
                        setCurrentStep(2); toast.success('Shipping details saved!', { icon: '📦', duration: 2000 })
                      } else {
                        toast.error('Please fill all required fields!', { icon: '⚠️' })
                      }
                    }}>Continue to Payment →</button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="co-card step-anim">
                <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
                <div style={{ padding: 'clamp(20px,4vw,28px) clamp(16px,4vw,28px) clamp(24px,4vw,32px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}><FiCreditCard size={16} /></div>
                    <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(16px,2vw,20px)', fontWeight: 900, color: '#fff', margin: 0 }}>Payment Method</h2>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    {[
                      { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', emoji: '💵' },
                      { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard accepted', emoji: '💳' },
                      { id: 'paypal', label: 'PayPal', desc: 'Secure online payment', emoji: '🔒' },
                    ].map(m => (
                      <label key={m.id} className={`pay-option ${paymentMethod === m.id ? 'selected' : ''}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <input type="radio" name="paymentMethod" value={m.id} checked={paymentMethod === m.id} onChange={e => setPaymentMethod(e.target.value)} style={{ accentColor: '#7c3aed', width: 16, height: 16 }} />
                          <span style={{ fontSize: 22 }}>{m.emoji}</span>
                          <div>
                            <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, fontFamily: "'Outfit',sans-serif" }}>{m.label}</div>
                            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>{m.desc}</div>
                          </div>
                          {paymentMethod === m.id && <div style={{ marginLeft: 'auto', color: '#a78bfa', fontSize: 18 }}>✓</div>}
                        </div>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="co-btn-ghost" style={{ flex: 1 }} onClick={() => setCurrentStep(1)}>← Back</button>
                    <button className="co-btn-primary" style={{ flex: 2 }} onClick={() => { setCurrentStep(3); toast.success('Payment method selected!', { icon: '💳', duration: 2000 }) }}>Review Order →</button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="co-card step-anim">
                <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
                <div style={{ padding: 'clamp(20px,4vw,28px) clamp(16px,4vw,28px) clamp(24px,4vw,32px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><FiCheck size={16} /></div>
                    <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(16px,2vw,20px)', fontWeight: 900, color: '#fff', margin: 0 }}>Review Order</h2>
                  </div>
                  <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 16, padding: '16px 18px', marginBottom: 14 }}>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>📦 Shipping Address</p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                      {shippingInfo.fullName} · {shippingInfo.phone}<br />
                      {shippingInfo.addressLine1}{shippingInfo.addressLine2 && `, ${shippingInfo.addressLine2}`}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode} · {shippingInfo.country}
                    </p>
                  </div>
                  <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 16, padding: '16px 18px', marginBottom: 18 }}>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>💳 Payment Method</p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>
                      {paymentMethod === 'cod' ? '💵 Cash on Delivery' : paymentMethod === 'card' ? '💳 Credit/Debit Card' : '🔒 PayPal'}
                    </p>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>🛍️ Order Items</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                    {cartItems.map(item => (
                      <div key={item.id || item._id} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, alignItems: 'center' }}>
                        <img src={item.images?.[0]?.url || item.image || 'https://via.placeholder.com/60'} alt={item.name} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 10, flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: '#fff', fontWeight: 600, fontSize: 13, margin: 0, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, margin: 0 }}>Qty: {item.quantity}</p>
                        </div>
                        <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="co-btn-ghost" style={{ flex: 1 }} onClick={() => setCurrentStep(2)}>← Back</button>
                    <button className="co-btn-success" style={{ flex: 2 }} onClick={handlePlaceOrder} disabled={loading}>
                      {loading ? 'Placing Order...' : '✓ Place Order'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar: Order Summary ── */}
          <div className="co-sidebar-col">
            <div className="co-card co-anim" style={{ padding: 'clamp(18px,3vw,24px)', position: 'sticky', top: 80, animationDelay: '0.1s' }}>
              <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 20 }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18, maxHeight: 200, overflowY: 'auto' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={item.images?.[0]?.url || item.image} alt={item.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }} />
                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>×{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 14 }} />
              {[
                { label: 'Subtotal', val: `$${subtotal.toFixed(2)}`, color: 'rgba(255,255,255,0.6)' },
                { label: 'Tax (10%)', val: `$${tax.toFixed(2)}`, color: 'rgba(255,255,255,0.6)' },
                { label: 'Shipping', val: 'Free', color: '#34d399' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{r.label}</span>
                  <span style={{ color: r.color, fontWeight: 600, fontSize: 13 }}>{r.val}</span>
                </div>
              ))}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '10px 0 14px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Syne',sans-serif", color: '#fff', fontWeight: 800, fontSize: 16 }}>Total</span>
                <span style={{ fontFamily: "'Syne',sans-serif", color: '#a78bfa', fontWeight: 900, fontSize: 20 }}>${total.toFixed(2)}</span>
              </div>
              <div style={{ marginTop: 18, padding: '10px 14px', borderRadius: 12, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiCheck size={13} style={{ color: '#34d399', flexShrink: 0 }} />
                <span style={{ color: 'rgba(52,211,153,0.8)', fontSize: 12 }}>Free shipping on all orders</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Checkout