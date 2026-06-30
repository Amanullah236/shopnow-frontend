import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Products from './pages/Products'
import Favorites from './pages/Favorites'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import ManageProducts from './pages/admin/ManageProducts'
import EditProduct from './pages/admin/EditProduct'
import ManageOrders from './pages/admin/ManageOrders'
import OrderDetails from './pages/admin/OrderDetails'
import AdminDashboard from './pages/admin/AdminDashboard'
import AddProduct from './pages/admin/AddProduct'
import OrderDetail from './pages/OrderDetail'
import ForgotPassword from './pages/ForgotPassword'

function AppLayout() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      <Routes>
        <Route path="/"                 element={<Home />} />
        <Route path="/product/:id"      element={<ProductDetail />} />
        <Route path="/products"         element={<Products />} />
        <Route path="/fav"              element={<Favorites />} />
        <Route path="/about"            element={<About />} />
        <Route path="/login"            element={<Login />} />
        <Route path="/register"         element={<Register />} />
        <Route path="/forgot-password"  element={<ForgotPassword />} />

        {/* ✅ PROTECTED ROUTES */}
        <Route path="/cart" element={
          <ProtectedRoute><Cart /></ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute><Checkout /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><Orders /></ProtectedRoute>
        } />
        <Route path="/orders/:id" element={
          <ProtectedRoute><OrderDetail /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute adminOnly><ManageProducts /></ProtectedRoute>
        } />
        <Route path="/admin/products/add" element={
          <ProtectedRoute adminOnly><AddProduct /></ProtectedRoute>
        } />
        <Route path="/admin/products/edit/:id" element={
          <ProtectedRoute adminOnly><EditProduct /></ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute adminOnly><ManageOrders /></ProtectedRoute>
        } />
        <Route path="/admin/orders/:id" element={
          <ProtectedRoute adminOnly><OrderDetails /></ProtectedRoute>
        } />
      </Routes>
      
      {!isAdminRoute && <Footer />}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App