import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductDetail from './components/ProductDetails';
import Footer from './components/Footer';
import Home from './components/Home';
import Header from './components/Header';
import ScrollToTop from './components/ScrollTop'; 
import Speakers from './pages/Speaker';
import Accessory from './pages/Accessory';
import EarsPhone from './pages/EarsPhone';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import ProductsAdd from './components/Products-add';
import CartShop from './pages/CartShop';
import WishList from './pages/WishList';
import Dashboard from './auth/Dashboard';
import AuthPage from './auth/AuthPage';
import Register from './auth/Register'; 
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import Payment from './pages/Payment';
import Order from './pages/Order';
import ChatBox from './components/ChatAI';

function App() {
  return (
    <Router>
      <ScrollToTop /> 
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element = {<Dashboard/>} />
        <Route path="/speakers-marshall" element={<Speakers />} />
        <Route path="/earsphone-marshall" element={<EarsPhone/>}/>
        <Route path="/accessory-marshall" element={<Accessory />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/auth-page" element={<AuthPage />} />
        <Route path ="/register" element ={<Register/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element= {<ResetPassword/>}/>
        <Route path="/addProducts" element={<ProductsAdd/>}/>
        <Route path="/cart-shop" element={<CartShop/>}/>
        <Route path="/wish-list" element={<WishList/>}/>
        <Route path="/payment" element={<Payment/>}/>
        <Route path="/order" element={<Order/>}/>
      </Routes>
      <ChatBox/>
      <Footer />
    </Router>
  );
}

export default App;
