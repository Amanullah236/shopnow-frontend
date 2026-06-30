import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authApi from '../api/authApi'
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi'
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
  @keyframes stepIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }

  .auth-page { font-family:'Outfit',sans-serif; }
  .auth-bg-grid { position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px);background-size:60px 60px;animation:gridPulse 6s ease-in-out infinite; }
  .auth-orb-1 { position:fixed;pointer-events:none;z-index:0;top:-15%;left:-8%;width:55vw;height:55vw;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 70%);filter:blur(50px);animation:orbDrift1 18s ease-in-out infinite; }
  .auth-orb-2 { position:fixed;pointer-events:none;z-index:0;bottom:-20%;right:-12%;width:50vw;height:50vw;border-radius:50%;background:radial-gradient(circle,rgba(236,72,153,0.13) 0%,transparent 70%);filter:blur(55px);animation:orbDrift2 22s ease-in-out infinite; }
  .auth-scan { position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:0;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.12),transparent);animation:scanLine 10s linear infinite; }

  .auth-card { animation:fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
  .step-form { animation:stepIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }

  .text-shimmer { background:linear-gradient(90deg,#e2e8ff 0%,#a78bfa 25%,#f0abfc 50%,#a78bfa 75%,#e2e8ff 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimmerMove 4s linear infinite; }
  .glow-line { height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.6),rgba(236,72,153,0.55),transparent);animation:glowPulse 3s ease-in-out infinite; }

  .auth-input { width:100%;padding:12px 16px 12px 44px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:13px;color:#fff;font-family:'Outfit',sans-serif;font-size:14px;outline:none;transition:all 0.25s ease;box-sizing:border-box; }
  .auth-input::placeholder { color:rgba(255,255,255,0.28); }
  .auth-input:focus { background:rgba(139,92,246,0.08);border-color:rgba(139,92,246,0.45);box-shadow:0 0 0 3px rgba(139,92,246,0.1); }

  /* ── OTP boxes — responsive size so they never overflow ── */
  .otp-row { display:flex; gap:clamp(5px,2vw,10px); justify-content:center; }
  .otp-box {
    width: clamp(36px, 12vw, 50px);
    height: clamp(44px, 13vw, 58px);
    text-align:center;
    font-size: clamp(16px, 4.5vw, 22px);
    font-weight:800;
    font-family:'Syne',sans-serif;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.09);
    border-radius:13px;
    color:#fff;
    outline:none;
    transition:all 0.2s ease;
    caret-color:transparent;
    flex-shrink: 0;
  }
  .otp-box:focus { background:rgba(139,92,246,0.12);border-color:rgba(139,92,246,0.55);box-shadow:0 0 0 3px rgba(139,92,246,0.15),0 0 16px rgba(139,92,246,0.2); }
  .otp-box.filled { background:rgba(139,92,246,0.08);border-color:rgba(139,92,246,0.35); }

  .auth-btn { width:100%;padding:13px;border:none;border-radius:14px;color:#fff;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.25s ease;position:relative;overflow:hidden; }
  .auth-btn::before { content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent);transform:translateX(-100%);transition:transform 0.5s ease; }
  .auth-btn:hover::before { transform:translateX(100%); }
  .auth-btn:hover { transform:translateY(-2px); }
  .auth-btn:disabled { opacity:0.5;cursor:not-allowed;transform:none; }

  /* ── Card inner padding responsive ── */
  .auth-inner { padding: clamp(24px,6vw,36px) clamp(18px,6vw,32px) clamp(28px,6vw,40px); }

  ::-webkit-scrollbar { width:5px;background:#05040f; }
  ::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.35);border-radius:3px; }
