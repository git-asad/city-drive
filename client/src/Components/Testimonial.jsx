import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'

const Testimonial = () => {

      const testimonials = [
        {
          name: "Emma Rodriguez",
          location: "Barcelona, Spain",
          image: assets.testimonial_image_1,
          testimonial: "I've rented cars from various companies, but the experience with City Drive was exceptional. The luxury vehicles are immaculate, and the concierge service made my entire trip seamless.",
          rating: 5,
          carRented: "Mercedes-Benz S-Class"
        },
        {
          name: "John Smith",
          location: "New York, USA",
          image: assets.testimonial_image_2,
          testimonial: "City Drive made my business trip unforgettable. The Tesla Model S was perfect for my needs, and the 24/7 support team was always available. Truly premium service.",
          rating: 5,
          carRented: "Tesla Model S"
        },
        {
          name: "Ava Johnson",
          location: "Sydney, Australia",
          image: assets.testimonial_image_1,
          testimonial: "I highly recommend City Drive! Their fleet of luxury vehicles is unmatched, and I always feel like I'm getting the best deal with world-class service. The BMW X5 was a dream to drive.",
          rating: 5,
          carRented: "BMW X5"
        },
        {
          name: "Marcus Chen",
          location: "Singapore",
          image: assets.testimonial_image_2,
          testimonial: "As a frequent traveler, I've tried many rental services. City Drive stands out with their premium fleet and exceptional customer care. The Audi A8 exceeded all expectations.",
          rating: 5,
          carRented: "Audi A8"
        },
        {
          name: "Sophia Williams",
          location: "London, UK",
          image: assets.testimonial_image_1,
          testimonial: "The attention to detail at City Drive is remarkable. From the moment I booked until I returned the vehicle, every interaction was flawless. The Range Rover was perfect for my countryside tour.",
          rating: 5,
          carRented: "Range Rover Sport"
        },
        {
          name: "David Kim",
          location: "Seoul, South Korea",
          image: assets.testimonial_image_2,
          testimonial: "City Drive's luxury fleet and professional service made my vacation extraordinary. The Porsche 911 was a thrill to drive, and the pickup process was incredibly smooth.",
          rating: 5,
          carRented: "Porsche 911"
        }
    ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center mb-16">
            <Title title="What Our Customers Say" subTitle="Discover why discerning travelers choose City Drive for their luxury vehicle experiences around the world."/>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            <img className="w-16 h-16 rounded-full border-4 border-gold-200" src={testimonial.image} alt={testimonial.name} loading="lazy" />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">{testimonial.name}</p>
                            <p className="text-gray-600 font-medium">{testimonial.location}</p>
                            <p className="text-sm text-gold-600 font-semibold">{testimonial.carRented}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                        {Array(testimonial.rating).fill(0).map((_, idx) => (
                            <img key={idx} src={assets.star_icon} alt="star-icon" className="w-5 h-5" />
                        ))}
                        <span className="ml-2 text-sm text-gray-600 font-medium">{testimonial.rating}.0</span>
                    </div>

                    <p className="text-gray-700 leading-relaxed font-light italic">"{testimonial.testimonial}"</p>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Verified Customer</span>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Premium Member</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Testimonial
