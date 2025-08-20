import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import image1 from '../assets/slide1.jpg';
import image2 from '../assets/slide2.jpg';
import image3 from '../assets/slide3.jpg';
import image4 from '../assets/slide4.jpg';
import image5 from '../assets/slide5.jpg';

const slideImages = [
  {
    url: image1,
    caption: 'Wake up to ocean views and golden mornings',
  },
  {
    url: image2,
    caption: 'Unwind in your private poolside paradise',
  },
  {
    url: image3,
    caption: 'Evenings made magical with sunset decks',
  },
  {
    url: image4,
    caption: 'Luxury nestled in nature’s embrace',
  },
  {
    url: image5,
    caption: 'Your dream villa awaits — book now!',
  },
];

const Slideshow = () => {
  return (
    <div className="slide-container w-full ">
      <Slide
        duration={4000}
        transitionDuration={800}
        infinite
        autoplay
        arrows={false}
        easing="ease"
      >
        {slideImages.map((slideImage, index) => (
          <div key={index}>
            <div
              className="w-full h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center relative overflow-hidden"
              style={{ backgroundImage: `url(${slideImage.url})` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <h2 className="z-10 text-white text-2xl md:text-4xl font-semibold text-center px-4">
                {slideImage.caption}
              </h2>
            </div>
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default Slideshow;
