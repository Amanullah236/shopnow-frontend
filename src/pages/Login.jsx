import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');
  @keyframes orbDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(60px,-40px) scale(1.12)} 66%{transform:translate(-25px,45px) scale(0.93)} }
  @keyframes orbDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,30px) scale(1.08)} }
  @keyframes gridPulse { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
  @keyframes scanLine { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmerMove { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes glowPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  .auth-page { font-family:'Outfit',sans-serif; }
  .auth-bg-grid { position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px);background-size:60px 60px;animation:gridPulse 6s ease-in-out infinite; }
  .auth-orb-1 { position:fixed;pointer-events:none;z-index:0;top:-15%;left:-8%;width:55vw;height:55vw;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 70%);filter:blur(50px);animation:orbDrift1 18s ease-in-out infinite; }
  .auth-orb-2 { position:fixed;pointer-events:none;z-index:0;bottom:-20%;right:-12%;width:50vw;height:50vw;border-radius:50%;background:radial-gradient(circle,rgba(236,72,153,0.13) 0%,transparent 70%);filter:blur(55px);animation:orbDrift2 22s ease-in-out infinite; }
  .auth-scan { position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:0;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.12),transparent);animation:scanLine 10s linear infinite; }
  .auth-card { animation:fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
  .text-shimmer { background:linear-gradient(90deg,#e2e8ff 0%,#a78bfa 25%,#f0abfc 50%,#a78bfa 75%,#e2e8ff 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimmerMove 4s linear infinite; }
  .glow-line { height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.6),rgba(236,72,153,0.55),transparent);animation:glowPulse 3s ease-in-out infinite; }
  .auth-input { width:100%;padding:12px 16px 12px 44px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:14px;color:#fff;font-family:'Outfit',sans-serif;font-size:14px;outline:none;transition:all 0.25s ease;box-sizing:border-box; }
  .auth-input::placeholder { color:rgba(255,255,255,0.3); }
  .auth-input:focus { background:rgba(139,92,246,0.08);border-color:rgba(139,92,246,0.45);box-shadow:0 0 0 3px rgba(139,92,246,0.1); }
  .auth-btn { width:100%;padding:13px;background:linear-gradient(135deg,#4f46e5,#7c3aed,#a21caf);border:none;border-radius:14px;color:#fff;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.25s ease;position:relative;overflow:hidden; }
  .auth-btn::before { content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent);transform:translateX(-100%);transition:transform 0.5s ease; }
  .auth-btn:hover::before { transform:translateX(100%); }
  .auth-btn:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,0.5); }
  .auth-btn:disabled { opacity:0.5;cursor:not-allowed;transform:none; }
  ::-webkit-scrollbar { width:5px;background:#05040f; }
  ::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.35);border-radius:3px; }
`

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (!formData.email || !formData.password) {
      setError('Please enter email and password')
      setLoading(false)
      return
    }
    try {
      const result = await login(formData.email, formData.password)
      if (result.user.role === 'admin') navigate('/admin/dashboard')
      else navigate('/')
    } catch (err) {
      if (err.response) setError(err.response.data?.message || 'Invalid email or password')
      else if (err.request) setError('Cannot connect to server. Please check if backend is running.')
      else setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = { display:'block', color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, marginBottom:7, letterSpacing:'0.08em', textTransform:'uppercase' }
  const iconStyle  = { position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', pointerEvents:'none' }

  return (
    <div className="auth-page" style={{ minHeight:'100vh', background:'linear-gradient(160deg,#030210 0%,#07051a 40%,#05040f 100%)', position:'relative' }}>
      <style>{STYLES}</style>
      <div className="auth-bg-grid" /><div className="auth-orb-1" /><div className="auth-orb-2" /><div className="auth-scan" />

      <Navbar />

      <div style={{ position:'relative', zIndex:10, minHeight:'calc(100vh - 64px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 16px' }}>
        <div className="auth-card" style={{ width:'100%', maxWidth:420 }}>
          <div style={{ background:'rgba(255,255,255,0.03)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:28, boxShadow:'0 24px 60px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.06)', overflow:'hidden', position:'relative' }}>
            <div className="glow-line" />
            <div style={{ position:'absolute', width:280, height:280, borderRadius:'50%', border:'1px solid rgba(139,92,246,0.07)', top:-90, right:-90, animation:'rotateSlow 25s linear infinite', pointerEvents:'none' }} />

            <div style={{ padding:'36px 32px 40px' }}>
              {/* Header */}
              <div style={{ textAlign:'center', marginBottom:28 }}>
                <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:50, height:50, borderRadius:16, marginBottom:14, background:'linear-gradient(135deg,#7c3aed,#db2777)', boxShadow:'0 8px 24px rgba(124,58,237,0.4)' }}>
                  <FiLock size={20} color="#fff" />
                </div>
                <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:900, color:'#fff', marginBottom:6, letterSpacing:'-0.02em' }}>
                  Welcome <span className="text-shimmer">Back</span>
                </h1>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13 }}>Login to your account</p>
              </div>

              {/* Error */}
              {error && (
                <div style={{ marginBottom:18, padding:'11px 14px', borderRadius:12, background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', color:'#fca5a5', fontSize:13 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {/* Email */}
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={{ position:'relative' }}>
                    <FiMail size={14} style={iconStyle} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="admin@example.com" className="auth-input" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position:'relative' }}>
                    <FiLock size={14} style={iconStyle} />
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="auth-input" style={{ paddingRight:44 }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', padding:0 }}>
                      {showPassword ? <FiEyeOff size={14}/> : <FiEye size={14}/>}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <label style={{ display:'flex', alignItems:'center', gap:7, cursor:'pointer' }}>
                    <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} style={{ width:14, height:14, accentColor:'#7c3aed', cursor:'pointer' }} />
                    <span style={{ color:'rgba(255,255,255,0.4)', fontSize:12 }}>Remember me</span>
                  </label>
                  <Link to="/forgot-password" style={{ color:'#a78bfa', fontSize:12, textDecoration:'none', fontWeight:500 }}>Forgot Password?</Link>
                </div>

                <button type="submit" disabled={loading} className="auth-btn" style={{ marginTop:6 }}>
                  {loading ? 'Logging in...' : 'Login →'}
                </button>
              </form>

              {/* Divider */}
              <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
                <span style={{ color:'rgba(255,255,255,0.2)', fontSize:11 }}>OR</span>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
              </div>

              <p style={{ textAlign:'center', color:'rgba(255,255,255,0.35)', fontSize:13 }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color:'#a78bfa', fontWeight:600, textDecoration:'none' }}>Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login