"use client"
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    quote: "My Experience With Property Management Services Has Exceeded Expectations. They Efficiently Manage Properties With A Professional And Attentive Approach In Every Situation.",
    author: "Kathryn Murphy",
    role: "Home Owner",
    rating: 5
  },
  {
    quote: "The team at Home Lengo made my home buying experience seamless. Their attention to detail and market knowledge is unmatched.",
    author: "Darrell Steward",
    role: "Real Estate Investor",
    rating: 5
  },
  {
    quote: "As a first-time home seller, I was nervous, but their guidance and support made the process stress-free and profitable.",
    author: "Theresa Webb",
    role: "Property Seller",
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted By Over 150+ Major Companies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <blockquote className="text-gray-700 italic mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-bold text-gray-900">{testimonial.author}</p>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;