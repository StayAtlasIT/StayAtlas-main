import React, { useRef, useState, useEffect } from 'react';
import heroImage1 from '../assets/Hero1.jpg';
import heroImage2 from '../assets/Hero2.jpg';
import heroImage3 from '../assets/Hero3.png';
// import heroImage4 from '@/assets/room4.jpg';
import SearchForm from '@/components/SearchBar';
import EnhancedVillaCards from '@/components/FrequentlyVisited';
import OffersSection from '@/components/Offfers';
import HorizontalVillas from '@/components/Trending';
import Testimonials from '@/components/Testimonials';
import WhyChooseAtlas from '@/components/WhyChooseAtlas';
import FAQ from '@/components/FAQs';
import AvailableThisWeekends from '@/components/AvailableThisWeekends';
import PopularDestination from '@/components/PopularDestination';
import ContactSection from '@/components/ContactUs';

const Home = () => {
  const heroRef = useRef(null);
  const NAVBAR_HEIGHT = 64;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Local hero background images + labels
  const heroImages = [
    { src: heroImage1},
    { src: heroImage2},
    { src: heroImage3},
    // { src: heroImage4, label: "Room 4" },
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleArrowClick = () => {
    if (heroRef.current) {
      const heroBottom = heroRef.current.getBoundingClientRect().bottom + window.scrollY;
      window.scrollTo({
        top: heroBottom - NAVBAR_HEIGHT,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full min-h-[80vh] overflow-visible" ref={heroRef}>
        {/* Background Slideshow */}
        <div className="absolute inset-0 min-h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center min-h-full transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image.src})` }}
            >
              {/* Label overlay */}
              <div className="absolute bottom-8 left-8 bg-black/50 px-4 py-2 rounded-lg text-white text-lg font-semibold">
                {image.label}
              </div>
            </div>
          ))}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 min-h-full" />

        {/* Content */}
        <div className="relative z-[2000] min-h-[80vh] flex flex-col justify-between pt-16 pb-10 lg:justify-center lg:pt-24 lg:pb-16">
          <div className="flex flex-col justify-start px-4 sm:px-8 lg:px-20 h-full">
            <div className="max-w-screen-2xl mx-auto w-full flex flex-col h-full">
              <div className="grid lg:grid-cols-2 gap-8 items-start pt-20 lg:pt-0">
                
                {/* Left Content */}
                <div className={`text-white space-y-2 transition-all duration-1000 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                } text-center lg:text-left mx-auto`}>
                  <h1 className="text-5xl lg:text-6xl font-black leading-tight">
                    <span className="block">Unleash Your</span>
                    <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                      Wanderlust
                    </span>
                  </h1>
                  <h2 className="text-2xl font-bold text-amber-300">Book Your Next Journey</h2>
                  <p className="text-lg text-gray-200 max-w-lg mx-auto lg:mx-0">
                    Crafting Exceptional Journeys: Your Global Escape Planner.
                  </p>
                  
                  {/* Start Exploring Button */}
                  <div className="flex justify-center lg:justify-start">
                    <button
                      onClick={handleArrowClick}
                      className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-6">
                      Start Exploring
                    </button>
                  </div>

                  {/* Navigation Arrows + Dots */}
                  <div className="flex items-center gap-4 mt-6 justify-center lg:justify-start">
                    <button 
                      onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-110 border border-white/30"
                    >
                      <span className="text-white text-lg">←</span>
                    </button>
                    <div className="flex gap-2">
                      {heroImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'bg-amber-400 scale-125' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                    <button 
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-110 border border-white/30"
                    >
                      <span className="text-white text-lg">→</span>
                    </button>
                  </div>
                </div>

                {/* Right Floating Images */}
                <div className="hidden lg:flex flex-col animate-fade-in-right">
                  <div className="flex gap-4 justify-center">
                    {/* Image 1 */}
                    <div className="group relative">
                      <div className="w-56 h-44 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl transform group-hover:scale-105 transition-all">
                        <img 
                          src={heroImage1}
                          alt="Room 1"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="absolute bottom-2 left-2 text-white px-3 py-1 rounded text-sm"></div>
                    </div>
                    {/* Image 2 */}
                    <div className="group relative">
                      <div className="w-44 h-56 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl transform group-hover:scale-105 transition-all">
                        <img 
                          src={heroImage2}
                          alt="Room 2"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <span className="absolute bottom-2 left-2  text-white px-3 py-1 rounded text-sm"></span>
                    </div>
                  </div>

                  {/* Bottom Floating */}
                  <div className="group relative flex justify-center mt-4">
                    <div className="w-72 h-36 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl transform group-hover:scale-105 transition-all">
                      <img 
                        src={heroImage3}
                        alt="Room 3"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <span className="absolute bottom-2 left-2 text-white px-3 py-1 rounded text-sm"></span>
                  </div>
                </div>
              </div>

              {/* Search Bar placement */}
              <div className="col-span-full mt-auto mb-20 lg:mt-10 lg:mb-12 relative z-50">
                <SearchForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Sections remain same */}
      <div className="mx-auto w-full max-w-screen-2xl p-6">
        <EnhancedVillaCards />
        <HorizontalVillas />
        <PopularDestination/>
        <OffersSection />
        <AvailableThisWeekends/>     
      </div>
      <WhyChooseAtlas />
      <div className='bg-gray-50'><Testimonials /></div>
      <div className='bg-gray-50'><FAQ /></div>
      <div id="contact-us-section" className='bg-green-50'><ContactSection/></div>
    </>
  );
};

export default Home;