import React from 'react';

const Navbar = () => (
  <nav className="flex justify-between items-center p-6 bg-white shadow-md fixed w-full z-10">
    <div className="text-2xl font-bold text-blue-800">CruiseBooking</div>
    <ul className="flex space-x-6 text-gray-700">
      <li><a href="#home" className="hover:text-blue-600">Home</a></li>
      <li><a href="#cruises" className="hover:text-blue-600">Cruises</a></li>
      <li><a href="#services" className="hover:text-blue-600">Services</a></li>
      <li><a href="#booking" className="hover:text-blue-600">Booking</a></li>
      <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
    </ul>
  </nav>
);

export default Navbar;
