import { FiShoppingCart, FiUser, FiSearch, FiHeart, FiX, FiChevronDown, FiGrid, FiLogOut, FiLogIn } from 'react-icons/fi'
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineInfoCircle } from 'react-icons/ai'
import { HiMenuAlt3 } from 'react-icons/hi'
import { useCart } from '../utils/CartContext'
import { useAuth } from '../context/AuthContext'
import { categoryApi } from '../api/categoryApi'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
  :root { --nav-font:'Outfit',sans-serif; --nav-display:'Syne',sans-serif; }

  @keyframes navSlideDown { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
  @keyframes mobileIn    { from{opacity:0;transform:translateY(-8px) scaleY(0.97)} to{opacity:1;transform:translateY(0) scaleY(1)} }
  @keyframes dropIn      { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes badgePop    { 0%{transform:scale(0)} 70%{transform:scale(1.25)} 100%{transform:scale(1)} }
  @keyframes shimmer     { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes glowPulse   { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes orb1        { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-12px) scale(1.07)} }
  @keyframes orb2        { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-14px,10px) scale(1.05)} }
  @keyframes cartBounce  { 0%,100%{transform:translateY(0)} 35%{transform:translateY(-3px)} 65%{transform:translateY(1px)} }
  @keyframes accordionOpen { from{opacity:0;max-height:0} to{opacity:1;max-height:500px} }

  .nav-root  { animation: navSlideDown 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .drop-anim { animation: dropIn 0.22s cubic-bezier(0.16,1,0.3,1) both; }
  .mob-menu  { animation: mobileIn 0.28s cubic-bezier(0.16,1,0.3,1) both; transform-origin:top center; }
  .badge     { animation: badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
  .orb-a     { animation: orb1 7s ease-in-out infinite; }
  .orb-b     { animation: orb2 9s ease-in-out infinite; }

  .logo-shimmer {
    background: linear-gradient(90deg,#e2e8ff 0%,#a78bfa 30%,#f0abfc 50%,#a78bfa 70%,#e2e8ff 100%);
    background-size:200% auto;
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent;
    animation: shimmer 4s linear infinite;
  }
  .glow-line {
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(139,92,246,0.6),rgba(236,72,153,0.55),transparent);
    animation: glowPulse 3s ease-in-out infinite;
  }

  .nav-pill {
    display:flex; align-items:center; gap:5px;
    padding:7px 13px; border-radius:11px;
    font-family:var(--nav-font); font-size:0.82rem; font-weight:500;
    cursor:pointer; border:1px solid transparent; background:none;
    transition:all 0.22s cubic-bezier(0.4,0,0.2,1);
    white-space:nowrap; color:rgba(255,255,255,0.62);
  }
  .nav-pill:hover { color:#fff; background:rgba(255,255,255,0.07); border-color:rgba(255,255,255,0.1); }
  .nav-pill.active { color:#fff; background:rgba(139,92,246,0.25); border-color:rgba(139,92,246,0.45); box-shadow:0 0 20px rgba(139,92,246,0.18),inset 0 1px 0 rgba(255,255,255,0.1); }
  .nav-pill .chevron { transition:transform 0.25s ease; }
  .nav-pill.cat-open .chevron { transform:rotate(180deg); }

  .icon-btn {
    position:relative; display:flex; align-items:center; justify-content:center;
    width:40px; height:40px; border-radius:12px;
    background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
    color:rgba(255,255,255,0.72); cursor:pointer; flex-shrink:0;
    transition:all 0.22s cubic-bezier(0.4,0,0.2,1);
  }
  .icon-btn:hover { background:rgba(167,139,250,0.18); border-color:rgba(167,139,250,0.45); color:#fff; transform:translateY(-2px); box-shadow:0 8px 24px rgba(139,92,246,0.28); }
  .icon-btn:active { transform:translateY(0) scale(0.95); }
  .icon-btn.open   { background:rgba(139,92,246,0.22); border-color:rgba(139,92,246,0.5); color:#fff; }
  .cart-btn:hover .cart-ico { animation:cartBounce 0.5s ease; }

  .srch-input { font-family:var(--nav-font); color:#fff; }
  .srch-input::placeholder { color:rgba(255,255,255,0.32); }
  .srch-input:focus { outline:none; }
  .srch-wrap:focus-within { filter:drop-shadow(0 0 10px rgba(139,92,246,0.32)); }

  .cat-dropdown {
    position:absolute; left:0;
    top:calc(100% + 10px);
    width:min(480px, calc(100vw - 32px));
    background:rgba(8,6,28,0.97);
    backdrop-filter:blur(28px) saturate(180%);
    -webkit-backdrop-filter:blur(28px) saturate(180%);
    border:1px solid rgba(139,92,246,0.22);
    border-radius:18px;
    box-shadow:0 24px 60px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.04);
    z-index:99999; overflow:hidden;
  }
  .cat-item {
    display:flex; align-items:center; gap:10px;
    padding:10px 16px;
    font-family:var(--nav-font); font-size:0.83rem; font-weight:500;
    color:rgba(255,255,255,0.68); background:transparent; border:none;
    cursor:pointer; width:100%; text-align:left;
    transition:all 0.18s ease;
  }
  .cat-item:hover { color:#fff; background:rgba(139,92,246,0.16); padding-left:22px; }
  .cat-item.selected { color:#c4b5fd; background:rgba(139,92,246,0.22); }
  .cat-item .cat-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,#7c3aed,#db2777); }

  .user-dropdown {
    position:absolute; right:0; top:calc(100% + 10px);
    width:min(220px, calc(100vw - 24px));
    background:rgba(8,6,28,0.97);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    border:1px solid rgba(139,92,246,0.25);
    border-radius:16px;
    box-shadow:0 24px 60px rgba(0,0,0,0.7);
    z-index:99999; overflow:hidden;
  }
  .user-drop-item {
    display:flex; align-items:center; gap:8px;
    width:100%; text-align:left; padding:11px 16px;
    font-family:var(--nav-font); font-size:0.85rem; font-weight:500;
    color:rgba(255,255,255,0.7); background:transparent; border:none;
    cursor:pointer; transition:all 0.16s ease;
  }
  .user-drop-item:hover { color:#fff; background:rgba(139,92,246,0.16); padding-left:22px; }
  .user-drop-logout {
    display:flex; align-items:center; gap:8px;
    width:100%; text-align:left; padding:11px 16px;
    font-family:var(--nav-font); font-size:0.85rem; font-weight:500;
    color:rgba(252,165,165,0.85); background:transparent; border:none;
    cursor:pointer; transition:all 0.16s ease;
  }
  .user-drop-logout:hover { color:#fff; background:rgba(239,68,68,0.16); padding-left:22px; }
  .user-drop-login {
    display:flex; align-items:center; gap:8px;
    width:100%; text-align:left; padding:13px 16px;
    font-family:var(--nav-font); font-size:0.9rem; font-weight:600;
    color:rgba(196,181,253,0.9); background:transparent; border:none;
    cursor:pointer; transition:all 0.16s ease;
  }
  .user-drop-login:hover { color:#fff; background:rgba(139,92,246,0.2); padding-left:22px; }

  .mob-nav-btn {
    display:flex; align-items:center; gap:11px;
    width:100%; padding:12px 14px; border-radius:12px;
    font-family:var(--nav-font); font-size:0.9rem; font-weight:500;
    cursor:pointer; border:1px solid transparent; background:transparent;
    color:rgba(255,255,255,0.65); transition:all 0.18s ease;
  }
  .mob-nav-btn:hover { color:#fff; background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.08); padding-left:20px; }
  .mob-nav-btn.active { color:#fff; background:rgba(139,92,246,0.2); border-color:rgba(139,92,246,0.38); }

  .mob-logout-btn {
    display:flex; align-items:center; gap:11px;
    width:100%; padding:12px 14px; border-radius:12px;
    font-family:var(--nav-font); font-size:0.9rem; font-weight:500;
    cursor:pointer; border:1px solid rgba(248,113,113,0.25);
    background:rgba(239,68,68,0.08); color:rgba(252,165,165,0.85);
    transition:all 0.18s ease;
  }
  .mob-logout-btn:hover { color:#fff; background:rgba(239,68,68,0.2); border-color:rgba(248,113,113,0.5); padding-left:20px; }

  .mob-login-btn {
    display:flex; align-items:center; gap:11px;
    width:100%; padding:12px 14px; border-radius:12px;
    font-family:var(--nav-font); font-size:0.9rem; font-weight:500;
    cursor:pointer; border:1px solid rgba(167,139,250,0.3);
    background:rgba(139,92,246,0.1); color:rgba(196,181,253,0.9);
    transition:all 0.18s ease;
  }
  .mob-login-btn:hover { color:#fff; background:rgba(139,92,246,0.22); border-color:rgba(167,139,250,0.55); padding-left:20px; }

  .mob-cat-list { overflow:hidden; animation:accordionOpen 0.3s ease forwards; }
  .mob-cat-item {
    display:flex; align-items:center; gap:9px;
    width:100%; padding:10px 14px 10px 30px;
    font-family:var(--nav-font); font-size:0.83rem; font-weight:500;
    color:rgba(255,255,255,0.55); background:transparent; border:none;
    cursor:pointer; text-align:left; border-radius:10px;
    transition:all 0.16s ease;
  }
  .mob-cat-item:hover { color:#fff; background:rgba(139,92,246,0.14); padding-left:36px; }
  .mob-cat-item.selected { color:#c4b5fd; }

  /* === RESPONSIVE === */

  /* Default = Mobile (<768px) */
  .nav-logo-text   { display:block; }
  .nav-desktop     { display:none !important; }
  .nav-search-desk { display:none !important; }
  .nav-spacer      { flex:1; min-width:0; }
  .nav-search-mob  { display:block; padding:0 0 10px; }
  .nav-hamburger   { display:flex !important; }

  /* Tablet (>=768px): show desktop links, hide hamburger & mobile search */
  @media (min-width:768px) {
    .nav-desktop     { display:flex !important; }
    .nav-hamburger   { display:none !important; }
    .nav-search-mob  { display:none !important; }
    .nav-spacer      { display:none !important; }
  }

  /* Large desktop (>=1024px): show search bar in navbar */
  @media (min-width:1024px) {
    .nav-search-desk { display:block !important; }
  }

  /* Very small phones (<380px): hide logo text, shrink icons */
  @media (max-width:379px) {
    .nav-logo-text { display:none; }
    .icon-btn { width:36px; height:36px; border-radius:10px; }
  }
`

const DOT_COLORS = [
  'linear-gradient(135deg,#7c3aed,#6366f1)',
  'linear-gradient(135deg,#db2777,#f43f5e)',
  'linear-gradient(135deg,#0891b2,#06b6d4)',
  'linear-gradient(135deg,#059669,#10b981)',
  'linear-gradient(135deg,#d97706,#f59e0b)',
  'linear-gradient(135deg,#7c3aed,#db2777)',
]

const getFavCount = () => {
  try {
    const raw = JSON.parse(localStorage.getItem('favorites') || '[]')
    const valid = Array.isArray(raw) ? raw.filter(Boolean) : []
    if (valid.length !== raw.length) localStorage.setItem('favorites', JSON.stringify(valid))
    return valid.length
  } catch { localStorage.setItem('favorites', '[]'); return 0 }
}

function Navbar({ selectedCategory, onSelectCategory }) {
  const { getCartCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [favCount, setFavCount] = useState(getFavCount)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCatMenu, setShowCatMenu] = useState(false)
  const [mobileCatOpen, setMobileCatOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [searchFocused, setSearchFocused] = useState(false)

  const userRef = useRef(null)
  const catRef = useRef(null)

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) { setMobileOpen(false); setMobileCatOpen(false) }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    categoryApi.getCategories()
      .then(d => setCategories(d.data || d || []))
      .catch(() => { })
  }, [])

  useEffect(() => {
    const sync = () => setFavCount(getFavCount())
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('focus', sync)
    const id = setInterval(sync, 800)
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('focus', sync); clearInterval(id) }
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false)
      if (catRef.current && !catRef.current.contains(e.target)) setShowCatMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleUserMenuToggle = useCallback(() => {
    setShowUserMenu(v => !v)
    setMobileOpen(false)
  }, [])

  const handleHamburgerToggle = useCallback(() => {
    setMobileOpen(v => !v)
    setShowUserMenu(false)
  }, [])

  const isActive = (path) => location.pathname === path
  const onProducts = location.pathname === '/products'

  const handleLogout = useCallback(async () => {
    try { await logout(); navigate('/login') }
    catch (e) { console.error(e) }
  }, [logout, navigate])

  const handleCategorySelect = useCallback((cat) => {
    if (!onProducts) navigate('/products')
    onSelectCategory?.(cat)
    setShowCatMenu(false); setMobileCatOpen(false); setMobileOpen(false)
  }, [onProducts, navigate, onSelectCategory])

  const handleAllProducts = useCallback(() => {
    if (!onProducts) navigate('/products')
    onSelectCategory?.(null)
    setShowCatMenu(false); setMobileCatOpen(false); setMobileOpen(false)
  }, [onProducts, navigate, onSelectCategory])

  return (
    <>
      <style>{STYLES}</style>
      <nav className="nav-root sticky top-0 z-50" style={{ fontFamily: 'var(--nav-font)' }}>

        {/* Main Bar */}
        <div className="relative" style={{ background: 'rgba(5,4,18,0.9)', backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)' }}>

          <div className="orb-a absolute pointer-events-none" style={{ width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.17) 0%,transparent 70%)', top: -110, left: '22%', filter: 'blur(20px)' }} />
          <div className="orb-b absolute pointer-events-none" style={{ width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,0.13) 0%,transparent 70%)', top: -70, right: '18%', filter: 'blur(18px)' }} />
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(139,92,246,0.7) 30%,rgba(236,72,153,0.65) 70%,transparent 100%)' }} />

          <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: 60 }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>

           
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 11, background: 'linear-gradient(135deg,#7c3aed,#db2777)', boxShadow: '0 4px 18px rgba(139,92,246,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FiShoppingCart size={16} color="#fff" />
                  </div>
                  <span className="logo-shimmer nav-logo-text" style={{ fontFamily: 'var(--nav-display)', letterSpacing: '-0.02em', fontSize: 19, fontWeight: 700 }}>
                    ShopNow
                  </span>
                </button>

                <div className="nav-desktop" style={{ display: 'none', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                  <button onClick={() => navigate('/')} className={"nav-pill" + (isActive('/') ? ' active' : '')}>
                    <AiOutlineHome size={15} /> Home
                  </button>

                  <div ref={catRef} style={{ position: 'relative' }}>
                    <button
                      className={"nav-pill" + (onProducts ? ' active' : '') + (showCatMenu ? ' cat-open' : '')}
                      onClick={() => { navigate('/products'); setShowCatMenu(v => !v) }}
                      onMouseEnter={() => setShowCatMenu(true)}
                    >
                      <AiOutlineShoppingCart size={15} />
                      Products
                      <FiChevronDown size={12} className="chevron" style={{ marginLeft: 1 }} />
                    </button>

                    {showCatMenu && (
                      <div className="cat-dropdown drop-anim" onMouseLeave={() => setShowCatMenu(false)}>
                        <div style={{ padding: '12px 16px 9px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <FiGrid size={13} style={{ color: 'rgba(167,139,250,0.9)' }} />
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Browse Categories</span>
                          </div>
                        </div>
                        <button className={"cat-item" + (!selectedCategory ? ' selected' : '')} onClick={handleAllProducts}>
                          <span className="cat-dot" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }} />
                          All Products
                          {!selectedCategory && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'rgba(196,181,253,0.7)' }}>Active</span>}
                        </button>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                          {categories.map((cat, i) => (
                            <button key={cat.id} className={"cat-item" + (selectedCategory?.id === cat.id ? ' selected' : '')} onClick={() => handleCategorySelect(cat)}>
                              <span className="cat-dot" style={{ background: DOT_COLORS[i % DOT_COLORS.length] }} />
                              {cat.name}
                              {selectedCategory?.id === cat.id && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'rgba(196,181,253,0.7)' }}>✓</span>}
                            </button>
                          ))}
                        </div>
                        {categories.length === 0 && (
                          <div style={{ padding: '18px 16px', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', textAlign: 'center' }}>Loading...</div>
                        )}
                        <div className="glow-line" />
                      </div>
                    )}
                  </div>

                  <button onClick={() => navigate('/about')} className={"nav-pill" + (isActive('/about') ? ' active' : '')}>
                    <AiOutlineInfoCircle size={15} /> About
                  </button>
                </div>
              </div>{/* end logo+nav group */}

              {/* Desktop Search */}
              <div className="nav-search-desk srch-wrap" style={{ flex: 1, margin: '0 12px' }}>
                <div style={{ position: 'relative' }}>
                  <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: searchFocused ? 'rgba(167,139,250,0.85)' : 'rgba(255,255,255,0.3)', pointerEvents: 'none', transition: 'color 0.2s', zIndex: 1 }} />
                  <input type="text" placeholder="Search products..." className="srch-input"
                    onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                    style={{ width: '100%', padding: '9px 14px 9px 36px', background: searchFocused ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (searchFocused ? 'rgba(139,92,246,0.48)' : 'rgba(255,255,255,0.08)'), borderRadius: 12, transition: 'all 0.25s ease', fontSize: 13 }}
                  />
                </div>
              </div>

              {/* Mobile spacer */}
              <div className="nav-spacer" />

              {/* Right Icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

                {/* Favorites */}
                <button className="icon-btn" onClick={() => navigate('/fav')}>
                  <FiHeart size={17} />
                  {favCount > 0 && (
                    <span className="badge" style={{ position: 'absolute', top: -4, right: -4, minWidth: 17, height: 17, padding: '0 3px', fontSize: 9, borderRadius: 999, background: 'linear-gradient(135deg,#f43f5e,#ec4899)', border: '2px solid rgba(5,4,18,0.9)', boxShadow: '0 2px 8px rgba(244,63,94,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                      {favCount > 99 ? '99+' : favCount}
                    </span>
                  )}
                </button>

                {/* ✅ FIX 2: User button - mobile par sirf desktop dropdown, hamburger se alag */}
                <div ref={userRef} style={{ position: 'relative', zIndex: 9999 }}>
                  <button
                    className={"icon-btn" + (showUserMenu ? ' open' : '')}
                    // ✅ Mobile par user icon hide - sab kuch hamburger menu mein hai
                    style={{ display: isMobile ? 'none' : 'flex' }}
                    onClick={handleUserMenuToggle}
                  >
                    <FiUser size={17} />
                  </button>

                  {showUserMenu && !isMobile && (
                    <div className="user-dropdown drop-anim">
                      {isAuthenticated ? (
                        <>
                          <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
                            <div style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 11, marginBottom: 7, color: '#fff', fontWeight: 700, fontSize: 13 }}>
                              {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <p style={{ color: '#fff', fontWeight: 600, fontSize: 13, fontFamily: 'var(--nav-display)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                          </div>
                          <div style={{ padding: '5px 0' }}>
                            <button className="user-drop-item" onClick={() => { navigate('/profile'); setShowUserMenu(false) }}>
                              <FiUser size={14} /> My Profile
                            </button>
                            <button className="user-drop-item" onClick={() => { navigate('/orders'); setShowUserMenu(false) }}>
                              <AiOutlineShoppingCart size={14} /> My Orders
                            </button>
                          </div>
                          <div style={{ padding: '3px 0 6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <button className="user-drop-logout" onClick={() => { setShowUserMenu(false); handleLogout() }}>
                              <FiLogOut size={14} /> Logout
                            </button>
                          </div>
                        </>
                      ) : (
                        <div style={{ padding: '4px 0' }}>
                          <button className="user-drop-login" onClick={() => { navigate('/login'); setShowUserMenu(false) }}>
                            <FiLogIn size={15} /> Login
                          </button>
                        </div>
                      )}
                      <div className="glow-line" />
                    </div>
                  )}
                </div>

                {/* Cart */}
                <button className="icon-btn cart-btn" onClick={() => isAuthenticated ? navigate('/cart') : navigate('/login')}>
                  <FiShoppingCart size={17} className="cart-ico" />
                  {getCartCount() > 0 && (
                    <span className="badge" style={{ position: 'absolute', top: -4, right: -4, minWidth: 17, height: 17, padding: '0 3px', fontSize: 9, borderRadius: 999, background: 'linear-gradient(135deg,#7c3aed,#6366f1)', border: '2px solid rgba(5,4,18,0.9)', boxShadow: '0 2px 8px rgba(124,58,237,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                      {getCartCount() > 99 ? '99+' : getCartCount()}
                    </span>
                  )}
                </button>

                {/* ✅ FIX 2: Hamburger - handleHamburgerToggle use kiya jo user menu band karta hai */}
                <button className={"icon-btn nav-hamburger" + (mobileOpen ? ' open' : '')} onClick={handleHamburgerToggle}>
                  {mobileOpen ? <FiX size={19} /> : <HiMenuAlt3 size={19} />}
                </button>

              </div>
            </div>

            {/* Mobile Search */}
            <div className="nav-search-mob srch-wrap">
              <div style={{ position: 'relative' }}>
                <FiSearch size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none', zIndex: 1 }} />
                <input type="text" placeholder="Search products..." className="srch-input"
                  style={{ width: '100%', padding: '9px 12px 9px 30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 13, transition: 'all 0.25s ease' }}
                  onFocus={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)' }}
                  onBlur={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                />
              </div>
            </div>

          </div>
          <div className="glow-line" />
        </div>

        {/* Mobile Menu */}
        {mobileOpen && isMobile && (
          <div className="mob-menu" style={{ background: 'rgba(5,4,18,0.97)', backdropFilter: 'blur(32px)', borderBottom: '1px solid rgba(139,92,246,0.18)', boxShadow: '0 20px 60px rgba(0,0,0,0.55)', position: 'relative', overflow: 'hidden' }}>
            <div className="absolute pointer-events-none" style={{ width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.14) 0%,transparent 70%)', top: -40, right: -20, filter: 'blur(16px)' }} />

            <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 3 }}>

              <button onClick={() => { navigate('/'); setMobileOpen(false) }} className={"mob-nav-btn" + (isActive('/') ? ' active' : '')}>
                <AiOutlineHome size={19} /> Home
              </button>

              <div>
                <button className={"mob-nav-btn" + (onProducts ? ' active' : '')} onClick={() => setMobileCatOpen(v => !v)} style={{ justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <AiOutlineShoppingCart size={19} /> Products
                  </span>
                  <FiChevronDown size={14} style={{ transition: 'transform 0.25s', transform: mobileCatOpen ? 'rotate(180deg)' : 'rotate(0)', opacity: 0.55 }} />
                </button>
                {mobileCatOpen && (
                  <div className="mob-cat-list">
                    <button className={"mob-cat-item" + (!selectedCategory ? ' selected' : '')} onClick={handleAllProducts}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#6366f1)', display: 'inline-block', flexShrink: 0 }} />
                      All Products
                    </button>
                    {categories.map((cat, i) => (
                      <button key={cat.id} className={"mob-cat-item" + (selectedCategory?.id === cat.id ? ' selected' : '')} onClick={() => handleCategorySelect(cat)}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: DOT_COLORS[i % DOT_COLORS.length], display: 'inline-block', flexShrink: 0 }} />
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => { navigate('/about'); setMobileOpen(false) }} className={"mob-nav-btn" + (isActive('/about') ? ' active' : '')}>
                <AiOutlineInfoCircle size={19} /> About
              </button>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '5px 0' }} />

              {isAuthenticated ? (
                <>
                  <button className="mob-nav-btn" onClick={() => { navigate('/profile'); setMobileOpen(false) }}>
                    <FiUser size={19} /> My Profile
                  </button>
                  <button className="mob-nav-btn" onClick={() => { navigate('/orders'); setMobileOpen(false) }}>
                    <AiOutlineShoppingCart size={19} /> My Orders
                  </button>
                  <button className="mob-logout-btn" onClick={() => { setMobileOpen(false); handleLogout() }}>
                    <FiLogOut size={19} /> Logout
                  </button>
                </>
              ) : (
                <button className="mob-login-btn" onClick={() => { navigate('/login'); setMobileOpen(false) }}>
                  <FiLogIn size={19} /> Login
                </button>
              )}

            </div>
            <div className="glow-line" />
          </div>
        )}

      </nav>
    </>
  )
}

export default Navbar