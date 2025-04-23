"use client"
import { motion } from 'framer-motion';
import { FiCalendar, FiUser } from 'react-icons/fi';

const blogPosts = [
  {
    title: "Building Gains Into Housing Stocks And How",
    date: "January 28, 2024",
    author: "Jerome Bell",
    category: "Furniture",
    excerpt: "The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances.",
    image: "/images/blogs/blog1.avif"
  },
  {
    title: "92% Of Millennial Home Buyers Say Inflation...",
    date: "January 28, 2024",
    author: "Jerome Bell",
    category: "Furniture",
    excerpt: "How inflation is affecting the home buying decisions of millennials across the country.",
    image: "/images/blogs/blog2.webp"
  },
  {
    title: "We Are Hiring Moderately, Says Compass CEO...",
    date: "January 28, 2024",
    author: "Jerome Bell",
    category: "Furniture",
    excerpt: "Compass CEO discusses the company's hiring strategy in the current real estate market.",
    image: "/images/blogs/blog3.jpg"
  }
];

const Blog = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest News</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The Most Recent Real Estate Updates and Articles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 text-sm">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <div className="flex items-center mr-4">
                    <FiCalendar className="mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUser className="mr-1" />
                    <span>{post.author}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <button className="text-primary font-medium">Read More</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;