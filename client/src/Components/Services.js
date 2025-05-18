import React from 'react';

const services = [
  {
    title: "Easy Reservations",
    description: "Quick and seamless booking process tailored for you."
  },
  {
    title: "24/7 Customer Care",
    description: "Our team is available anytime to help with your needs."
  },
  {
    title: "World-Class Amenities",
    description: "Enjoy spas, fine dining, entertainment, and more."
  }
];

const Services = () => (
  <section id="services" className="px-8 py-16 bg-gray-100">
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Us?</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <div key={index} className="bg-white p-6 rounded-lg text-center shadow">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">{service.title}</h3>
          <p className="text-gray-600 text-sm">{service.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Services;
