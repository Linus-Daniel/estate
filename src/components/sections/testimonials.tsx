// components/TestimonialSection.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Testimonial = {
  id: number;
  rating: number;
  content: string;
  author?: string;
  company?: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    rating: 5,
    content:
      "My Experience With Property Management Services Has Exceeded Expectations. They Efficiently Manage Properties With A Professional And Attentive Approach In Every Situation. I Feel Reassured That Any Issue Will Be Resolved Promptly And Effectively.",
    author: "SQB24-9-1",
    company: "Bankhouse REAL ESTATE",
    image: "/images/testimonial/review1.jpg",
  },
  {
    id: 2,
    rating: 5,
    content:
      "Our subscription to the Creative Estate with your best success in Italy and Africa, offering informed feedback about our test results.",
    company: "Real Estate",
    image: "/images/testimonial/review2.jpg",
  },
  {
    id: 3,
    rating: 5,
    content:
      "The team provided exceptional service throughout our entire home buying process. Their attention to detail and market knowledge was impressive.",
    author: "Michael Johnson",
    company: "Urban Living",
    image: "/images/testimonial/review3.jpg",
  },
];

const trustedCompanies = [
  "Real Estate",
  "SQB24-9-1",
  "Bankhouse REAL ESTATE",
  "Accusat",
  "Urban Living",
  "Prime Properties",
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection("right");
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const carouselVariants = {
    enter: (direction: string) => {
      return {
        x: direction === "right" ? 100 : -100,
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => {
      return {
        x: direction === "right" ? -100 : 100,
        opacity: 0,
      };
    },
  };

  const imageVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <section className="bg-slate-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl lg:w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Animated Image Background */}
        <div className="relative overflow-hidden h-[80vh]">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={testimonials[currentIndex].id}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={testimonials[currentIndex].image}
                alt="Real Estate"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-20 h-full flex flex-col justify-center p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Our Testimonials</h2>
            <p className="text-lg mb-6">
              Hear what our clients say about our exceptional service and 
              property management expertise.
            </p>
            <div className="mt-auto">
              <h3 className="text-xl font-semibold mb-4">
                Trusted By Over 150+ Major Companies
              </h3>
              <div className="flex flex-wrap gap-3">
                {trustedCompanies.map((company, index) => (
                  <span 
                    key={index} 
                    className="bg-white text-primary bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Testimonial Carousel */}
        <div className="relative h-full">
          <div className="relative h-full flex flex-col justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={carouselVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white p-8 rounded-lg shadow-lg h-full flex flex-col justify-center"
              >
                <div className="flex mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <StarIcon key={i} className="h-6 w-6 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg italic text-gray-600 mb-6">
                  "{testimonials[currentIndex].content}"
                </blockquote>
                {testimonials[currentIndex].author && (
                  <div className="mt-auto text-right">
                    <p className="font-semibold text-gray-800">
                      {testimonials[currentIndex].author}
                    </p>
                    {testimonials[currentIndex].company && (
                      <p className="text-gray-600">
                        {testimonials[currentIndex].company}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={prevTestimonial}
                className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex space-x-2 items-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? "right" : "left");
                      setCurrentIndex(index);
                    }}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentIndex ? "bg-gray-800" : "bg-gray-300"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Icons remain the same as previous implementation
const StarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default TestimonialSection;