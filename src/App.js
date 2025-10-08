// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; 

// // --- Import All Pages ---
// import ProductList from './pages/ProductList'; 
// import ProductDetail from './pages/ProductDetail'; 
// import Cart from './pages/Cart'; 
// import Checkout from './pages/Checkout'; 
// import Orders from './pages/Orders'; 
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Profile from './pages/Profile';
// import Addresses from './pages/Addresses';
// import Voucher from './pages/MyVouchers';
// import SellerRegistration from './pages/SellerRegistration';
// import SellerDashboard from './pages/seller/SellerDashboard';

// // --- MUI and Base Components ---
// import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';


// // Simple Header Component (For Demo and Navigation)
// const Header = () => {
//     const { isAuthenticated, user, logout } = useAuth();
//     const isApprovedSeller = isAuthenticated && user && user.seller_status === 'approved';

//     return (
//         <AppBar position="static">
//             <Toolbar>
//                 <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
//                     ZIRVANAA ECOMM
//                 </Typography>
                
//                 <Button color="inherit" component={Link} to="/products">Shop</Button>
//                 <Button color="inherit" component={Link} to="/cart">Cart</Button>
//                 <Button color="inherit" component={Link} to="/orders">Orders</Button>
                
//                 {isAuthenticated ? (
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                         {/* Seller Dashboard link */}
//                         {isApprovedSeller && (
//                             <Button color="inherit" component={Link} to="/seller/dashboard">Seller</Button>
//                         )}
//                         <Button color="inherit" component={Link} to="/profile">Profile</Button>
//                         <Button color="inherit" onClick={logout}>Logout</Button>
//                     </Box>
//                 ) : (
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                         <Button color="inherit" component={Link} to="/login">Login</Button>
//                         <Button color="inherit" component={Link} to="/signup">Signup</Button>
//                     </Box>
//                 )}
//             </Toolbar>
//         </AppBar>
//     );
// };


// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Header />
//         <Routes>
//           {/* Public & Catalog Routes */}
//           <Route path="/" element={<ProductList />} />
//           <Route path="/products" element={<ProductList />} />
//           <Route path="/products/:slug" element={<ProductDetail />} />

//           {/* Authentication Routes */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
          
//           {/* Customer Management Routes (Authenticated) */}
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/addresses" element={<Addresses />} />
//           <Route path="/voucher" element={<Voucher />} />
          
//           {/* Cart & Checkout Flow (Authenticated) */}
//           <Route path="/cart" element={<Cart />} />
//           <Route path="/checkout" element={<Checkout />} />
//           <Route path="/orders" element={<Orders />} />

//           {/* Seller Routes (Authenticated) */}
//           <Route path="/seller/register" element={<SellerRegistration />} />
//           <Route path="/seller/dashboard" element={<SellerDashboard />} />

//           {/* Fallback for unmatched routes */}
//           <Route path="*" element={<ProductList />} /> 
//         </Routes>
//       </AuthProvider>
//       <ToastContainer position="bottom-right" />
//     </Router>
//   );
// }

// export default App;





import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

// --- Core App Imports ---
import { Container, CssBaseline } from '@mui/material'; // Added CssBaseline and Container for structural integrity
import Navbar from './components/Navbar'; // <-- Using the dedicated Navbar component

// --- Import All Pages ---
import ProductList from './pages/ProductList'; 
import ProductDetail from './pages/ProductDetail'; 
import Cart from './pages/Cart'; 
import Checkout from './pages/Checkout'; 
import Orders from './pages/Orders'; 
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Addresses from './pages/Addresses';
import Vouchers from './pages/MyVouchers'; // <-- Correct Page for My Vouchers (MyVouchers.jsx content)
import VoucherPurchase from './pages/VoucherPurchase'; // <-- Page for purchasing vouchers
import SellerRegistration from './pages/SellerRegistration';
import SellerDashboard from './pages/seller/SellerDashboard';
import About from './pages/About';

function App() {
  return (
    <Router>
      {/* AuthProvider must wrap the entire application content */}
      <AuthProvider>
        {/* MUI base styles */}
        <CssBaseline /> 
        
        {/* Global Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
          <Routes>
            {/* Public & Catalog Routes */}
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:slug" element={<ProductDetail />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* FIX: ADDED ABOUT ROUTE */}
            <Route path="/about" element={<About />} /> 
            
            {/* --- Customer Management Routes (Authenticated) --- */}
            
            {/* Profile and Settings */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/addresses" element={<Addresses />} />
            
            {/* Vouchers (FIXED): Separate route for listing and purchase form */}
            <Route path="/vouchers" element={<Vouchers />} /> 
            <Route path="/vouchers/purchase" element={<VoucherPurchase />} /> 
            
            {/* Cart & Checkout Flow */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />

            {/* --- Seller Routes (Authenticated) --- */}
            <Route path="/seller/register" element={<SellerRegistration />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<ProductList />} /> 
          </Routes>
        </Container>
      </AuthProvider>
      <ToastContainer position="bottom-right" />
    </Router>
  );
}

export default App;