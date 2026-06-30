import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import {
  FiAward, FiUsers, FiTrendingUp, FiShield, FiHeart, FiStar,
  FiCheckCircle, FiTarget, FiZap, FiGlobe, FiMail, FiPhone,
  FiMapPin, FiArrowRight, FiPackage, FiRefreshCw
} from 'react-icons/fi'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { overflow-x: hidden; }

  @keyframes orbDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(60px,-40px) scale(1.12)} 66%{transform:translate(-25px,45px) scale(0.93)} }
  @keyframes orbDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,30px) scale(1.08)} }
  @keyframes orbDrift3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-50px)} }
  @keyframes gridPulse { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
  @keyframes scanLine { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
  @keyframes shimmerMove { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes glowPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes borderGlow { 0%,100%{box-shadow:0 0 20px rgba(139,92,246,0.2)} 50%{box-shadow:0 0 50px rgba(139,92,246,0.5),0 0 100px rgba(236,72,153,0.15)} }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  .about-page { font-family:'Outfit',sans-serif; }
  .about-bg-grid { position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px);background-size:60px 60px;animation:gridPulse 6s ease-in-out infinite; }
  .about-orb-1 { position:fixed;pointer-events:none;z-index:0;top:-15%;left:-8%;width:55vw;height:55vw;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 70%);filter:blur(50px);animation:orbDrift1 18s ease-in-out infinite; }
  .about-orb-2 { position:fixed;pointer-events:none;z-index:0;bottom:-20%;right:-12%;width:50vw;height:50vw;border-radius:50%;background:radial-gradient(circle,rgba(236,72,153,0.13) 0%,transparent 70%);filter:blur(55px);animation:orbDrift2 22s ease-in-out infinite; }
  .about-orb-3 { position:fixed;pointer-events:none;z-index:0;top:40%;left:30%;width:35vw;height:35vw;border-radius:50%;background:radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%);filter:blur(60px);animation:orbDrift3 14s ease-in-out infinite; }
  .about-scan { position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:0;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.12),transparent);animation:scanLine 10s linear infinite; }

  .text-shimmer { background:linear-gradient(90deg,#e2e8ff 0%,#a78bfa 25%,#f0abfc 50%,#a78bfa 75%,#e2e8ff 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimmerMove 4s linear infinite; }
  .text-fire { background:linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899,#f59e0b);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimmerMove 5s linear infinite; }

  .glow-line { height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.6),rgba(236,72,153,0.55),transparent);animation:glowPulse 3s ease-in-out infinite; }

  .glass-card { background:rgba(255,255,255,0.03);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.08);border-radius:24px;box-shadow:0 8px 40px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06);transition:all 0.35s cubic-bezier(0.4,0,0.2,1); }
  .glass-card:hover { background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.13);transform:translateY(-5px);box-shadow:0 20px 56px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1); }

  .reveal { opacity:0;transform:translateY(36px);transition:opacity 0.7s ease,transform 0.7s ease; }
  .reveal.show { opacity:1;transform:translateY(0); }

  .mag-btn { position:relative;overflow:hidden;transition:transform 0.2s ease,box-shadow 0.2s ease; }
  .mag-btn::before { content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,0.15),transparent);transform:translateX(-100%);transition:transform 0.5s ease; }
  .mag-btn:hover::before { transform:translateX(100%); }

  .val-icon { transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1); }
  .glass-card:hover .val-icon { transform:scale(1.2) rotate(8deg); }
  .team-img { transition:transform 0.6s cubic-bezier(0.4,0,0.2,1); }
  .team-card:hover .team-img { transform:scale(1.08); }

  .marquee-track { display:flex;animation:marquee 25s linear infinite;width:max-content; }
  .marquee-wrap:hover .marquee-track { animation-play-state:paused; }

  /* ── Hero rings — hide on mobile to avoid overflow ── */
  .about-ring { display:block; }
  @media (max-width:600px) { .about-ring { display:none !important; } }

  /* ── Hero trust pills wrap nicely ── */
  .about-trust { display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:32px; }
  @media (max-width:360px) { .about-trust { display:none; } }

  /* ── Hero buttons ── */
  .about-hero-btns { display:flex;gap:12px;justify-content:center;flex-wrap:wrap; }
  @media (max-width:440px) { .about-hero-btns { flex-direction:column;align-items:center; } .about-hero-btns button { width:100%;max-width:300px;justify-content:center; } }

  ::-webkit-scrollbar { width:5px;background:#05040f; }
  ::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.35);border-radius:3px; }
