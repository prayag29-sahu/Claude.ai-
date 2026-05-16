import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <ToastContainer
        position="top-right"
        theme="dark"
        toastStyle={{ background: '#1a1a1a', border: '1px solid #d4af37' }}
      />
    </>
  );
}
