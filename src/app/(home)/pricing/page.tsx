"use client";
import { JSX, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiStar,
  FiZap,
  FiCheckCircle,
  FiHelpCircle,
  FiCornerDownLeft,
} from "react-icons/fi";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

// Define types
type PlanKey = "basic" | "premium" | "enterprise";
type BillingPeriod = "monthly" | "yearly";

interface SubscriptionPlan {
  name: string;
  price: number;
  duration: number;
  propertyLimit: number;
  featuredListings: number;
  prioritySupport: boolean;
  description: string;
  popular: boolean;
  icon: JSX.Element;
}

interface FAQ {
  question: string;
  answer: string;
}

const SubscriptionPricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("premium");
  const [paying, setPaying] = useState<boolean>(false);

  useEffect(() => {
    const getPlans = async (): Promise<void> => {
      try {
        const response = await api.get("/subscriptions/plans");
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    getPlans();
  }, []);

  // Subscription plans data from your schema
  const subscriptionPlans: Record<PlanKey, SubscriptionPlan> = {
    basic: {
      name: "Basic Plan",
      price: 5000, // in NGN
      duration: 30, // days
      propertyLimit: 10,
      featuredListings: 1,
      prioritySupport: false,
      description: "Perfect for new agents starting out",
      popular: false,
      icon: <FiStar className="text-blue-500" />,
    },
    premium: {
      name: "Premium Plan",
      price: 15000,
      duration: 30,
      propertyLimit: 50,
      featuredListings: 5,
      prioritySupport: true,
      description: "Ideal for growing real estate professionals",
      popular: true,
      icon: <FiZap className="text-yellow-500" />,
    },
    enterprise: {
      name: "Enterprise Plan",
      price: 30000,
      duration: 30,
      propertyLimit: 200,
      featuredListings: 20,
      prioritySupport: true,
      description: "For established agencies with high volume",
      popular: false,
      icon: <FiCornerDownLeft className="text-purple-500" />,
    },
  };

  // Calculate annual pricing (20% discount)
  const getPrice = (planKey: PlanKey): number => {
    const basePrice = subscriptionPlans[planKey].price;
    return billingPeriod === "yearly" ? basePrice * 12 * 0.8 : basePrice;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubscribe = async (planType: PlanKey): Promise<void> => {
    try {
      setPaying(true);
      const response = await api.post("/subscriptions/subscribe", {
        planType,
      });

      const data = response.data.data;
      const authorizationUrl: string = data.authorizationUrl;
      window.location.href = authorizationUrl;
      setPaying(false);
    } catch (error) {
      console.log(error);
      setPaying(false);
    }
  };

  const faqs: FAQ[] = [
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade your plan at any time. Downgrades will take effect at the end of your billing cycle.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept bank transfers, credit/debit cards, and popular Nigerian payment methods like Flutterwave and Paystack.",
    },
    {
      question: "How do featured listings work?",
      answer:
        "Featured listings appear at the top of search results and get 3x more views than regular listings.",
    },
    {
      question: "Is there a setup fee?",
      answer:
        "No, there are no setup fees or hidden charges. You only pay the subscription fee.",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect subscription for your real estate business. All
            plans include our premium property listing features.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-10"
        >
          <div className="bg-gray-100 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-md font-medium text-sm ${
                billingPeriod === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2 rounded-md font-medium text-sm ${
                billingPeriod === "yearly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly <span className="text-green-600 ml-1">(20% off)</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {(
            Object.entries(subscriptionPlans) as [PlanKey, SubscriptionPlan][]
          ).map(([planKey, plan], index) => (
            <motion.div
              key={planKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-xl shadow-lg border ${
                plan.popular
                  ? "border-green-500 ring-2 ring-green-500/20 transform md:scale-105"
                  : "border-gray-200"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Plan Icon & Name */}
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(getPrice(planKey))}
                    </span>
                    <span className="text-gray-500 ml-2">
                      /{billingPeriod === "yearly" ? "year" : "month"}
                    </span>
                  </div>
                  {billingPeriod === "yearly" && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formatPrice(plan.price)} per month
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>
                      <strong>{plan.propertyLimit}</strong> Property Listings
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>
                      <strong>{plan.featuredListings}</strong> Featured Listings
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>{plan.duration} Days Duration</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>
                      {plan.prioritySupport ? "Priority" : "Standard"} Support
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>Agent Profile Page</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span>Mobile App Access</span>
                  </li>
                </ul>

                {/* Select Button */}
                <button
                  onClick={() => handleSubscribe(planKey)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  {paying ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "Select Plan"
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start">
                  <FiHelpCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Need help choosing the right plan?
          </p>
          <button className="inline-flex items-center text-green-600 font-medium hover:text-green-700">
            Contact our sales team
            <FiHelpCircle className="ml-2" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default SubscriptionPricing;
