"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiDownload,
  FiHome,
  FiCalendar,
  FiMail,
  FiArrowRight,
  FiStar,
  FiZap,
  FiCornerDownLeft,
} from "react-icons/fi";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { SubscriptionData } from "@/types";

const SubscriptionSuccessPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const { width, height } = useWindowSize();
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);

  const query = useSearchParams();
  const reference = query.get("reference");

  useEffect(() => {
    async function verifyPayment() {
      try {
        if (!reference) {
          setLoading(false);
          return;
        }

        const response = await api.post("/subscriptions/verify-payment", {
          reference,
        });
        const data = response.data.data;

        console.log(data);

        // Transform the API data to match component needs
        const transformedData = {
          plan: data.planDetails.name,
          price: `₦${data.paymentDetails.amountPaid.toLocaleString()}`,
          duration: `${data.planDetails.duration} days`,
          properties: data.planDetails.propertyLimit,
          featured: data.planDetails.featuredListings,
          support: data.planDetails.prioritySupport ? "Priority" : "Standard",
          transactionId: data.paymentDetails.transactionId,
          endDate: new Date(data.endDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          startDate: new Date(data.startDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          autoRenewal: data.autoRenewal,
          status: data.status,
          paymentMethod: data.paymentDetails.paymentMethod,
          paidAt: new Date(data.paymentDetails.paidAt).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          ),
        };

        setSubscriptionData(transformedData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        // Set fallback data or handle error
        setSubscriptionData({
          plan: "Basic Plan",
          price: "₦5,000",
          duration: "30 days",
          properties: 10,
          featured: 1,
          support: "Standard",
          transactionId: "Not Available",
          endDate: "Not Available",
          startDate: "Today",
          autoRenewal: false,
          status: "active",
          paymentMethod: "paystack",
          paidAt: "Today",
        });
      }
    }

    verifyPayment();

    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      clearTimeout(confettiTimer);
    };
  }, [reference]);

  const handleCopyId = () => {
    if (subscriptionData?.transactionId) {
      navigator.clipboard.writeText(subscriptionData.transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPlanIcon = () => {
    if (!subscriptionData) return <FiStar className="text-green-500" />;

    const planName = subscriptionData.plan.toLowerCase();
    if (planName.includes("basic")) {
      return <FiStar className="text-blue-500" />;
    } else if (planName.includes("premium")) {
      return <FiZap className="text-yellow-500" />;
    } else if (planName.includes("enterprise")) {
      return <FiCornerDownLeft className="text-purple-500" />;
    }
    return <FiStar className="text-green-500" />;
  };

  const getPlanDisplayName = () => {
    return subscriptionData?.plan || "Basic Plan";
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  // Show error state if no subscription data
  if (!subscriptionData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Verification Failed
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't verify your payment. Please contact support.
          </p>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
            Contact Support
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            numberOfPieces={200}
            gravity={0.3}
            colors={["#16a34a", "#15803d", "#166534", "#22c55e", "#4ade80"]}
          />
        )}
      </AnimatePresence>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              background: "linear-gradient(45deg, #16a34a, #22c55e)",
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-center relative">
            <div className="absolute top-4 right-4">
              <div className="bg-white/20 p-2 rounded-full">
                <FiHome className="h-5 w-5 text-white" />
              </div>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6"
            >
              <FiCheckCircle className="h-12 w-12 text-green-600" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Subscription Successful!
            </h1>
            <p className="text-green-100 text-lg">
              Welcome to NaijaHomes {getPlanDisplayName()}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Subscription Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  {getPlanIcon()}
                  <span className="ml-2">Subscription Details</span>
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium text-gray-900">
                      {subscriptionData.plan}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-medium text-green-600">
                      {subscriptionData.price}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">
                      {subscriptionData.duration}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Properties Allowed</span>
                    <span className="font-medium text-gray-900">
                      {subscriptionData.properties}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Featured Listings</span>
                    <span className="font-medium text-gray-900">
                      {subscriptionData.featured}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Support</span>
                    <span className="font-medium text-gray-900">
                      {subscriptionData.support}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium text-gray-900">
                      {subscriptionData.startDate}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">End Date</span>
                    <span className="font-medium text-gray-900">
                      {subscriptionData.endDate}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium text-green-600 capitalize">
                      {subscriptionData.status}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <FiCalendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        {subscriptionData.autoRenewal
                          ? "Automatic Renewal"
                          : "Manual Renewal"}
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        {subscriptionData.autoRenewal
                          ? `Your subscription will automatically renew on ${subscriptionData.endDate}`
                          : `Your subscription expires on ${subscriptionData.endDate}. Remember to renew manually.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction & Next Steps */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FiMail className="text-blue-500" />
                  <span className="ml-2">Transaction Information</span>
                </h2>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Transaction ID</span>
                    <button
                      onClick={handleCopyId}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="font-mono text-gray-900 bg-white p-3 rounded border border-gray-200">
                    {subscriptionData.transactionId}
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="capitalize">
                        {subscriptionData.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Date:</span>
                      <span>{subscriptionData.paidAt}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    A receipt has been sent to your email address
                  </p>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FiArrowRight className="text-purple-500" />
                  <span className="ml-2">What's Next?</span>
                </h2>

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-blue-900">
                        Complete Your Profile
                      </h3>
                      <p className="text-blue-700 text-sm mt-1">
                        Add your photo, contact details, and agency information
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start p-4 bg-amber-50 rounded-lg border border-amber-200"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-amber-600 font-bold">2</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-amber-900">
                        List Your First Property
                      </h3>
                      <p className="text-amber-700 text-sm mt-1">
                        Start adding properties to your portfolio (up to{" "}
                        {subscriptionData.properties} properties)
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start p-4 bg-purple-50 rounded-lg border border-purple-200"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-bold">3</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-purple-900">
                        Get Verified
                      </h3>
                      <p className="text-purple-700 text-sm mt-1">
                        Become a verified agent for more credibility
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    Go to Dashboard
                    <FiArrowRight className="ml-2" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 border border-green-600 text-green-600 py-3 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center"
                  >
                    <FiDownload className="mr-2" />
                    Download Invoice
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@naijahomes.ng"
                className="text-green-600 hover:underline"
              >
                support@naijahomes.ng
              </a>{" "}
              or call{" "}
              <a
                href="tel:+2348001234567"
                className="text-green-600 hover:underline"
              >
                +234 800 123 4567
              </a>
            </p>
          </div>
        </motion.div>

        {/* Celebration Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-600">
            Thank you for choosing NaijaHomes! 🎉 Your Nigerian real estate
            journey begins now.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;
