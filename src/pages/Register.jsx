import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiUser, FiPhone, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi'
import toast from 'react-hot-toast'

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
  .auth-input { width:100%;padding:11px 16px 11px 42px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:13px;color:#fff;font-family:'Outfit',sans-serif;font-size:13.5px;outline:none;transition:all 0.25s ease;box-sizing:border-box; }
  .auth-input::placeholder { color:rgba(255,255,255,0.28); }
  .auth-input:focus { background:rgba(139,92,246,0.08);border-color:rgba(139,92,246,0.45);box-shadow:0 0 0 3px rgba(139,92,246,0.1); }
  .auth-btn { width:100%;padding:13px;background:linear-gradient(135deg,#4f46e5,#7c3aed,#a21caf);border:none;border-radius:14px;color:#fff;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.25s ease;position:relative;overflow:hidden; }
  .auth-btn::before { content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent);transform:translateX(-100%);transition:transform 0.5s ease; }
  .auth-btn:hover::before { transform:translateX(100%); }
  .auth-btn:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,0.5); }
  .auth-btn:disabled { opacity:0.5;cursor:not-allowed;transform:none; }
  ::-webkit-scrollbar { width:5px;background:#05040f; }
  ::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.35);border-radius:3px; }
`

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      toast.error('Passwords do not match!', { icon: '⚠️' })
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      toast.error('Password too short!', { icon: '⚠️' })
      return
    }
    setLoading(true)
    const toastId = toast.loading('Creating your account...')
    const { confirmPassword, ...registerData } = formData
    const result = await register(registerData)
    toast.dismiss(toastId)
    if (result.success) {
      toast.success('Account created successfully! 🎉', { duration: 2000, icon: '✨' })
      setTimeout(() => navigate('/'), 500)
    } else {
      setError(result.message || 'Registration failed. Please try again.')
      toast.error(result.message || 'Registration failed!', { duration: 4000, icon: '❌' })
      setLoading(false)
    }
  }

  const labelStyle = { display:'block', color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, marginBottom:7, letterSpacing:'0.08em', textTransform:'uppercase' }
  const iconStyle  = { position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.28)', pointerEvents:'none' }

  const Field = ({ label, name, type='text', placeholder, icon, rightEl }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position:'relative' }}>
        <span style={iconStyle}>{icon}</span>
        <input type={type} name={name} value={formData[name]} onChange={handleChange}
          required={name !== 'phone'} placeholder={placeholder}
          className="auth-input" style={rightEl ? { paddingRight:42 } : {}} />
        {rightEl && <div style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)' }}>{rightEl}</div>}
      </div>
    </div>
  )

  return (
    <div className="auth-page" style={{ minHeight:'100vh', background:'linear-gradient(160deg,#030210 0%,#07051a 40%,#05040f 100%)', position:'relative' }}>
      <style>{STYLES}</style>
      <div className="auth-bg-grid" /><div className="auth-orb-1" /><div className="auth-orb-2" /><div className="auth-scan" />

      {/* Back button */}
      <div style={{ position:'absolute', top:20, left:20, zIndex:20 }}>
        <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:999, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:13, fontFamily:"'Outfit',sans-serif", transition:'all 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.09)';e.currentTarget.style.color='#fff'}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='rgba(255,255,255,0.6)'}}>
          <FiArrowLeft size={14}/> Back to Home
        </button>
      </div>

      <div style={{ position:'relative', zIndex:10, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'60px 16px 40px' }}>
        <div className="auth-card" style={{ width:'100%', maxWidth:440 }}>
          <div style={{ background:'rgba(255,255,255,0.03)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:28, boxShadow:'0 24px 60px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.06)', overflow:'hidden', position:'relative' }}>
            <div className="glow-line" />
            <div style={{ position:'absolute', width:250, height:250, borderRadius:'50%', border:'1px solid rgba(236,72,153,0.07)', bottom:-80, left:-80, animation:'rotateSlow 30s linear infinite reverse', pointerEvents:'none' }} />

            <div style={{ padding:'32px 32px 36px' }}>
              {/* Header */}
              <div style={{ textAlign:'center', marginBottom:24 }}>
                <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:50, height:50, borderRadius:16, marginBottom:12, background:'linear-gradient(135deg,#db2777,#7c3aed)', boxShadow:'0 8px 24px rgba(219,39,119,0.35)' }}>
                  <FiUser size={20} color="#fff" />
                </div>
                <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:900, color:'#fff', marginBottom:5, letterSpacing:'-0.02em' }}>
                  Create <span className="text-shimmer">Account</span>
                </h1>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13 }}>Sign up to start shopping</p>
              </div>

              {/* Error */}
              {error && (
                <div style={{ marginBottom:16, padding:'11px 14px', borderRadius:12, background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', color:'#fca5a5', fontSize:13 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <Field label="Full Name" name="name" placeholder="Enter your full name" icon={<FiUser size={14}/>} />
                <Field label="Email Address" name="email" type="email" placeholder="Enter your email" icon={<FiMail size={14}/>} />
                <Field label="Phone Number (Optional)" name="phone" type="tel" placeholder="Enter your phone number" icon={<FiPhone size={14}/>} />

                {/* Password */}
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position:'relative' }}>
                    <span style={iconStyle}><FiLock size={14}/></span>
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required placeholder="Create a password" className="auth-input" style={{ paddingRight:42 }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.28)', display:'flex', padding:0 }}>
                      {showPassword ? <FiEyeOff size={14}/> : <FiEye size={14}/>}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <div style={{ position:'relative' }}>
                    <span style={iconStyle}><FiLock size={14}/></span>
                    <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm your password" className="auth-input" />
                  </div>
                </div>

                {/* Terms */}
                <label style={{ display:'flex', alignItems:'flex-start', gap:9, cursor:'pointer', marginTop:2 }}>
                  <input type="checkbox" required style={{ width:14, height:14, marginTop:2, accentColor:'#7c3aed', cursor:'pointer', flexShrink:0 }} />
                  <span style={{ color:'rgba(255,255,255,0.38)', fontSize:12, lineHeight:1.6 }}>
                    I agree to the{' '}
                    <button type="button" style={{ background:'none', border:'none', color:'#a78bfa', cursor:'pointer', fontSize:12, padding:0, textDecoration:'underline' }}>Terms & Conditions</button>
                    {' '}and{' '}
                    <button type="button" style={{ background:'none', border:'none', color:'#a78bfa', cursor:'pointer', fontSize:12, padding:0, textDecoration:'underline' }}>Privacy Policy</button>
                  </span>
                </label>

                <button type="submit" disabled={loading} className="auth-btn" style={{ marginTop:6 }}>
                  {loading ? 'Creating Account...' : 'Create Account →'}
                </button>
              </form>

              <div style={{ display:'flex', alignItems:'center', gap:12, margin:'18px 0' }}>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
                <span style={{ color:'rgba(255,255,255,0.2)', fontSize:11 }}>OR</span>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
              </div>

              <p style={{ textAlign:'center', color:'rgba(255,255,255,0.35)', fontSize:13 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color:'#a78bfa', fontWeight:600, textDecoration:'none' }}>Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register