import React from 'react';

const HeroSection = () => (
  <section
    id="home"
    className="h-screen bg-cover bg-center flex items-center justify-center text-center relative"
    style={{ backgroundImage: "url('/images/hero.jpg')" }}
  >
    <div className="bg-black bg-opacity-50 px-8 py-10 rounded-md">
      <h1 className="text-5xl text-white font-bold mb-4">Explore the Seas in Luxury</h1>
      <p className="text-white text-lg mb-6">Unforgettable journeys starting at OMR 499</p>
      <a href="#booking" className="bg-yellow-300 hover:bg-yellow-400 px-6 py-3 text-sm font-bold rounded shadow">
        Book Now
      </a>
    </div>
  </section>
);

export default HeroSection;
