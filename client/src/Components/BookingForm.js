import React, { useState } from 'react';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cruise: '',
    date: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Booking submitted!');
  };

  return (
    <section id="booking" className="px-8 py-16 bg-white">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Book Your Cruise</h2>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-4 border border-gray-300 rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full p-4 border border-gray-300 rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <select
          name="cruise"
          className="w-full p-4 border border-gray-300 rounded"
          value={formData.cruise}
          onChange={handleChange}
          required
        >
          <option value="">Select Cruise Package</option>
          <option value="Caribbean Escape">Caribbean Escape</option>
          <option value="Mediterranean Voyage">Mediterranean Voyage</option>
          <option value="Arctic Expedition">Arctic Expedition</option>
        </select>
        <input
          type="date"
          name="date"
          className="w-full p-4 border border-gray-300 rounded"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded hover:bg-blue-700">
          Submit Booking
        </button>
      </form>
    </section>
  );
};

export default BookingForm;