`

const STATS = [
  { val: '5M+', label: 'Active Users', icon: '👥', color: '#3b82f6' },
  { val: '1M+', label: 'Products', icon: '📦', color: '#8b5cf6' },
  { val: '98%', label: 'Satisfaction', icon: '⭐', color: '#ec4899' },
  { val: '50+', label: 'Countries', icon: '🌍', color: '#10b981' },
]

const VALUES = [
  { icon: <FiHeart size={20} />, title: 'Customer First', desc: 'Your satisfaction is our north star. Every decision we make starts and ends with your experience.', color: '#ec4899' },
  { icon: <FiShield size={20} />, title: 'Trust & Security', desc: '256-bit SSL encryption, verified sellers, and complete transparency in every transaction.', color: '#3b82f6' },
  { icon: <FiZap size={20} />, title: 'Innovation', desc: 'Constantly evolving with AI-powered recommendations, AR try-ons, and seamless checkout flows.', color: '#f59e0b' },
  { icon: <FiAward size={20} />, title: 'Quality Products', desc: 'Every item is hand-curated by our team of experts to meet our stringent quality standards.', color: '#8b5cf6' },
  { icon: <FiGlobe size={20} />, title: 'Global Reach', desc: 'Connecting 5M+ customers in 50+ countries with the products they love, delivered fast.', color: '#06b6d4' },
  { icon: <FiUsers size={20} />, title: 'Community', desc: 'A thriving community of shoppers, sellers, and creators who share a passion for quality.', color: '#10b981' },
]

const MILESTONES = [
  { year: '2018', title: 'Company Founded', desc: 'ShopNow was born with a vision to revolutionize online shopping', color: '#3b82f6' },
  { year: '2019', title: '10K Customers', desc: 'Reached our first 10,000 happy customers in just 8 months', color: '#8b5cf6' },
  { year: '2020', title: 'Global Expansion', desc: 'Expanded to 15 countries, breaking geographical boundaries', color: '#ec4899' },
  { year: '2021', title: '1M Products', desc: 'Catalog grew to over 1 million carefully curated quality products', color: '#f59e0b' },
  { year: '2022', title: 'Award Winner 🏆', desc: 'Recognized as Best E-commerce Platform of the Year globally', color: '#10b981' },
  { year: '2023', title: '50K+ Reviews', desc: 'Achieved 50,000+ five-star customer reviews — and counting', color: '#06b6d4' },
]

const TEAM = [
  { name: 'Sarah Johnson', role: 'CEO & Founder', avatar: 'SJ', bio: 'Visionary leader with 15+ years in e-commerce', color: '#3b82f6' },
  { name: 'Michael Chen', role: 'Chief Technology Officer', avatar: 'MC', bio: 'Tech innovator building seamless shopping experiences', color: '#8b5cf6' },
  { name: 'Emily Rodriguez', role: 'Head of Operations', avatar: 'ER', bio: 'Operations expert ensuring every order is perfect', color: '#ec4899' },
  { name: 'David Kumar', role: 'Marketing Director', avatar: 'DK', bio: 'Creative marketer building meaningful connections', color: '#f59e0b' },
  { name: 'Lisa Anderson', role: 'Customer Success Lead', avatar: 'LA', bio: 'Dedicated to creating exceptional customer journeys', color: '#10b981' },
  { name: 'James Wilson', role: 'Product Manager', avatar: 'JW', bio: 'Product strategist with an eye for what people love', color: '#06b6d4' },
]

const TESTIMONIALS = [
  { name: 'Jessica Miller', role: 'Fashion Enthusiast', text: 'ShopNow completely transformed how I shop. Quality, speed, and service — all world class!', rating: 5, avatar: 'JM', color: '#ec4899' },
  { name: 'Robert Taylor', role: 'Tech Professional', text: 'Fast delivery, amazing products, and excellent customer support. This is my go-to platform!', rating: 5, avatar: 'RT', color: '#3b82f6' },
  { name: 'Maria Garcia', role: 'Small Business Owner', text: 'The variety and user-friendly interface is incredible. Shopping has never been this enjoyable!', rating: 5, avatar: 'MG', color: '#8b5cf6' },
]

const PROMISES = [
  { icon: <FiCheckCircle size={18} />, title: '100% Authentic', sub: 'Verified quality guarantee', color: '#3b82f6' },
  { icon: <FiPackage size={18} />, title: 'Fast Shipping', sub: '2-day delivery available', color: '#8b5cf6' },
  { icon: <FiRefreshCw size={18} />, title: '30-Day Returns', sub: 'Hassle-free policy', color: '#ec4899' },
  { icon: <FiUsers size={18} />, title: '24/7 Support', sub: 'Real humans, always ready', color: '#10b981' },
]

const BRANDS = ['⚡ 5M+ Customers', '🏆 Award Winning', '🌍 50+ Countries', '🔒 Bank Security', '🚀 2-Day Delivery', '💎 1M+ Products', '⭐ 98% Satisfaction', '🎯 Best Prices']

const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add('show'), Number(e.target.dataset.delay || 0))
      })
    }, { threshold: 0.1 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

const SectionBadge = ({ text }) => (
  <span style={{ display: 'inline-block', padding: '5px 16px', marginBottom: 14, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.28)', borderRadius: 999, color: '#c4b5fd', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{text}</span>
)
const SectionHead = ({ badge, title, fire, sub }) => (
  <div style={{ textAlign: 'center', marginBottom: 48 }}>
    <SectionBadge text={badge} />
    <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 900, color: '#fff', lineHeight: 1.12, marginBottom: 12, fontFamily: "'Syne',sans-serif" }}>
      {fire ? <span className="text-fire">{title}</span> : title}
    </h2>
    {sub && <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 'clamp(13px,1.4vw,15px)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>{sub}</p>}
  </div>
)

const About = () => {
  const navigate = useNavigate()
  useReveal()

  return (
    <div className="about-page" style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#030210 0%,#07051a 40%,#05040f 100%)', position: 'relative' }}>
      <style>{STYLES}</style>

      <div className="about-bg-grid" />
      <div className="about-orb-1" />
      <div className="about-orb-2" />
      <div className="about-orb-3" />
      <div className="about-scan" />

      <Navbar />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ══ HERO ══ */}
        <section style={{ minHeight: '72vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(60px,8vw,100px) 20px clamp(40px,6vw,60px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Rings — hidden on mobile via CSS */}
          <div className="about-ring" style={{ position: 'absolute', width: 'clamp(280px,45vw,600px)', height: 'clamp(280px,45vw,600px)', borderRadius: '50%', border: '1px solid rgba(139,92,246,0.08)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'rotateSlow 35s linear infinite', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 0 16px rgba(139,92,246,0.8)' }} />
          </div>
          <div className="about-ring" style={{ position: 'absolute', width: 'clamp(180px,30vw,420px)', height: 'clamp(180px,30vw,420px)', borderRadius: '50%', border: '1px solid rgba(236,72,153,0.06)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'rotateSlow 22s linear infinite reverse', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 820, position: 'relative', animation: 'fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) both', width: '100%' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 20px', marginBottom: 28, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.22)', borderRadius: 999, color: '#c4b5fd', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              🏆 Award-Winning Platform
            </span>
            <h1 style={{ fontSize: 'clamp(32px,7vw,86px)', fontWeight: 900, color: '#fff', lineHeight: 1.05, marginBottom: 22, fontFamily: "'Syne',sans-serif", letterSpacing: '-0.03em' }}>
              The Story Behind{' '}
              <span className="text-fire">ShopNow</span>
            </h1>
            <p style={{ fontSize: 'clamp(14px,1.8vw,19px)', color: 'rgba(255,255,255,0.48)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.75 }}>
              We didn't just build an e-commerce platform — we built a movement. A commitment to making every purchase feel personal, every product feel premium, and every customer feel valued.
            </p>
            <div className="about-hero-btns">
              <button onClick={() => navigate('/products')} className="mag-btn"
                style={{ padding: 'clamp(12px,2vw,14px) clamp(24px,4vw,32px)', borderRadius: 14, fontWeight: 700, fontSize: 'clamp(14px,1.5vw,15px)', cursor: 'pointer', background: 'linear-gradient(135deg,#4f46e5,#7c3aed,#a21caf)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 28px rgba(124,58,237,0.45)', fontFamily: "'Outfit',sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.6)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 28px rgba(124,58,237,0.45)' }}
              >
                Start Shopping <FiArrowRight size={16} />
              </button>
            </div>
            <div className="about-trust">
              {['🔒 SSL Secured', '⚡ 2-Day Delivery', '↩️ Free Returns', '🌍 50+ Countries'].map((item, i) => (
                <span key={i} style={{ padding: '5px 13px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.42)', fontSize: 11, fontWeight: 500 }}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ MARQUEE ══ */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(139,92,246,0.04)', padding: '13px 0', marginBottom: 'clamp(40px,6vw,80px)', overflow: 'hidden' }}>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
                <span key={i} style={{ padding: '0 28px', color: 'rgba(255,255,255,0.32)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.06)' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(14px,3vw,20px)' }}>

          {/* ══ STATS ══ */}
          <section style={{ marginBottom: 'clamp(40px,6vw,88px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 16 }}>
              {STATS.map((s, i) => (
                <div key={i} className="glass-card reveal" data-delay={i * 80} style={{ padding: 'clamp(20px,3vw,36px) clamp(14px,2vw,24px)', textAlign: 'center', borderTop: `2px solid ${s.color}30` }}>
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontSize: 'clamp(28px,3vw,46px)', fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>{s.val}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(11px,1.2vw,13px)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ OUR STORY ══ */}
          <section style={{ marginBottom: 'clamp(40px,6vw,88px)' }}>
            <div className="reveal"><SectionHead badge="Our Story" title="Built with Purpose" fire sub="From a small team with a big dream to a global platform trusted by millions" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 24, alignItems: 'start' }}>
              <div className="glass-card reveal" style={{ padding: 'clamp(24px,4vw,40px) clamp(18px,3vw,36px)', position: 'relative', overflow: 'hidden' }}>
                <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(18px,2vw,22px)', fontWeight: 900, color: '#fff', marginBottom: 20 }}>
                  From Garage to <span className="text-shimmer">Global</span>
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.85, fontSize: 'clamp(13px,1.4vw,14px)', marginBottom: 16 }}>
                  Founded in 2018, ShopNow began with a simple yet powerful vision: create an online shopping experience that puts customers first.
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.85, fontSize: 'clamp(13px,1.4vw,14px)', marginBottom: 16 }}>
                  We believe shopping should be more than just transactions — it should be an experience filled with discovery, trust, and delight.
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.85, fontSize: 'clamp(13px,1.4vw,14px)' }}>
                  Today we're proud to be one of the fastest-growing e-commerce platforms, but our mission remains unchanged.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {PROMISES.map((p, i) => (
                  <div key={i} className="glass-card reveal" data-delay={i * 70} style={{ padding: 'clamp(16px,2.5vw,22px) clamp(14px,2vw,24px)', display: 'flex', alignItems: 'center', gap: 18, borderLeft: `3px solid ${p.color}55` }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: `${p.color}15`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.color, flexShrink: 0 }}>{p.icon}</div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 2, fontFamily: "'Syne',sans-serif" }}>{p.title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ MISSION & VISION ══ */}
          <section style={{ marginBottom: 'clamp(40px,6vw,88px)' }}>
            <div className="reveal"><SectionHead badge="Purpose" title="Mission & Vision" sub="The principles that guide every decision we make" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: 20 }}>
              {[
                { badge: 'Our Mission', color: '#3b82f6', icon: <FiTarget size={22} />, text: 'To empower people worldwide with access to quality products through a seamless, trustworthy, and delightful shopping experience.' },
                { badge: 'Our Vision', color: '#8b5cf6', icon: <FiZap size={22} />, text: 'To become the world\'s most trusted and innovative e-commerce platform, setting new standards for customer experience and technological excellence.' },
                { badge: 'Our Promise', color: '#ec4899', icon: <FiHeart size={22} />, text: 'Every feature we build, every product we list — it all starts with one question: does this make our customer\'s life better?' },
              ].map((item, i) => (
                <div key={i} className="glass-card reveal" data-delay={i * 100} style={{ padding: 'clamp(24px,4vw,40px) clamp(18px,3vw,36px)', borderTop: `2px solid ${item.color}35`, position: 'relative', overflow: 'hidden' }}>
                  <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `${item.color}15`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, marginBottom: 20 }}>{item.icon}</div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 12 }}>{item.badge}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, fontSize: 'clamp(13px,1.4vw,14px)' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ══ CORE VALUES ══ */}
          <section style={{ marginBottom: 'clamp(40px,6vw,88px)' }}>
            <div className="reveal"><SectionHead badge="Values" title="What Drives Us" fire sub="Six principles that shape every product, policy, and person at ShopNow" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: 18 }}>
              {VALUES.map((v, i) => (
                <div key={i} className="glass-card reveal" data-delay={i * 60} style={{ padding: 'clamp(20px,3vw,32px) clamp(16px,2.5vw,28px)', borderTop: `2px solid ${v.color}33`, cursor: 'default' }}>
                  <div className="val-icon" style={{ width: 50, height: 50, borderRadius: 16, marginBottom: 18, background: `${v.color}15`, border: `1px solid ${v.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: v.color }}>{v.icon}</div>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(14px,1.5vw,16px)', marginBottom: 8, fontFamily: "'Syne',sans-serif" }}>{v.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 'clamp(12px,1.3vw,13px)', lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ══ TIMELINE ══ */}
          <section style={{ marginBottom: 'clamp(40px,6vw,88px)' }}>
            <div className="reveal"><SectionHead badge="Journey" title="Our Milestones" sub="Six years of growth, innovation, and relentless pursuit of excellence" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: 18 }}>
              {MILESTONES.map((m, i) => (
                <div key={i} className="glass-card reveal" data-delay={i * 70} style={{ padding: 'clamp(18px,2.5vw,28px)', borderLeft: `3px solid ${m.color}55`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 14px', borderRadius: 999, background: `${m.color}15`, border: `1px solid ${m.color}30`, color: m.color, fontSize: 12, fontWeight: 800, marginBottom: 14, fontFamily: "'Syne',sans-serif" }}>{m.year}</div>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>{m.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.65 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ══ TEAM ══ */}
          <section style={{ marginBottom: 'clamp(40px,6vw,88px)' }}>
            <div className="reveal"><SectionHead badge="Team" title="The People Behind It" sub="Diverse minds, unified mission — meet the crew building ShopNow every day" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: 18 }}>
              {TEAM.map((m, i) => (
                <div key={i} className="glass-card team-card reveal" data-delay={i * 65} style={{ overflow: 'hidden', position: 'relative' }}>
                  <div className="glow-line" />
                  <div style={{ height: 160, background: `linear-gradient(135deg,${m.color}18,${m.color}08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div className="team-img" style={{ width: 88, height: 88, borderRadius: '50%', background: `linear-gradient(135deg,${m.color},${m.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 26, fontFamily: "'Syne',sans-serif", boxShadow: `0 8px 28px ${m.color}44,0 0 0 4px rgba(255,255,255,0.08)` }}>{m.avatar}</div>
                  </div>
                  <div style={{ padding: 'clamp(16px,2.5vw,22px) clamp(14px,2vw,24px)' }}>
                    <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 15, marginBottom: 3, fontFamily: "'Syne',sans-serif" }}>{m.name}</h3>
                    <div style={{ color: m.color, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>{m.role}</div>
                    <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, lineHeight: 1.6 }}>{m.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ TESTIMONIALS ══ */}
          <section style={{ marginBottom: 'clamp(40px,6vw,88px)' }}>
            <div className="reveal"><SectionHead badge="Reviews" title="What Customers Say" sub="Real stories from real people who trust ShopNow every day" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: 18 }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="glass-card reveal" data-delay={i * 80} style={{ padding: 'clamp(20px,3vw,32px) clamp(16px,2.5vw,28px)', borderTop: `2px solid ${t.color}33`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${t.color},transparent)` }} />
                  <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                    {Array.from({ length: t.rating }).map((_, j) => <FiStar key={j} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />)}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(13px,1.4vw,14px)', lineHeight: 1.8, marginBottom: 24, fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg,${t.color},${t.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{t.avatar}</div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: "'Syne',sans-serif" }}>{t.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{t.role}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 999, background: `${t.color}15`, border: `1px solid ${t.color}30`, color: t.color, fontSize: 10, fontWeight: 700 }}>Verified ✓</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ CONTACT ══ */}
          <section style={{ marginBottom: 'clamp(40px,6vw,88px)' }}>
            <div className="reveal"><SectionHead badge="Contact" title="Get In Touch" sub="We'd love to hear from you — our team responds within 24 hours" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: 16, marginBottom: 24 }}>
              {[
                { icon: <FiMail size={20} />, title: 'Email Us', val: 'support@shopnow.com', color: '#3b82f6' },
                { icon: <FiPhone size={20} />, title: 'Call Us', val: '+1 (555) 123-4567', color: '#8b5cf6' },
                { icon: <FiMapPin size={20} />, title: 'Visit Us', val: '123 Commerce St, NYC', color: '#ec4899' },
              ].map((c, i) => (
                <div key={i} className="glass-card reveal" data-delay={i * 80} style={{ padding: 'clamp(20px,3vw,32px) clamp(14px,2vw,24px)', textAlign: 'center', borderTop: `2px solid ${c.color}33` }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `${c.color}15`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, margin: '0 auto 16px' }}>{c.icon}</div>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 8, fontFamily: "'Syne',sans-serif" }}>{c.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{c.val}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ══ FINAL CTA ══ */}
          <section style={{ marginBottom: 'clamp(40px,6vw,80px)' }} className="reveal">
            <div style={{ background: 'linear-gradient(135deg,rgba(79,70,229,0.2),rgba(124,58,237,0.2),rgba(236,72,153,0.15))', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 28, padding: 'clamp(40px,5vw,88px) clamp(20px,5vw,64px)', textAlign: 'center', backdropFilter: 'blur(24px)', boxShadow: '0 0 80px rgba(139,92,246,0.1)', position: 'relative', overflow: 'hidden' }}>
              <div className="glow-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
              <div style={{ fontSize: 'clamp(36px,5vw,48px)', marginBottom: 18 }}>🛍️</div>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(24px,4vw,50px)', marginBottom: 14, fontFamily: "'Syne',sans-serif", letterSpacing: '-0.02em' }}>
                Ready to Join <span className="text-shimmer">5M+ Shoppers?</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(14px,1.6vw,16px)', maxWidth: 440, margin: '0 auto 36px', lineHeight: 1.75 }}>
                Discover thousands of products, unbeatable prices, and lightning-fast delivery — all in one place.
              </p>
              <button onClick={() => navigate('/products')} className="mag-btn"
                style={{ padding: 'clamp(14px,2vw,18px) clamp(28px,5vw,52px)', borderRadius: 16, fontWeight: 800, fontSize: 'clamp(14px,1.6vw,17px)', cursor: 'pointer', background: 'linear-gradient(135deg,#4f46e5,#7c3aed,#a21caf)', border: 'none', color: '#fff', boxShadow: '0 8px 40px rgba(124,58,237,0.5)', display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: "'Syne',sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 16px 52px rgba(124,58,237,0.65)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(124,58,237,0.5)' }}
              >
                Explore All Products <FiArrowRight size={20} />
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default About