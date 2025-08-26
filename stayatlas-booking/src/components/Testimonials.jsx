import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [fadeKey, setFadeKey] = useState(0); // key to trigger animation
  const pauseTimeout = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: "Priya & Raj Sharma",
      location: "Goa Beach Villa",
      rating: 5,
      text: "Our anniversary getaway was absolutely perfect! The villa exceeded all expectations with its private beach access, stunning sunset views, and impeccable service. The staff went above and beyond to make our stay memorable.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      tripType: "Anniversary Celebration",
      date: "March 2024",
      highlights: ["Private Beach", "Sunset Views", "Exceptional Service"]
    },
    {
      id: 2,
      name: "The Patel Family",
      location: "Kerala Backwaters Villa",
      rating: 5,
      text: "The kids absolutely loved the infinity pool and we enjoyed the peaceful backwater views. Perfect family vacation with spacious rooms and amazing local cuisine. Highly recommend for families!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      tripType: "Family Vacation",
      date: "February 2024",
      highlights: ["Infinity Pool", "Family Friendly", "Local Cuisine"]
    },
    {
      id: 3,
      name: "Aisha & Sameer",
      location: "Himachal Mountain Villa",
      rating: 5,
      text: "A magical mountain retreat! The villa had everything we needed - cozy fireplace, breathtaking views, and hiking trails right at our doorstep. The staff was incredibly helpful with local recommendations.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      tripType: "Honeymoon",
      date: "January 2024",
      highlights: ["Mountain Views", "Hiking Trails", "Cozy Fireplace"]
    },
    {
      id: 4,
      name: "Rahul & Meera",
      location: "Rajasthan Heritage Villa",
      rating: 5,
      text: "Staying in this heritage villa was like stepping back in time. The architecture, the gardens, and the royal treatment made our Rajasthan experience truly unforgettable. Worth every penny!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      tripType: "Cultural Experience",
      date: "December 2023",
      highlights: ["Heritage Architecture", "Royal Treatment", "Beautiful Gardens"]
    }
  ];

  // Auto-slide
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      changeTestimonial((currentIndex + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex, testimonials.length]);

  const pauseAndResume = () => {
    setIsAutoPlaying(false);
    clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const changeTestimonial = (newIndex) => {
    setCurrentIndex(newIndex);
    setFadeKey(prev => prev + 1); // trigger animation re-render
  };

  const nextTestimonial = () => {
    changeTestimonial((currentIndex + 1) % testimonials.length);
    pauseAndResume();
  };

  const prevTestimonial = () => {
    changeTestimonial((currentIndex - 1 + testimonials.length) % testimonials.length);
    pauseAndResume();
  };

  const goToTestimonial = (index) => {
    changeTestimonial(index);
    pauseAndResume();
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-900 to-green-900 rounded-full mb-4">
            <Quote className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-md text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Real experiences from real guests who have stayed at our carefully curated villas
          </p>
        </div>

        {/* Animated Testimonial */}
        <div
          key={fadeKey}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 relative overflow-hidden transform transition-all duration-700 ease-in-out opacity-0 translate-y-4 animate-fadeSlide"
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-900 to-green-900 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-900 to-green-900 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="text-5xl text-green-900 mb-4">"</div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Guest Info */}
              <div className="text-center lg:text-left">
                {/* Image has been removed */}
                <h3 className="text-lg font-bold text-gray-900 mb-1 mt-3">
                  {currentTestimonial.name}
                </h3>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-gray-600 mb-2">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs">{currentTestimonial.location}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-gray-600 mb-3">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">{currentTestimonial.date}</span>
                </div>
                <div className="inline-flex items-center gap-1 bg-purple-100 text-green-900 px-2 py-0.5 rounded-full text-xs font-medium">
                  {currentTestimonial.tripType}
                </div>
              </div>

              {/* Testimonial Text */}
              <div className="lg:col-span-2">
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  {currentTestimonial.text}
                </p>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">Perfect stay!</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentTestimonial.highlights.map((highlight, index) => (
                    <span 
                      key={index}
                      className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={prevTestimonial}
            className="w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:bg-gray-50 flex items-center justify-center group"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-purple-600 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextTestimonial}
            className="w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:bg-gray-50 flex items-center justify-center group"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Tailwind Animation Styles */}
  <style>
  {`
    @keyframes fadeSlide {
      0% { opacity: 0; transform: translateX(30px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    .animate-fadeSlide {
      animation: fadeSlide 0.7s ease forwards;
    }
  `}
</style>
    </section>
  );
};

export default Testimonials;