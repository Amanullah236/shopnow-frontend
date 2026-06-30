import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { categoryApi } from '../api/categoryApi'
import {
  FiShoppingBag, FiTrendingUp, FiHeart, FiShield, FiStar,
  FiPackage, FiRefreshCw, FiHeadphones, FiChevronRight,
  FiArrowRight, FiChevronLeft, FiZap
} from 'react-icons/fi'

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { overflow-x: hidden; }

  ::-webkit-scrollbar { width: 5px; background: #05040f; }
  ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 3px; }

  @keyframes heroFloat    { 0%,100%{transform:translateY(0) rotate(0)} 33%{transform:translateY(-18px) rotate(1deg)} 66%{transform:translateY(-8px) rotate(-1deg)} }
  @keyframes orbDrift1    { 0%,100%{transform:translate(0,0) scale(1)} 25%{transform:translate(60px,-40px) scale(1.12)} 50%{transform:translate(30px,60px) scale(0.92)} 75%{transform:translate(-40px,20px) scale(1.06)} }
  @keyframes orbDrift2    { 0%,100%{transform:translate(0,0) scale(1) rotate(0)} 33%{transform:translate(-50px,40px) scale(1.1) rotate(120deg)} 66%{transform:translate(40px,-30px) scale(0.9) rotate(240deg)} }
  @keyframes orbDrift3    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-50px)} }
  @keyframes gridPulse    { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
  @keyframes fadeSlideUp  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scaleIn      { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmerMove  { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes rotateSlow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes borderGlow   { 0%,100%{box-shadow:0 0 20px rgba(139,92,246,0.3)} 50%{box-shadow:0 0 40px rgba(139,92,246,0.6),0 0 80px rgba(236,72,153,0.2)} }
  @keyframes marquee      { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes starPop      { 0%{transform:scale(0) rotate(-30deg);opacity:0} 70%{transform:scale(1.2) rotate(5deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes scanLine     { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
  @keyframes bobble       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

  .anim-hero  { animation: fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
  .anim-scale { animation: scaleIn    0.7s cubic-bezier(0.16,1,0.3,1) both; }
  .reveal     { opacity:0; transform:translateY(40px); transition:opacity 0.7s ease,transform 0.7s ease; }
  .reveal.show{ opacity:1; transform:translateY(0); }

  .text-shimmer {
    background:linear-gradient(90deg,#e2e8ff 0%,#a78bfa 25%,#f0abfc 50%,#a78bfa 75%,#e2e8ff 100%);
    background-size:200% auto;
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:shimmerMove 4s linear infinite;
  }
  .text-fire {
    background:linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899,#f59e0b);
    background-size:300% auto;
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:shimmerMove 5s linear infinite;
  }

  .glass-card {
    background:rgba(255,255,255,0.03);
    backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:24px;
    box-shadow:0 8px 40px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06);
    transition:all 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .glass-card:hover {
    background:rgba(255,255,255,0.055);
    border-color:rgba(255,255,255,0.14);
    transform:translateY(-6px);
    box-shadow:0 24px 60px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1);
  }

  .mag-btn { position:relative; overflow:hidden; transition:transform 0.2s ease,box-shadow 0.2s ease; }
  .mag-btn::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(120deg,transparent 0%,rgba(255,255,255,0.15) 50%,transparent 100%);
    transform:translateX(-100%); transition:transform 0.5s ease;
  }
  .mag-btn:hover::before { transform:translateX(100%); }

  .tcard {
    background:rgba(255,255,255,0.03); backdrop-filter:blur(24px);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:24px; padding:36px 32px;
    min-width:260px; flex-shrink:0;
    transition:all 0.4s ease; position:relative; overflow:hidden;
  }
  .tcard.active { background:rgba(139,92,246,0.08); border-color:rgba(139,92,246,0.3); box-shadow:0 0 40px rgba(139,92,246,0.15); }

  .marquee-track { display:flex; gap:0; animation:marquee 22s linear infinite; width:max-content; }
  .marquee-wrap  { overflow:hidden; }
  .marquee-wrap:hover .marquee-track { animation-play-state:paused; }

  .faq-item { transition:all 0.25s ease; }
  .faq-item:hover { border-color:rgba(139,92,246,0.3) !important; }

  .feat-icon { transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1); }
  .glass-card:hover .feat-icon { transform:scale(1.2) rotate(10deg); }

  .star { animation:starPop 0.4s ease both; }

  /* ══ RESPONSIVE ══ */
  .hero-ring-lg { display:block; }
  @media (max-width:600px) { .hero-ring-lg { display:none; } }

  .scroll-indicator { display:flex; }
  @media (max-width:480px) { .scroll-indicator { display:none; } }

  .trust-pills { display:flex; }
  @media (max-width:360px) { .trust-pills { display:none; } }

  .stats-grid {
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:16px;
  }
  @media (max-width:900px) { .stats-grid { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:480px) { .stats-grid { grid-template-columns:repeat(2,1fr); gap:10px; } }

  .features-grid {
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:18px;
  }
  @media (max-width:900px) { .features-grid { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:560px) { .features-grid { grid-template-columns:1fr; gap:12px; } }

  .cat-grid {
    display:grid;
    grid-template-columns:repeat(6,1fr);
    gap:14px;
  }
  @media (max-width:1100px) { .cat-grid { grid-template-columns:repeat(4,1fr); } }
  @media (max-width:700px)  { .cat-grid { grid-template-columns:repeat(3,1fr); gap:10px; } }
  @media (max-width:440px)  { .cat-grid { grid-template-columns:repeat(2,1fr); gap:8px; } }

  .hero-btns { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
  @media (max-width:440px) {
    .hero-btns { flex-direction:column; align-items:center; }
    .hero-btns button { width:100%; max-width:300px; justify-content:center; }
  }

  .newsletter-flex { display:flex; gap:12px; max-width:460px; margin:0 auto; flex-wrap:wrap; justify-content:center; }
  @media (max-width:500px) {
    .newsletter-flex { flex-direction:column; align-items:stretch; }
    .newsletter-flex input, .newsletter-flex button { width:100%; }
  }

  .section-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
  @media (max-width:480px) { .section-wrap { padding:0 14px; } }

  @media (max-width:500px) { .tcard { padding:24px 18px; min-width:240px; } }

  .faq-wrap { max-width:720px; margin:0 auto; }
  .cta-section { padding:clamp(40px,5vw,88px) clamp(20px,4vw,64px); }
`

const ParticleCanvas = () => {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let raf

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      dx: (Math.random() - 0.5) * 0.35, dy: -(Math.random() * 0.4 + 0.1),
      alpha: Math.random() * 0.5 + 0.1,
      color: ['#7c3aed', '#a855f7', '#ec4899', '#3b82f6', '#06b6d4'][Math.floor(Math.random() * 5)]
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W }
        if (p.x < -10 || p.x > W + 10) p.dx *= -1
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6 }} />
}

const BgScene = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139,92,246,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.06) 1px,transparent 1px)', backgroundSize: '60px 60px', animation: 'gridPulse 6s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', top: '-15%', left: '-8%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.22) 0%,transparent 70%)', filter: 'blur(50px)', animation: 'orbDrift1 18s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', bottom: '-20%', right: '-12%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,0.18) 0%,transparent 70%)', filter: 'blur(55px)', animation: 'orbDrift2 24s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', top: '45%', left: '35%', width: '35vw', height: '35vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 70%)', filter: 'blur(60px)', animation: 'orbDrift3 14s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.15),transparent)', animation: 'scanLine 8s linear infinite' }} />
  </div>
)

const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add('show'), (e.target.dataset.delay || 0) * 1)
      })
    }, { threshold: 0.1 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

const FEATURES = [
  { icon: <FiTrendingUp size={22} />, title: 'Trending Daily', desc: 'Curated hottest picks updated every 24 hours', color: '#3b82f6' },
  { icon: <FiHeart size={22} />, title: 'Wishlist Ready', desc: 'Save & revisit your favorites anytime', color: '#ec4899' },
  { icon: <FiShield size={22} />, title: 'Bank-Level Security', desc: '256-bit SSL encryption on every transaction', color: '#8b5cf6' },
  { icon: <FiPackage size={22} />, title: '2-Day Delivery', desc: 'Lightning fast shipping to your doorstep', color: '#06b6d4' },
  { icon: <FiRefreshCw size={22} />, title: '30-Day Returns', desc: 'No questions asked hassle-free policy', color: '#10b981' },
  { icon: <FiHeadphones size={22} />, title: '24/7 Live Support', desc: 'Real humans always ready to help you', color: '#f59e0b' },
]

const CATEGORIES_STATIC = [
  { name: 'Electronics', emoji: '📱', count: '240+', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { name: 'Fashion', emoji: '👗', count: '180+', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  { name: 'Home & Living', emoji: '🛋️', count: '320+', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { name: 'Sports', emoji: '⚽', count: '95+', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { name: 'Beauty', emoji: '💄', count: '150+', color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  { name: 'Books', emoji: '📚', count: '500+', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
]

const TESTIMONIALS = [
  { name: 'Sarah Ahmed', role: 'Verified Buyer', text: 'ShopNow completely transformed my online shopping experience. The quality is incredible and delivery was faster than promised!', rating: 5, avatar: 'SA', color: '#3b82f6' },
  { name: 'Ali Hassan', role: 'Loyal Member', text: "Been shopping here for 2 years. Prices are unbeatable, collection is huge. The app experience is just *chef's kiss*", rating: 5, avatar: 'AH', color: '#8b5cf6' },
  { name: 'Fatima Khan', role: 'Regular Customer', text: 'Customer support went above and beyond when I had an issue. Resolved in minutes. Absolutely amazing service!', rating: 5, avatar: 'FK', color: '#ec4899' },
  { name: 'Usman Raza', role: 'Tech Enthusiast', text: 'Found my dream laptop at 30% off. Secure payment, fast delivery, perfect packaging. 10/10 would recommend!', rating: 5, avatar: 'UR', color: '#06b6d4' },
  { name: 'Ayesha Malik', role: 'Fashion Lover', text: 'The fashion collection is *fire*. New styles every week, great prices, and returns are super easy. Love it!', rating: 5, avatar: 'AM', color: '#ec4899' },
]

const STATS = [
  { val: '50K+', label: 'Happy Customers', color: '#a78bfa', icon: '😊' },
  { val: '1M+', label: 'Products Sold', color: '#34d399', icon: '📦' },
  { val: '99.8%', label: 'Satisfaction', color: '#f472b6', icon: '⭐' },
  { val: '24/7', label: 'Support', color: '#60a5fa', icon: '💬' },
]

const FAQS = [
  { q: 'How long does delivery take?', a: 'Standard delivery takes 2-3 business days. Express (next-day) also available at checkout.' },
  { q: 'What is the return policy?', a: 'Full 30-day hassle-free returns. Just contact support or use the returns portal — no questions asked.' },
  { q: 'Are payments 100% secure?', a: 'Absolutely. We use 256-bit SSL encryption and support all major payment methods including cards & wallets.' },
  { q: 'Do you ship internationally?', a: 'Yes! We ship to 50+ countries with real-time tracking on every order.' },
  { q: 'Can I track my order?', a: 'Yes — you get a tracking link via SMS and email as soon as your order is dispatched.' },
]

const BRANDS = ['⚡ Premium Quality', '🔒 Secure Payments', '🚀 Fast Delivery', '💎 Exclusive Deals', '🎁 Special Offers', '✨ Top Brands', '🌍 Global Shipping', '🎯 Best Prices']

const SectionBadge = ({ text }) => (
  <span style={{ display: 'inline-block', padding: '5px 16px', marginBottom: 16, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.28)', borderRadius: 999, color: '#c4b5fd', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{text}</span>
)
const SectionHead = ({ badge, title, gradient, sub }) => (
  <div style={{ textAlign: 'center', marginBottom: 48 }}>
    <SectionBadge text={badge} />
    <h2 style={{ fontSize: 'clamp(24px,3.5vw,46px)', fontWeight: 900, color: '#fff', lineHeight: 1.12, marginBottom: 14, fontFamily: "'Syne',sans-serif" }}>
      {gradient ? <span className="text-fire">{title}</span> : title}
    </h2>
    {sub && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(14px,1.5vw,16px)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>{sub}</p>}
  </div>
)

const FaqItem = ({ q, a, delay = 0 }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item reveal" data-delay={delay}
      style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: `1px solid ${open ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 18, marginBottom: 10, overflow: 'hidden', boxShadow: open ? '0 0 24px rgba(139,92,246,0.1)' : 'none', transition: 'all 0.28s ease' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <span style={{ color: open ? '#c4b5fd' : '#fff', fontWeight: 600, fontSize: 'clamp(13px,1.5vw,15px)', textAlign: 'left', fontFamily: "'Outfit',sans-serif", transition: 'color 0.2s' }}>{q}</span>
        <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: open ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.06)', border: `1px solid ${open ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.28s ease', transform: open ? 'rotate(90deg)' : 'none' }}>
          <FiChevronRight size={14} style={{ color: open ? '#a78bfa' : 'rgba(255,255,255,0.4)' }} />
        </div>
      </button>
      <div style={{ maxHeight: open ? 160 : 0, overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <p style={{ padding: '0 20px 18px', color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(13px,1.4vw,14px)', lineHeight: 1.75, fontFamily: "'Outfit',sans-serif" }}>{a}</p>
      </div>
    </div>
  )
}

const TestimonialCarousel = () => {
  const [active, setActive] = useState(0)
  const total = TESTIMONIALS.length
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % total), 4000)
    return () => clearInterval(t)
  }, [total])
  const prev = () => setActive(p => (p - 1 + total) % total)
  const next = () => setActive(p => (p + 1) % total)
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 20, overflow: 'hidden', padding: '8px 4px' }}>
        {TESTIMONIALS.map((t, i) => {
          const isActive = i === active
          if (!isActive && i !== (active - 1 + total) % total && i !== (active + 1) % total) return null
          return (
            <div key={i} className={"tcard" + (isActive ? ' active' : '')}
              style={{ flex: isActive ? '0 0 100%' : '0 0 0%', opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none', transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)', borderColor: isActive ? `${t.color}44` : 'rgba(255,255,255,0.08)', background: isActive ? `${t.color}09` : 'rgba(255,255,255,0.03)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${t.color},transparent)`, borderRadius: '24px 24px 0 0' }} />
              <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <FiStar key={j} size={15} className="star" style={{ color: '#f59e0b', fill: '#f59e0b', animationDelay: `${j * 0.06}s` }} />
                ))}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: 1.75, marginBottom: 24, fontStyle: 'italic', fontFamily: "'Outfit',sans-serif" }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg,${t.color},${t.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: "'Syne',sans-serif", boxShadow: `0 4px 16px ${t.color}44`, flexShrink: 0 }}>{t.avatar}</div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: "'Syne',sans-serif" }}>{t.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>{t.role}</div>
                </div>
                <div style={{ marginLeft: 'auto', padding: '4px 10px', background: `${t.color}18`, border: `1px solid ${t.color}33`, borderRadius: 999, color: t.color, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>Verified ✓</div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 24 }}>
        <button onClick={prev} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        ><FiChevronLeft size={15} /></button>
        <div style={{ display: 'flex', gap: 7 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? 22 : 7, height: 7, borderRadius: 999, border: 'none', cursor: 'pointer', background: i === active ? 'linear-gradient(90deg,#7c3aed,#ec4899)' : 'rgba(255,255,255,0.15)', transition: 'all 0.3s ease', padding: 0 }} />
          ))}
        </div>
        <button onClick={next} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        ><FiChevronRight size={15} /></button>
      </div>
    </div>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [realCategories, setRealCategories] = useState([])
  useReveal()

  useEffect(() => {
    categoryApi.getCategories()
      .then(data => setRealCategories(data.data || data || []))
      .catch(() => { })
  }, [])

  const handleCategoryClick = (cat) => navigate('/products', { state: { selectedCategory: cat } })

  const DOT_COLORS_LIST = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#a855f7', '#06b6d4']
  const EMOJI_MAP = { electronics: '📱', fashion: '👗', clothing: '👗', home: '🛋️', sports: '⚽', beauty: '💄', books: '📚', food: '🍔', toys: '🧸', health: '💊', jewelry: '💍', automotive: '🚗', garden: '🌿', music: '🎵', art: '🎨', travel: '✈️', pets: '🐾', office: '💼' }

  const displayCategories = realCategories.length > 0 ? realCategories : CATEGORIES_STATIC

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#030210 0%,#07051a 40%,#05040f 100%)', fontFamily: "'Outfit',sans-serif", position: 'relative' }}>
      <style>{GLOBAL_CSS}</style>
      <BgScene />
      <ParticleCanvas />

      {/* ✅ FIX: Navbar props pass kiye */}
      <Navbar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ═══ HERO ═══ */}
        <section style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(60px,8vw,100px) 20px clamp(40px,6vw,60px)', textAlign: 'center', position: 'relative' }}>
          <div className="hero-ring-lg" style={{ position: 'absolute', width: 'clamp(300px,50vw,600px)', height: 'clamp(300px,50vw,600px)', borderRadius: '50%', border: '1px solid rgba(139,92,246,0.1)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'rotateSlow 30s linear infinite', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 0 16px rgba(139,92,246,0.8)' }} />
          </div>
          <div className="hero-ring-lg" style={{ position: 'absolute', width: 'clamp(200px,35vw,400px)', height: 'clamp(200px,35vw,400px)', borderRadius: '50%', border: '1px solid rgba(236,72,153,0.07)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'rotateSlow 20s linear infinite reverse', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 780, position: 'relative', width: '100%' }}>
            <div className="anim-hero" style={{ animationDelay: '0.1s' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', marginBottom: 'clamp(16px,3vw,28px)', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.22)', borderRadius: 999, color: '#93c5fd', fontSize: 'clamp(11px,1.2vw,13px)', fontWeight: 600, letterSpacing: '0.05em' }}>
                <FiZap size={12} style={{ color: '#fbbf24' }} /> New Collection Just Dropped
              </span>
            </div>

            <h1 className="anim-hero" style={{ animationDelay: '0.2s', fontSize: 'clamp(36px,7vw,90px)', fontWeight: 900, color: '#fff', lineHeight: 1.05, marginBottom: 'clamp(16px,3vw,24px)', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.03em' }}>
              Shop Smarter,{' '}<br />
              <span className="text-fire">Live Better</span>
            </h1>

            <p className="anim-hero" style={{ animationDelay: '0.35s', fontSize: 'clamp(14px,1.8vw,20px)', color: 'rgba(255,255,255,0.52)', maxWidth: 540, margin: `0 auto clamp(28px,5vw,44px)`, lineHeight: 1.7 }}>
              Premium products, unbeatable prices & lightning-fast delivery — everything you love in one place.
            </p>

            <div className="anim-hero hero-btns" style={{ animationDelay: '0.5s' }}>
              <button onClick={() => navigate('/products')} className="mag-btn"
                style={{ padding: 'clamp(12px,2vw,16px) clamp(24px,4vw,38px)', borderRadius: 16, fontWeight: 700, fontSize: 'clamp(14px,1.5vw,16px)', cursor: 'pointer', background: 'linear-gradient(135deg,#4f46e5,#7c3aed,#a21caf)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 28px rgba(124,58,237,0.45)', fontFamily: "'Outfit',sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.6)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 4px 28px rgba(124,58,237,0.45)' }}
              >
                <FiShoppingBag size={18} /> Start Shopping
              </button>
              <button onClick={() => navigate('/about')}
                style={{ padding: 'clamp(12px,2vw,16px) clamp(24px,4vw,38px)', borderRadius: 16, fontWeight: 600, fontSize: 'clamp(14px,1.5vw,16px)', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.82)', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.25s ease', fontFamily: "'Outfit',sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Learn More <FiArrowRight size={15} />
              </button>
            </div>

            <div className="anim-hero trust-pills" style={{ animationDelay: '0.65s', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 'clamp(24px,4vw,40px)' }}>
              {['🔒 SSL Secured', '⚡ Fast Delivery', '↩️ Free Returns'].map((item, i) => (
                <span key={i} style={{ padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(11px,1.1vw,12px)', fontWeight: 500 }}>{item}</span>
              ))}
            </div>
          </div>

          <div className="scroll-indicator" style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom,rgba(139,92,246,0.6),transparent)' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(139,92,246,0.7)', animation: 'bobble 2s ease-in-out infinite' }} />
          </div>
        </section>

        {/* ═══ MARQUEE ═══ */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(139,92,246,0.04)', padding: '12px 0', marginBottom: 'clamp(50px,8vw,90px)', overflow: 'hidden' }}>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
                <span key={i} style={{ padding: '0 28px', color: 'rgba(255,255,255,0.35)', fontSize: 'clamp(10px,1.1vw,13px)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.06)' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="section-wrap">

          {/* ═══ STATS ═══ */}
          <section style={{ marginBottom: 'clamp(50px,8vw,90px)' }}>
            <div className="stats-grid">
              {STATS.map((s, i) => (
                <div key={i} className="glass-card reveal" data-delay={i * 80} style={{ padding: 'clamp(20px,3vw,36px) clamp(16px,2.5vw,24px)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(24px,3vw,32px)', marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontSize: 'clamp(26px,3.5vw,48px)', fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 7, fontFamily: "'Syne',sans-serif" }}>{s.val}</div>
                  <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: 'clamp(12px,1.2vw,14px)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ FEATURES ═══ */}
          <section style={{ marginBottom: 'clamp(50px,8vw,90px)' }}>
            <div className="reveal"><SectionHead badge="Why ShopNow" title="Built Different" gradient sub="Every detail crafted for the best shopping experience on the web" /></div>
            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="glass-card reveal" data-delay={i * 70} style={{ padding: 'clamp(20px,3vw,32px) clamp(16px,2.5vw,28px)', borderTop: `2px solid ${f.color}33`, cursor: 'default' }}>
                  <div className="feat-icon" style={{ width: 48, height: 48, borderRadius: 14, marginBottom: 16, background: `${f.color}15`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color }}>
                    {f.icon}
                  </div>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(14px,1.5vw,17px)', marginBottom: 7, fontFamily: "'Syne',sans-serif" }}>{f.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(12px,1.3vw,14px)', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ CATEGORIES ═══ */}
          <section style={{ marginBottom: 'clamp(50px,8vw,90px)' }}>
            <div className="reveal"><SectionHead badge="Explore" title="Shop by Category" sub="Explore thousands of products across every category you love" /></div>
            <div className="cat-grid">
              {displayCategories.map((c, i) => {
                const color = c.color || DOT_COLORS_LIST[i % DOT_COLORS_LIST.length]
                const bg = c.bg || color + '18'
                const isReal = !!c.id
                const nameLower = (c.name || '').toLowerCase()
                const emojiKey = Object.keys(EMOJI_MAP).find(k => nameLower.includes(k))
                const emoji = c.emoji || (emojiKey ? EMOJI_MAP[emojiKey] : '🛍️')
                return (
                  <div key={c.id || i}
                    onClick={() => isReal ? handleCategoryClick(c) : navigate('/products')}
                    style={{ background: bg, backdropFilter: 'blur(20px)', border: `1px solid ${color}25`, borderRadius: 18, padding: 'clamp(16px,2.5vw,28px) clamp(10px,2vw,16px)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.03)'; e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.boxShadow = `0 14px 36px ${color}22` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = `${color}25`; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
                    <div style={{ fontSize: 'clamp(26px,3.5vw,38px)', marginBottom: 10 }}>{emoji}</div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(11px,1.2vw,14px)', marginBottom: 3, fontFamily: "'Syne',sans-serif" }}>{c.name}</div>
                    <div style={{ color: color, fontSize: 'clamp(10px,1vw,12px)', fontWeight: 600 }}>{c.count ? `${c.count} items` : 'Browse'}</div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ═══ TESTIMONIALS ═══ */}
          <section style={{ marginBottom: 'clamp(50px,8vw,90px)' }}>
            <div className="reveal"><SectionHead badge="Reviews" title="50,000+ Happy Customers" sub="Real people, real reviews — see what everyone's saying" /></div>
            <div className="reveal"><TestimonialCarousel /></div>
          </section>

          {/* ═══ FAQ ═══ */}
          <section style={{ marginBottom: 'clamp(50px,8vw,90px)' }}>
            <div className="reveal"><SectionHead badge="FAQ" title="Got Questions?" sub="Everything you need to know before you start shopping" /></div>
            <div className="faq-wrap">
              {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} delay={i * 80} />)}
            </div>
          </section>

          {/* ═══ NEWSLETTER ═══ */}
          <section style={{ marginBottom: 'clamp(50px,8vw,90px)' }} className="reveal">
            <div style={{ background: 'rgba(59,130,246,0.05)', backdropFilter: 'blur(24px)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 24, padding: 'clamp(32px,5vw,72px) clamp(20px,5vw,72px)', textAlign: 'center', position: 'relative', overflow: 'hidden', animation: 'borderGlow 4s ease-in-out infinite' }}>
              <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '40%', height: '200%', background: 'radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ fontSize: 'clamp(32px,4vw,44px)', marginBottom: 14 }}>📬</div>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(20px,3vw,38px)', marginBottom: 10, fontFamily: "'Syne',sans-serif" }}>Never Miss a Deal</h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(13px,1.4vw,16px)', maxWidth: 420, margin: '0 auto clamp(20px,4vw,32px)', lineHeight: 1.7 }}>
                Exclusive drops, flash sales & personal picks delivered straight to your inbox.
              </p>
              <div className="newsletter-flex">
                <input type="email" placeholder="Your email address"
                  style={{ flex: 1, minWidth: 180, padding: 'clamp(10px,1.5vw,14px) 18px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 'clamp(13px,1.4vw,15px)', outline: 'none', fontFamily: "'Outfit',sans-serif" }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; e.currentTarget.style.background = 'rgba(59,130,246,0.08)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                />
                <button className="mag-btn"
                  style={{ padding: 'clamp(10px,1.5vw,14px) clamp(18px,2.5vw,28px)', borderRadius: 12, background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 'clamp(13px,1.4vw,15px)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', fontFamily: "'Outfit',sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  Subscribe <FiArrowRight size={14} />
                </button>
              </div>
            </div>
          </section>

          {/* ═══ FINAL CTA ═══ */}
          <section style={{ marginBottom: 'clamp(50px,8vw,80px)' }} className="reveal">
            <div className="cta-section" style={{ background: 'linear-gradient(135deg,rgba(79,70,229,0.2),rgba(124,58,237,0.2),rgba(236,72,153,0.15))', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 24, textAlign: 'center', backdropFilter: 'blur(24px)', boxShadow: '0 0 80px rgba(139,92,246,0.1)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', width: 'clamp(200px,35vw,400px)', height: 'clamp(200px,35vw,400px)', borderRadius: '50%', border: '1px solid rgba(139,92,246,0.08)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'rotateSlow 20s linear infinite', pointerEvents: 'none' }} />
              <div style={{ fontSize: 'clamp(36px,5vw,52px)', marginBottom: 16 }}>🛍️</div>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(24px,4vw,52px)', marginBottom: 14, fontFamily: "'Syne',sans-serif", letterSpacing: '-0.02em' }}>
                Ready to <span className="text-shimmer">Explore?</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(14px,1.6vw,18px)', maxWidth: 460, margin: '0 auto clamp(24px,4vw,40px)', lineHeight: 1.7 }}>
                Join 50,000+ happy customers and discover your next favorite product today.
              </p>
              <button onClick={() => navigate('/products')} className="mag-btn"
                style={{ padding: 'clamp(14px,2vw,20px) clamp(32px,5vw,56px)', borderRadius: 16, fontWeight: 800, fontSize: 'clamp(14px,1.6vw,18px)', cursor: 'pointer', background: 'linear-gradient(135deg,#4f46e5,#7c3aed,#a21caf)', border: 'none', color: '#fff', boxShadow: '0 8px 40px rgba(124,58,237,0.5)', display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'Syne',sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 16px 56px rgba(124,58,237,0.65)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(124,58,237,0.5)' }}
              >
                <FiShoppingBag size={20} /> Explore All Products
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default Home