`

const STEP_CONFIG = [
  { title: 'Forgot Password?', sub: 'Enter your email to receive OTP', icon: '📧', color: '#3b82f6' },
  { title: 'Verify OTP', sub: 'Enter the 6-digit code sent to your email', icon: '🔑', color: '#8b5cf6' },
  { title: 'Set New Password', sub: 'Create a strong new password', icon: '🔒', color: '#10b981' },
]

const BTN_GRADIENTS = [
  'linear-gradient(135deg,#3b82f6,#6366f1)',
  'linear-gradient(135deg,#7c3aed,#8b5cf6)',
  'linear-gradient(135deg,#059669,#10b981)',
]

function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const labelStyle = { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, marginBottom: 7, letterSpacing: '0.08em', textTransform: 'uppercase' }
  const iconStyle = { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.28)', pointerEvents: 'none' }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    const toastId = toast.loading('Sending OTP to your email...')
    try {
      await authApi.forgotPassword(email)
      toast.dismiss(toastId)
      toast.success('OTP sent to your email! 📧', { icon: '✅', duration: 3000 })
      setStep(2)
    } catch (error) {
      toast.dismiss(toastId)
      toast.error(error.response?.data?.message || 'Failed to send OTP!', { icon: '❌' })
    } finally { setLoading(false) }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    const otp = digits.join('')
    setLoading(true)
    const toastId = toast.loading('Verifying OTP...')
    try {
      await authApi.verifyOTP(email, otp)
      toast.dismiss(toastId)
      toast.success('OTP verified! Set new password 🔒', { icon: '✅' })
      setStep(3)
    } catch (error) {
      toast.dismiss(toastId)
      toast.error(error.response?.data?.message || 'Invalid OTP!', { icon: '❌' })
    } finally { setLoading(false) }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match!', { icon: '⚠️' }); return }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters!', { icon: '⚠️' }); return }
    setLoading(true)
    const toastId = toast.loading('Resetting password...')
    try {
      await authApi.resetPassword(email, digits.join(''), newPassword)
      toast.dismiss(toastId)
      toast.success('Password reset successfully! 🎉', { icon: '✅', duration: 2000 })
      setTimeout(() => navigate('/login'), 1000)
    } catch (error) {
      toast.dismiss(toastId)
      toast.error(error.response?.data?.message || 'Failed to reset password!', { icon: '❌' })
    } finally { setLoading(false) }
  }

  const cfg = STEP_CONFIG[step - 1]

  return (
    <div className="auth-page" style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#030210 0%,#07051a 40%,#05040f 100%)', position: 'relative' }}>
      <style>{STYLES}</style>
      <div className="auth-bg-grid" /><div className="auth-orb-1" /><div className="auth-orb-2" /><div className="auth-scan" />

      {/* Back button */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 20 }}>
        <button
          onClick={() => step === 1 ? navigate('/login') : setStep(step - 1)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13, fontFamily: "'Outfit',sans-serif", transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
        >
          <FiArrowLeft size={14} /> Back
        </button>
      </div>

      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(60px,10vw,80px) 16px 32px' }}>
        <div className="auth-card" style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, boxShadow: '0 24px 60px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
            <div className="glow-line" />
            {/* Decorative ring */}
            <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.06)', top: -90, right: -90, animation: 'rotateSlow 25s linear infinite', pointerEvents: 'none' }} />

            <div className="auth-inner">

              {/* Step progress dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{ height: 4, borderRadius: 999, transition: 'all 0.35s ease', width: s === step ? 28 : 10, background: s <= step ? BTN_GRADIENTS[s - 1] : 'rgba(255,255,255,0.1)' }} />
                ))}
              </div>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 28 }} key={step}>
                <div style={{ fontSize: 38, marginBottom: 12 }}>{cfg.icon}</div>
                <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(20px,5vw,24px)', fontWeight: 900, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>
                  <span className="text-shimmer">{cfg.title}</span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 'clamp(12px,2vw,13px)' }}>{cfg.sub}</p>
              </div>

              {/* ── Step 1: Email ── */}
              {step === 1 && (
                <form key="step1" className="step-form" onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <FiMail size={14} style={iconStyle} />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" className="auth-input" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="auth-btn" style={{ background: BTN_GRADIENTS[0], marginTop: 4, boxShadow: '0 4px 20px rgba(59,130,246,0.35)' }}>
                    {loading ? 'Sending OTP...' : 'Send OTP →'}
                  </button>
                </form>
              )}

              {/* ── Step 2: OTP ── */}
              {step === 2 && (
                <form key="step2" className="step-form" onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ ...labelStyle, textAlign: 'center' }}>Enter 6-Digit OTP</label>
                    {/* ✅ FIX: responsive otp-row class, clamp sizes in CSS */}
                    <div className="otp-row" style={{ marginTop: 4 }}>
                      {digits.map((d, i) => (
                        <input
                          key={i}
                          ref={el => inputRefs.current[i] = el}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={d}
                          className={`otp-box${d ? ' filled' : ''}`}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(-1)
                            const next = [...digits]; next[i] = val; setDigits(next)
                            if (val && i < 5) inputRefs.current[i + 1]?.focus()
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Backspace' && !digits[i] && i > 0) {
                              inputRefs.current[i - 1]?.focus()
                              const next = [...digits]; next[i - 1] = ''; setDigits(next)
                            }
                          }}
                          onPaste={e => {
                            e.preventDefault()
                            const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
                            const next = ['', '', '', '', '', '']
                            pasted.split('').forEach((c, j) => { next[j] = c })
                            setDigits(next)
                            inputRefs.current[Math.min(pasted.length, 5)]?.focus()
                          }}
                          onFocus={e => e.target.select()}
                        />
                      ))}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', marginTop: 10 }}>OTP sent to {email}</p>
                  </div>
                  <button type="submit" disabled={loading || digits.join('').length < 6} className="auth-btn" style={{ background: BTN_GRADIENTS[1], boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}>
                    {loading ? 'Verifying...' : 'Verify OTP →'}
                  </button>
                  <button type="button"
                    onClick={() => { setStep(1); toast.info('Redirecting to send new OTP...', { icon: '🔄' }) }}
                    style={{ background: 'none', border: 'none', color: 'rgba(139,92,246,0.7)', fontSize: 13, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", padding: '4px 0' }}>
                    Didn't receive OTP? Resend
                  </button>
                </form>
              )}

              {/* ── Step 3: New Password ── */}
              {step === 3 && (
                <form key="step3" className="step-form" onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>New Password</label>
                    <div style={{ position: 'relative' }}>
                      <FiLock size={14} style={iconStyle} />
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Enter new password" className="auth-input" />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <FiLock size={14} style={iconStyle} />
                      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Confirm new password" className="auth-input" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="auth-btn" style={{ background: BTN_GRADIENTS[2], marginTop: 4, boxShadow: '0 4px 20px rgba(5,150,105,0.35)' }}>
                    {loading ? 'Resetting Password...' : 'Reset Password →'}
                  </button>
                </form>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              </div>

              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
                Remember your password?{' '}
                <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword