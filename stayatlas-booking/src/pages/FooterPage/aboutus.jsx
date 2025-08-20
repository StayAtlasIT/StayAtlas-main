import React, { useEffect, useRef } from "react";
import "../../index.css";
import { motion } from "framer-motion";

const AboutUs = () => {
 // Add parallax scroll effect
 useEffect(() => {
   const handleScroll = () => {
     const parallaxElements = document.querySelectorAll('.parallax-bg');
     parallaxElements.forEach(element => {
       const scrollPosition = window.pageYOffset;
       // Adjust the divisor (5) to control parallax intensity
       element.style.transform = `translateY(${scrollPosition / 3}px)`;
       });
     };

     window.addEventListener('scroll', handleScroll);
     return () => {
       window.removeEventListener('scroll', handleScroll);
     };
   }, []);

 const testimonialsRef = useRef(null);

 const scrollTestimonials = (scrollOffset) => {
   testimonialsRef.current.scrollLeft += scrollOffset;
 };

 return (
   <div className="min-h-screen w-full">
     {/* Hero Section */}
     <div className="h-screen flex flex-col justify-center items-center text-white relative overflow-hidden">
       {/* Parallax Background */}
       <div 
         className="parallax-bg"
         style={{
           backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundColor: "rgba(14,50,38,0.5)",
           backgroundBlendMode: "overlay",
         }}
         ></div>
       
       <motion.h1
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1 }}
         className="text-5xl md:text-6xl font-bold mb-4 z-10"
       >
         Welcome to Stay Atlas
       </motion.h1>
       <motion.p
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1.5 }}
         className="text-lg md:text-xl z-10"
       >
         Where Stories Meet Stays
       </motion.p>
       <div className="absolute bottom-10 animate-bounce text-white text-sm z-10">
         Scroll to Explore ↓
       </div>
     </div>

     {/* Pull-Up Content Section */}
     <motion.div
       initial={{ y: "100%" }}
       animate={{ y: 0 }}
       transition={{ duration: 1.2, ease: "easeInOut" }}
       className="-mt-20 bg-white rounded-t-[2rem] shadow-2xl p-8 md:p-16 text-[#0e3226] relative z-20"
     >
       {/* Mission and Vision */}
       <div className="mb-8 p-6 rounded-xl shadow-md" style={{ backgroundColor: '#f9f9f9', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
         <h2 className="text-3xl font-semibold mb-2">Our Mission and Vision</h2>
         <p>
           Connecting travelers with unforgettable vacation experiences while
           empowering villa owners to unlock their property's full potential.
         </p>
       </div>

       {/* Story and How We Work */}
       <div className="grid md:grid-cols-2 gap-8 mb-8">
         <div className="p-6 rounded-xl shadow h-64 flex flex-col justify-end" style={{ backgroundColor: '#f9f9f9', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
           <h3 className="text-2xl font-bold mb-2">Our Story</h3>
           <p>
             Born in Mumbai, Stay Atlas grew to connect homeowners and travelers
             across India.
           </p>
         </div>
         <div className="p-6 rounded-xl shadow h-64 flex flex-col justify-end" style={{ backgroundColor: '#f9f9f9', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
           <h3 className="text-2xl font-bold mb-2">How We Work</h3>
           <p>
             We handle marketing, guest communication, and property care — you
             enjoy peace of mind and profits.
           </p>
         </div>
       </div>

       {/* Testimonials */}
       <div className="mb-8 shadow" style={{ backgroundColor: '#f9f9f9', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
         <h3 className="text-2xl font-semibold mb-4 p-6">Testimonials</h3>
         <div ref={testimonialsRef} className="flex overflow-x-auto snap-x p-6">
           {/* Testimonial 1 */}
           <div className="flex-shrink-0 w-80 snap-start mr-6 p-4 rounded-md" style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
             <img src="http://googleusercontent.com/image_generation_content/0" alt="User 1" className="w-12 h-12 rounded-full mb-2" />
             <div className="text-yellow-500 mb-1">⭐⭐⭐⭐⭐</div>
             <p className="italic">"Stay Atlas turned my villa into a dream destination!" – Happy Owner</p>
           </div>
           {/* Testimonial 2 */}
           <div className="flex-shrink-0 w-80 snap-start mr-6 p-4 rounded-md" style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
             <img src="http://googleusercontent.com/image_generation_content/1" alt="User 2" className="w-12 h-12 rounded-full mb-2" />
             <div className="text-yellow-500 mb-1">⭐⭐⭐⭐</div>
             <p className="italic">"Super smooth, super reliable. Highly recommend!" – Guest</p>
           </div>
           {/* Testimonial 3 */}
           <div className="flex-shrink-0 w-80 snap-start mr-6 p-4 rounded-md" style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
             <img src="http://googleusercontent.com/image_generation_content/2" alt="User 3" className="w-12 h-12 rounded-full mb-2" />
             <div className="text-yellow-500 mb-1">⭐⭐⭐⭐⭐</div>
             <p className="italic">"Exceptional service and support throughout the entire process." - Another Happy Owner</p>
           </div>
         </div>
         <div className="flex justify-center p-4">
           <button onClick={() => scrollTestimonials(-300)} className="px-4 py-2 bg-gray-200 rounded-l-md">←</button>
           <button onClick={() => scrollTestimonials(300)} className="px-4 py-2 bg-gray-200 rounded-r-md">→</button>
         </div>
       </div>

       {/* Call to Action */}
       <div className="text-center p-6 rounded-xl shadow" style={{ backgroundColor: '#d4af75', color: 'black', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
         <h3 className="text-2xl font-bold mb-2">Join the Stay Atlas Family</h3>
         <p>
           Contact us today to get started with your vacation rental journey.
         </p>
       </div>
     </motion.div>
   </div>
 );
};

export default AboutUs;