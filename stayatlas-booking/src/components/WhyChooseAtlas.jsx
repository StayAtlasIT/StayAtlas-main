import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Users,
  Clock,
  Star,
  Home,
  Headphones
} from "lucide-react";

const WhyChooseAtlas = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Properties",
      description:
        "Every villa is personally inspected and verified by our team to ensure the highest quality standards."
    },
    {
      icon: Users,
      title: "24/7 Concierge",
      description:
        "Our dedicated concierge team is available round the clock to assist with your needs and requests."
    },
    {
      icon: Clock,
      title: "Instant Booking",
      description:
        "Book your perfect villa instantly with our streamlined booking process and immediate confirmation."
    },
    {
      icon: Star,
      title: "Premium Experiences",
      description:
        "Curated luxury experiences and amenities that transform your stay into an unforgettable journey."
    },
    {
      icon: Home,
      title: "Unique Properties",
      description:
        "Access to exclusive villas and unique properties you won't find anywhere else."
    },
    {
      icon: Headphones,
      title: "Expert Support",
      description:
        "Local experts and property managers ensure seamless check-in and exceptional service throughout your stay."
    }
  ];

  return (
    <section className="py-12 md:py-25 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl font-black mb-3">
            Why Choose StayAtlas
          </h2>
          <p className="text-base md:text-md text-gray-600 max-w-2xl mx-auto">
            We're committed to providing exceptional villa rental experiences with unmatched service, 
            verified properties, and personalized attention to every detail of your stay.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-md"
            >
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 group-hover:scale-105 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        {/* <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl px-6 py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">100+</div>
              <div className="text-sm text-gray-600">Premium Villas</div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-500">50K+</div>
              <div className="text-sm text-gray-600">Happy Guests</div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">4.6★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default WhyChooseAtlas;
