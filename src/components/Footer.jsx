import { useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiMail, FiPhone, FiMapPin, FiHeart, FiArrowRight } from 'react-icons/fi'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

  @keyframes shimmerMove {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes glowPulse {
    0%,100% { opacity:0.5; }
    50%      { opacity:1; }
  }
  @keyframes footerOrb1 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(30px,-20px) scale(1.08); }
  }
  @keyframes footerOrb2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-20px,15px) scale(1.05); }
  }

  .footer-root {
    font-family:'Outfit',sans-serif;
    position:relative; overflow:hidden;
  }

  .footer-orb-1 {
    position:absolute; pointer-events:none;
    top:-40%; left:-10%; width:50vw; height:50vw; border-radius:50%;
    background:radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%);
    filter:blur(60px); animation:footerOrb1 18s ease-in-out infinite;
  }
  .footer-orb-2 {
    position:absolute; pointer-events:none;
    bottom:-40%; right:-10%; width:45vw; height:45vw; border-radius:50%;
    background:radial-gradient(circle,rgba(236,72,153,0.1) 0%,transparent 70%);
    filter:blur(55px); animation:footerOrb2 22s ease-in-out infinite;
  }

  .footer-shimmer {
    background: linear-gradient(90deg,#e2e8ff 0%,#a78bfa 25%,#f0abfc 50%,#a78bfa 75%,#e2e8ff 100%);
    background-size:200% auto;
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:shimmerMove 4s linear infinite;
  }

  .footer-glow-line {
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(139,92,246,0.6),rgba(236,72,153,0.55),transparent);
    animation:glowPulse 3s ease-in-out infinite;
  }

  .footer-link {
    color:rgba(255,255,255,0.45);
    font-size:13px; text-decoration:none; cursor:pointer;
    transition:all 0.2s ease;
    display:flex; align-items:center; gap:6px;
    background:none; border:none; padding:0;
    font-family:'Outfit',sans-serif; text-align:left;
  }
  .footer-link:hover { color:#c4b5fd; transform:translateX(4px); }

  .social-btn {
    width:36px; height:36px; border-radius:10px;
    background:rgba(255,255,255,0.05);
    border:1px solid rgba(255,255,255,0.1);
    display:flex; align-items:center; justify-content:center;
    color:rgba(255,255,255,0.5); cursor:pointer;
    transition:all 0.22s ease; flex-shrink:0;
  }
  .social-btn:hover {
    background:rgba(139,92,246,0.2);
    border-color:rgba(139,92,246,0.45);
    color:#fff; transform:translateY(-3px);
    box-shadow:0 8px 20px rgba(139,92,246,0.3);
  }

  .newsletter-input {
    flex:1; min-width:0; padding:10px 14px;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.09);
    border-radius:10px; color:#fff;
    font-family:'Outfit',sans-serif; font-size:13px;
    outline:none; transition:all 0.25s ease; width:100%;
  }
  .newsletter-input::placeholder { color:rgba(255,255,255,0.28); }
  .newsletter-input:focus { background:rgba(139,92,246,0.08); border-color:rgba(139,92,246,0.45); }

  .newsletter-btn {
    padding:10px 16px; border-radius:10px;
    background:linear-gradient(135deg,#4f46e5,#7c3aed);
    border:none; color:#fff;
    font-family:'Outfit',sans-serif; font-size:13px; font-weight:700;
    cursor:pointer; white-space:nowrap;
    display:flex; align-items:center; gap:6px;
    transition:all 0.22s ease; position:relative; overflow:hidden;
    flex-shrink:0;
  }
  .newsletter-btn:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(124,58,237,0.5); }

  .contact-item {
    display:flex; align-items:flex-start; gap:10px;
    color:rgba(255,255,255,0.42); font-size:12px; line-height:1.6;
  }
  .contact-icon {
    width:28px; height:28px; border-radius:8px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    margin-top:1px;
  }

  .bottom-link {
    color:rgba(255,255,255,0.35); font-size:11px;
    text-decoration:none; cursor:pointer;
    background:none; border:none;
    font-family:'Outfit',sans-serif;
    transition:color 0.2s ease; padding:0;
  }
  .bottom-link:hover { color:#a78bfa; }

  .badge-pill {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px; border-radius:999px; font-size:10px; font-weight:600;
  }

  /* ── Newsletter Banner ── */
  .footer-newsletter {
    margin: 36px 0 40px;
    padding: 24px 20px;
    background: rgba(139,92,246,0.06);
    border: 1px solid rgba(139,92,246,0.18);
    border-radius: 18px;
    position: relative; overflow: hidden;
  }
  @media (min-width: 640px) {
    .footer-newsletter { padding: 30px 32px; margin: 44px 0 48px; border-radius: 20px; }
  }
  @media (min-width: 1024px) {
    .footer-newsletter { padding: 36px 40px; margin: 52px 0 56px; border-radius: 24px; }
  }

  .footer-newsletter-inner {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  @media (min-width: 768px) {
    .footer-newsletter-inner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }
  }

  .footer-newsletter-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 900; color: #fff;
    margin-bottom: 4px;
  }
  @media (min-width: 640px) { .footer-newsletter-title { font-size: 18px; } }

  .footer-newsletter-form {
    display: flex; gap: 8px; flex-wrap: nowrap;
    width: 100%;
  }
  @media (min-width: 768px) {
    .footer-newsletter-form { max-width: 380px; }
  }

  /* ── Main grid ── */
  .footer-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px 20px;
    padding-bottom: 36px;
  }
  @media (min-width: 640px) {
    .footer-grid { grid-template-columns: repeat(3, 1fr); gap: 32px 24px; }
  }
  @media (min-width: 1024px) {
    .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr 1.4fr; gap: 36px; padding-bottom: 48px; }
  }

  /* Brand col spans full width on small */
  .footer-brand-col {
    grid-column: 1 / -1;
  }
  @media (min-width: 640px) {
    .footer-brand-col { grid-column: span 1; }
  }
  @media (min-width: 1024px) {
    .footer-brand-col { grid-column: span 1; }
  }

  /* Contact col spans full on mobile */
  .footer-contact-col {
    grid-column: 1 / -1;
  }
  @media (min-width: 640px) {
    .footer-contact-col { grid-column: span 1; }
  }
  @media (min-width: 1024px) {
    .footer-contact-col { grid-column: span 1; }
  }

  .footer-col-title {
    font-family: 'Syne', sans-serif;
    color: rgba(255,255,255,0.75);
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 12px;
  }

  /* ── Bottom bar ── */
  .footer-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding-bottom: 28px;
    text-align: center;
  }
  @media (min-width: 768px) {
    .footer-bottom {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      text-align: left;
      gap: 14px;
    }
  }

  .footer-bottom-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px 16px;
  }
  @media (min-width: 768px) {
    .footer-bottom-links { justify-content: flex-start; }
  }

  /* ── Container ── */
  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 14px;
  }
  @media (min-width: 640px) { .footer-container { padding: 0 20px; } }
