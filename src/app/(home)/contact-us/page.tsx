"use client";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheckCircle,
  FiMessageSquare,
  FiClock,
} from "react-icons/fi";
import { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 mb-4"
          >
            <FiMessageSquare className="mr-2" />
            <span className="text-sm font-medium">Get In Touch</span>
          </motion.div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Contact NaijaHomes
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Have questions about finding your dream home in Nigeria? Our team is
            here to help you every step of the way.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Our Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <FiMail className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Email Us
                    </h3>
                    <p className="text-gray-600">info@naijahomes.ng</p>
                    <p className="text-gray-600">support@naijahomes.ng</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <FiPhone className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Call Us
                    </h3>
                    <p className="text-gray-600">+234 (0) 812 345 6789</p>
                    <p className="text-gray-600">+234 (0) 908 765 4321</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <FiClock className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Business Hours
                    </h3>
                    <p className="text-gray-600">Monday - Friday: 8am - 6pm</p>
                    <p className="text-gray-600">Saturday: 10am - 4pm</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <FiMapPin className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Visit Our Offices
                    </h3>
                    <p className="text-gray-600">
                      24A Adeola Odeku Street, Victoria Island, Lagos
                    </p>
                    <p className="text-gray-600">
                      12 Aminu Kano Crescent, Wuse 2, Abuja
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="h-64 w-full bg-gray-200 rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Replace with your actual map component */}
              <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
                <FiMapPin className="h-12 w-12 mb-3" />
                <p className="text-center font-medium">
                  Interactive Map of Our Locations
                </p>
                <p className="text-sm text-green-100 mt-2 text-center">
                  Lagos • Abuja • Port Harcourt
                </p>
              </div>
            </motion.div>

            <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">
                Why Choose NaijaHomes?
              </h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Verified properties across Nigeria</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Local expertise in Nigerian real estate</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Secure and transparent transactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Dedicated customer support</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Send Us a Message
            </h2>
            <p className="text-gray-600 mb-6">
              Fill out the form below and we'll get back to you within 24 hours
            </p>

            {isSuccess && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl flex items-start border border-green-200"
              >
                <FiCheckCircle className="text-green-500 text-xl mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Thank you for your message!</h3>
                  <p className="text-sm mt-1">
                    We've received your inquiry and will contact you shortly.
                  </p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ y: -5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ y: -5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="+234 800 123 4567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.subject ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a subject</option>
                    <option value="property-inquiry">Property Inquiry</option>
                    <option value="listing-property">List My Property</option>
                    <option value="general-question">General Question</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && (
                    <motion.p
                      initial={{ y: -5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.subject}
                    </motion.p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Tell us how we can help you..."
                />
                {errors.message && (
                  <motion.p
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.message}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-70 font-medium shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </div>
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                We value your privacy and promise to keep your information
                secure. By submitting this form, you agree to our{" "}
                <a href="/privacy" className="text-green-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
