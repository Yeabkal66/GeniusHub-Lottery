import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import BuyTicket from './pages/BuyTicket';
import Payment from './pages/Payment';
import Pending from './pages/Pending';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<BuyTicket />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
