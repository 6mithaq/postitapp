import React from 'react';

const cruises = [
  {
    title: "Caribbean Escape",
    description: "7 nights across the Caribbean with onboard entertainment and gourmet dining.",
    image: "/images/caribbean.jpg"
  },
  {
    title: "Mediterranean Voyage",
    description: "Explore Italy, Greece, and Spain with our 10-night luxury cruise.",
    image: "/images/mediterranean.jpg"
  },
  {
    title: "Arctic Expedition",
    description: "Witness the Northern Lights on this 5-night arctic adventure.",
    image: "/images/arctic.jpg"
  }
];

const FeaturedCruises = () => (
  <section id="cruises" className="px-8 py-16 bg-white">
    <h2 className="text-3xl text-center font-bold text-gray-800 mb-12">Featured Cruise Packages</h2>
    <div className="grid md:grid-cols-3 gap-10">
      {cruises.map((cruise, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
          <img src={cruise.image} alt={cruise.title} className="h-48 w-full object-cover" />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">{cruise.title}</h3>
            <p className="text-gray-700 text-sm">{cruise.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturedCruises;
