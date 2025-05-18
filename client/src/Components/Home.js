import React from 'react';
import Navbar from '../Components/Navbar';
import HeroSection from '../Components/HeroSection';
import FeaturedCruises from '../Components/FeaturedCruises';
import Services from '../Components/Services';
import BookingForm from '../Components/BookingForm';
import Footer from '../Components/Footer';

import { useToast } from './hooks/use-toast';
const { toast, success, error } = useToast();

const Home = () => (
  
  <>
    <Navbar />
    <main className="pt-20">
      <HeroSection />
      <FeaturedCruises />
      <Services />
      <BookingForm />
    </main>
    <Footer />
  </>
);


  
export default Home;