`

const NAV_LINKS = {
  Shop: [
    { label: 'All Products', path: '/products' },
    { label: 'New Arrivals', path: '/products' },
    { label: 'Best Sellers', path: '/products' },
    { label: 'Sale Items', path: '/products' },
    { label: 'Favorites', path: '/fav' },
  ],
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Our Team', path: '/about' },
    { label: 'Careers', path: '/about' },
    { label: 'Blog', path: '/' },
    { label: 'Press', path: '/' },
  ],
  Support: [
    { label: 'Help Center', path: '/' },
    { label: 'My Orders', path: '/orders' },
    { label: 'Track Order', path: '/' },
    { label: 'Returns', path: '/' },
    { label: 'Contact Us', path: '/about' },
  ],
}

const SOCIALS = [
  { icon: <FaFacebookF size={13} />, color: '#1877f2', label: 'Facebook' },
  { icon: <FaTwitter size={13} />, color: '#1da1f2', label: 'Twitter' },
  { icon: <FaInstagram size={13} />, color: '#e1306c', label: 'Instagram' },
  { icon: <FaLinkedinIn size={13} />, color: '#0a66c2', label: 'LinkedIn' },
  { icon: <FaYoutube size={13} />, color: '#ff0000', label: 'YouTube' },
]

const TRUST = [
  { emoji: '🔒', text: 'SSL Secured' },
  { emoji: '⚡', text: 'Fast Delivery' },
  { emoji: '↩️', text: 'Free Returns' },
  { emoji: '💳', text: 'Safe Payments' },
]

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="footer-root" style={{
      background: 'linear-gradient(180deg,rgba(5,4,18,0) 0%,#030210 8%,#030210 100%)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <style>{STYLES}</style>

      <div className="footer-orb-1" />
      <div className="footer-orb-2" />
      <div className="footer-glow-line" />

      <div className="footer-container">

        {/* ── Newsletter ── */}
        <div className="footer-newsletter">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.5),rgba(236,72,153,0.4),transparent)' }} />
          <div className="footer-newsletter-inner">
            <div>
              <div style={{ fontSize: 18, marginBottom: 4 }}>📬</div>
              <div className="footer-newsletter-title">Never Miss a Deal</div>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, margin: 0 }}>
                Exclusive drops & flash sales straight to your inbox
              </p>
            </div>
            <div className="footer-newsletter-form">
              <input className="newsletter-input" type="email" placeholder="Your email address" />
              <button className="newsletter-btn">
                Subscribe <FiArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand-col">
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(124,58,237,0.4)', flexShrink: 0 }}>
                <FiShoppingCart size={14} color="#fff" />
              </div>
              <span className="footer-shimmer" style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>
                ShopNow
              </span>
            </button>

            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, lineHeight: 1.8, marginBottom: 16 }}>
              Your trusted partner for quality products. Fast delivery, unbeatable prices, and exceptional service.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {TRUST.map((t, i) => (
                <span key={i} className="badge-pill" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.38)' }}>
                  {t.emoji} {t.text}
                </span>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(NAV_LINKS).map(([section, links]) => (
            <div key={section}>
              <div className="footer-col-title">{section}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {links.map((link, i) => (
                  <button key={i} className="footer-link" onClick={() => navigate(link.path)}>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(139,92,246,0.5)', flexShrink: 0 }} />
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Contact */}
          <div className="footer-contact-col">
            <div className="footer-col-title">Contact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {[
                { icon: <FiMail size={12} />, text: 'support@shopnow.com', color: '#3b82f6' },
                { icon: <FiPhone size={12} />, text: '+1 (555) 123-4567', color: '#10b981' },
                { icon: <FiMapPin size={12} />, text: '123 Commerce St, NYC', color: '#ec4899' },
              ].map((c, i) => (
                <div key={i} className="contact-item">
                  <div className="contact-icon" style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}>
                    <span style={{ color: c.color }}>{c.icon}</span>
                  </div>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {SOCIALS.map((s, i) => (
                <button key={i} className="social-btn" title={s.label}
                  onMouseEnter={e => { e.currentTarget.style.background = `${s.color}22`; e.currentTarget.style.borderColor = `${s.color}55`; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${s.color}33` }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: 0 }}>
            © {new Date().getFullYear()} ShopNow. Made with{' '}
            <FiHeart size={10} style={{ color: '#ec4899', display: 'inline', verticalAlign: 'middle' }} />{' '}
            All rights reserved.
          </p>

          <div className="footer-bottom-links">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((item, i) => (
              <button key={i} className="bottom-link">{item}</button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 10 }}>Payments</span>
            {['💳', '🏦', '📱', '🔐'].map((icon, i) => (
              <span key={i} style={{ fontSize: 14 }}>{icon}</span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer