'use client'
import React, { useState } from 'react';

// Define an interface for the formData state to provide type safety
interface BookingFormData {
  name: string;
  email: string;
  checkIn: string;
  checkOut: string;
  roomType: 'standard' | 'deluxe' | 'family'; // Enforce specific room types
  guests: number;
}

// Main App component
const App = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  // Apply the BookingFormData interface to the formData state
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    checkIn: '',
    checkOut: '',
    roomType: 'standard',
    guests: 1,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({}); // Type for form errors
  const [bookingMessage, setBookingMessage] = useState('');

  // Function to open the booking modal
  const openBookingModal = () => {
    setIsBookingModalOpen(true);
    setBookingMessage(''); // Clear previous messages
    setFormErrors({}); // Clear previous errors
  };

  // Function to close the booking modal
  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    // Reset form data when closing
    setFormData({
      name: '',
      email: '',
      checkIn: '',
      checkOut: '',
      roomType: 'standard',
      guests: 1,
    });
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { // Add type for event
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form data
  const validateForm = () => {
    const errors: Record<string, string> = {}; // Explicitly type errors object
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.checkIn) errors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) errors.checkOut = 'Check-out date is required';
    if (formData.checkIn && formData.checkOut && new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      errors.checkOut = 'Check-out date must be after check-in date';
    }
    if (formData.guests < 1) errors.guests = 'Number of guests must be at least 1';
    return errors;
  };

  // Handle form submission - NOW SENDS TO NEXT.JS APP ROUTER API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Add type for event
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setBookingMessage('Please correct the errors above.');
      return;
    }

    setBookingMessage('Booking in progress...');
    try {
      // Pointing to the Next.js App Router API route
      const response = await fetch('/api/book-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) { // Check if the response status is 2xx
        console.log('Booking successful:', result);
        setBookingMessage('Booking successful! We will contact you shortly. Booking ID: ' + result.bookingId);
        setFormErrors({}); // Clear errors on success
        // Optionally, close modal after a short delay or allow user to review success message
        // setTimeout(() => closeBookingModal(), 3000);
      } else {
        console.error('Booking failed:', result.message);
        setBookingMessage('Booking failed: ' + result.message);
      }

    } catch (error) {
      console.error('Network or server error:', error);
      setBookingMessage('Booking failed. Could not connect to the server. Please try again later.');
    }
  };

  return (
    <div className="font-sans antialiased text-stone-800 bg-stone-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 md:px-12 fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-emerald-700">
            Pukoret Home Suites
          </a>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#about" className="text-stone-600 hover:text-emerald-700 transition duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#rooms" className="text-stone-600 hover:text-emerald-700 transition duration-300">
                  Rooms
                </a>
              </li>
              <li>
                <button
                  onClick={openBookingModal}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition duration-300 shadow-md"
                >
                  Book Now
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1?text=Elegant+Guest+House+Entrance)`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center p-6 rounded-lg bg-black bg-opacity-40 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Your Peaceful Retreat in the Heart of Kenya
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Experience unparalleled comfort and hospitality at Pukoret Home Suites, your home away from home.
          </p>
          <button
            onClick={openBookingModal}
            className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition duration-300 transform hover:scale-105 shadow-xl"
          >
            Discover Your Perfect Room
          </button>
        </div>
      </section>

      {/* About Us Section (Expanded) */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-bold text-center text-emerald-800 mb-12">About Pukoret Home Suites</h2>
          <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
            <div className="md:w-1/2">
              <img
                src="https://placehold.co/600x400/34d399/ffffff?text=Guest+House+Lobby"
                alt="Guest House Lobby"
                className="rounded-xl shadow-lg transform hover:scale-105 transition duration-300"
              />
            </div>
            <div className="md:w-1/2 text-lg leading-relaxed">
              <p className="mb-4">
Welcome to Pukoret Home Suites, where one decade of unwavering dedication to hospitality converge with the timeless charm of Kenyan culture. Established with a vision to offer a tranquil sanctuary, our guest house provides a unique blend of traditional warmth and contemporary comfort.              </p>
              <p className="mb-4">
Our journey began over 10 years ago, driven by a passion to create memorable experiences for every guest. We believe in personalized service, ensuring that your stay is not just comfortable, but truly enriching. From the moment you step through our doors, you’ll be greeted with genuine smiles and an atmosphere designed for relaxation.              </p>
              <p>
We are committed to maintaining the highest standards of cleanliness, safety, and guest satisfaction. Our team is always on hand to assist with any needs, provide local insights, and ensure your time with us is nothing short of perfect. Discover the difference that heartfelt hospitality makes at Pukoret Home Suites.              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center mt-12">
            <div className="p-6 bg-stone-100 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold text-emerald-700 mb-3">Our Mission</h3>
              <p className="text-stone-700">To provide a peaceful and luxurious retreat, offering exceptional service and a truly memorable experience for every guest.</p>
            </div>
            <div className="p-6 bg-stone-100 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold text-emerald-700 mb-3">Our Values</h3>
              <p className="text-stone-700">Hospitality, Integrity, Comfort, and a deep respect for our guests and the environment.</p>
            </div>
            <div className="p-6 bg-stone-100 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold text-emerald-700 mb-3">Our Promise</h3>
              <p className="text-stone-700">A serene escape, personalized attention, and a commitment to making you feel at home, always.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-20 bg-stone-100">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-bold text-center text-emerald-800 mb-12">Our Comfortable Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Room Card 1 */}

            {/* Room Card 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <img
                src="https://placehold.co/500x300/34d399/ffffff?text=Deluxe+Room"
                alt="BnB"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-emerald-700 mb-2">BnB</h3>
                <p className="text-stone-600 mb-4">
                 Cozy and comfortable, perfect for solo travelers or couples. Equipped with all essential amenities.
                </p>
                <ul className="text-stone-700 text-sm mb-4 list-disc list-inside">
                  <li>Queen-size bed</li>
                  <li>En-suite bathroom</li>
                  <li>Free Wi-Fi</li>
                  <li>Private balcony</li>
                  <li>Mini-Fridge</li>
                  <li>Kichenette</li>


                </ul>
                <button
                  onClick={openBookingModal}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-full hover:bg-emerald-600 transition duration-300"
                >
                  Book BnB
                </button>
              </div>
            </div>

            {/* Room Card 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <img
                src="https://placehold.co/500x300/10b981/ffffff?text=Family+Suite"
                alt="Standard Room"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-emerald-700 mb-2">Family Suite</h3>
                <p className="text-stone-600 mb-4">
A well-appointed space designed for comfort and convenience. Ideal for business travelers or vacationers seeking a relaxing stay, it combines modern essentials with a touch of homeliness.                </p>
                <ul className="text-stone-700 text-sm mb-4 list-disc list-inside">
                  <li>Queen-Size bed</li>
                  <li>En-suite bathroom</li>
                  <li>Work desk</li>
                  <li>Free Wi-Fi</li>
                  <li>Private balcony</li>
                  <li>Kichenette</li>


                </ul>
                <button
                  onClick={openBookingModal}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-full hover:bg-emerald-600 transition duration-300"
                >
                  Book Standard Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section with Google Map */}
      <section id="location" className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-bold text-center text-emerald-800 mb-12">Find Us Here</h2>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-lg leading-relaxed">
              <p className="mb-4">
                Pukoret Home Suites is conveniently located in a peaceful neighborhood, offering easy access to local attractions, dining, and transportation hubs.
              </p>
              <p className="mb-4">
                Our prime location ensures a quiet stay while keeping you connected to the vibrant pulse of the city. We are just a short drive from major landmarks and business districts.
              </p>
              <p className="font-semibold text-emerald-700">
               Narok Town, London Area 500m off the Narok - Bomet highway through Basabara Junction, Pukoret Home Suites, Kenya 
              </p>
              <p className="font-semibold text-emerald-700">
                Phone: 0759550770 or 0705152747
              </p>
              <p className="font-semibold text-emerald-700">
              </p>
            </div>
            <div className="md:w-1/2 w-full h-96 rounded-xl shadow-lg overflow-hidden border-4 border-emerald-200">
              {/* Placeholder for Google Map - In a real app, you'd use a Google Maps API component */}
<iframe
  src="https://www.google.com/maps?q=-1.085917,35.885556&z=15&output=embed"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Location on Google Map"
></iframe>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 text-white py-10">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <p className="mb-4">&copy; {new Date().getFullYear()} Pukoret Home Suites. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-emerald-400 transition duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition duration-300">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition duration-300">Contact Us</a>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative transform transition-all duration-300 scale-100 opacity-100">
            <button
              onClick={closeBookingModal}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-800 text-3xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">Book Your Stay</h2>

            {bookingMessage && (
              <p className={`mb-4 text-center ${bookingMessage.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {bookingMessage}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-stone-700 text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.name ? 'border-red-500' : 'border-stone-300'}`}
                  placeholder="John Doe"
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-stone-700 text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.email ? 'border-red-500' : 'border-stone-300'}`}
                  placeholder="john.doe@example.com"
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="checkIn" className="block text-stone-700 text-sm font-semibold mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.checkIn ? 'border-red-500' : 'border-stone-300'}`}
                  />
                  {formErrors.checkIn && <p className="text-red-500 text-xs mt-1">{formErrors.checkIn}</p>}
                </div>
                <div>
                  <label htmlFor="checkOut" className="block text-stone-700 text-sm font-semibold mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.checkOut ? 'border-red-500' : 'border-stone-300'}`}
                  />
                  {formErrors.checkOut && <p className="text-red-500 text-xs mt-1">{formErrors.checkOut}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="roomType" className="block text-stone-700 text-sm font-semibold mb-2">
                  Room Type
                </label>
                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="standard">Standard Room</option>
                  <option value="deluxe">Deluxe Room</option>
                  <option value="family">Family Suite</option>
                </select>
              </div>

              <div>
                <label htmlFor="guests" className="block text-stone-700 text-sm font-semibold mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.guests ? 'border-red-500' : 'border-stone-300'}`}
                />
                {formErrors.guests && <p className="text-red-500 text-xs mt-1">{formErrors.guests}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition duration-300 shadow-md transform hover:scale-105"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
