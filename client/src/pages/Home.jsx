import React from 'react';
import Hero from '../Components/Hero'
import WhyChooseUs from '../Components/WhyChooseUs'
import HowItWorks from '../Components/HowItWorks'
import BookingCTA from '../Components/BookingCTA'
import FeaturedSection from '../Components/FeaturedSection'
import Banner from '../Components/Banner'
import Testimonial from '../Components/Testimonial';
import Newsletter from '../Components/Newsletter';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Luxury Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-10"></div>
        <div className="animate-fade-in-up">
          <Hero />
        </div>
      </div>

      {/* Premium Sections */}
      <div className="relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>

        <div className="animate-fade-in-up animation-delay-300">
          <WhyChooseUs />
        </div>

        <div className="animate-fade-in-up animation-delay-600">
          <HowItWorks />
        </div>

        <div className="animate-fade-in-up animation-delay-900">
          <BookingCTA />
        </div>

        <div className="animate-fade-in-up animation-delay-1200">
          <FeaturedSection />
        </div>

        <div className="animate-fade-in-up animation-delay-1500">
          <Banner />
        </div>

        <div className="animate-fade-in-up animation-delay-1800">
          <Testimonial />
        </div>

        <div className="animate-fade-in-up animation-delay-2100">
          <Newsletter />
        </div>
      </div>
    </div>
  )
}

export default Home