import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/authApi'
import Navbar from '../components/Navbar'
import { FiUser, FiMail, FiPhone, FiLock, FiLogOut, FiEdit2, FiCheck, FiX } from 'react-icons/fi'

function Profile() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth() // ← checkAuth hata ke updateUser add kiya
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await authApi.updateProfile(profileData)
      updateUser(response.data) // ← localStorage + state dono update honge
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setIsEditing(false)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      setLoading(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordSection(false)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to change password' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/40 p-4 rounded-full">
                <FiUser className="text-3xl text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">My Profile</h1>
                <p className="text-white/60">Manage your account information</p>
              </div>
            </div>
            {user?.role === 'admin' && (
              <span className="backdrop-blur-md bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-400/40 text-green-300'
              : 'bg-red-500/20 border border-red-400/40 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Information */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="backdrop-blur-md bg-blue-500/30 border border-blue-400/50 text-white px-4 py-2 rounded-xl hover:bg-blue-500/40 transition-all flex items-center gap-2"
              >
                <FiEdit2 /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setProfileData({ name: user.name || '', phone: user.phone || '' })
                  }}
                  className="backdrop-blur-md bg-red-500/30 border border-red-400/50 text-red-300 px-4 py-2 rounded-xl hover:bg-red-500/40 transition-all flex items-center gap-2"
                >
                  <FiX /> Cancel
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-white/70 mb-2">
                <FiUser /> Name
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl backdrop-blur-md border text-white placeholder-white/50 focus:outline-none ${
                  isEditing 
                    ? 'bg-white/10 border-white/20 focus:border-blue-400/50' 
                    : 'bg-white/5 border-white/10 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/70 mb-2">
                <FiMail /> Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white/50 cursor-not-allowed"
              />
              <p className="text-white/40 text-sm mt-2">Email cannot be changed</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/70 mb-2">
                <FiPhone /> Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl backdrop-blur-md border text-white placeholder-white/50 focus:outline-none ${
                  isEditing 
                    ? 'bg-white/10 border-white/20 focus:border-blue-400/50' 
                    : 'bg-white/5 border-white/10 cursor-not-allowed'
                }`}
              />
            </div>

            {isEditing && (
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-white/10 text-white/50 cursor-not-allowed'
                    : 'backdrop-blur-md bg-blue-500/30 border border-blue-400/50 text-white hover:bg-blue-500/40'
                }`}
              >
                <FiCheck /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </form>
        </div>

        {/* Change Password Section */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-6 mb-6 shadow-2xl">
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="w-full flex items-center justify-between text-white hover:text-white/80 transition-all"
          >
            <div className="flex items-center gap-3">
              <FiLock className="text-2xl" />
              <h2 className="text-2xl font-bold">Change Password</h2>
            </div>
            <span className="text-2xl">{showPasswordSection ? '−' : '+'}</span>
          </button>

          {showPasswordSection && (
            <form onSubmit={handleChangePassword} className="space-y-4 mt-6">
              <div>
                <label className="block text-white/70 mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  loading
                    ? 'bg-white/10 text-white/50 cursor-not-allowed'
                    : 'backdrop-blur-md bg-blue-500/30 border border-blue-400/50 text-white hover:bg-blue-500/40'
                }`}
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full backdrop-blur-2xl bg-red-500/20 border border-red-400/40 text-red-300 py-4 rounded-3xl hover:bg-red-500/30 hover:border-red-400/60 transition-all font-semibold shadow-2xl flex items-center justify-center gap-3 text-lg"
        >
          <FiLogOut className="text-xl" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Profile