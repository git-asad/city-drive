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
    <>
      <div className="animate-fade-in-up">
        <Hero />
      </div>
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
    </>
  )
}

export default Home