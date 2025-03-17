import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">E-Commerce</h3>
            <p>Temukan produk berkualitas dengan harga terbaik</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Links</h4>
            <ul>
              <li><a href="/" className="hover:text-blue-300">Home</a></li>
              <li><a href="/login" className="hover:text-blue-300">Login</a></li>
              <li><a href="/register" className="hover:text-blue-300">Register</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-6 pt-6 text-center">
          <p>&copy; {currentYear} E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
