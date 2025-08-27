"use client";
import {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Define types for the rental flow
interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  // Add other property fields as needed
}

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  // Add other user fields as needed
}

interface BookingDetails {
  startDate?: string;
  endDate?: string;
  duration?: number;
  totalPrice?: number;
  // Add other booking fields as needed
}

interface PaymentIntent {
  id: string;
  amount: number;
  status: string;
  // Add other payment intent fields as needed
}

type RentalStep =
  | "browsing"
  | "property_details"
  | "contact_agent"
  | "schedule_viewing"
  | "application_form"
  | "review_application"
  | "payment"
  | "confirmation";

interface RentalFlowContextType {
  currentStep: RentalStep;
  setCurrentStep: (step: RentalStep) => void;
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  userData: UserData;
  setUserData: (userData: UserData) => void;
  bookingDetails: BookingDetails;
  setBookingDetails: (details: BookingDetails) => void;
  paymentIntent: PaymentIntent | null;
  setPaymentIntent: (intent: PaymentIntent | null) => void;
}

// Create a rental flow context
const RentalFlowContext = createContext<RentalFlowContextType | null>(null);

export const useRentalFlow = (): RentalFlowContextType => {
  const context = useContext(RentalFlowContext);
  if (!context) {
    throw new Error("useRentalFlow must be used within a RentalFlowProvider");
  }
  return context;
};

interface RentalFlowProviderProps {
  children: ReactNode;
}

export const RentalFlowProvider = ({ children }: RentalFlowProviderProps) => {
  const [currentStep, setCurrentStep] = useState<RentalStep>("browsing");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [userData, setUserData] = useState<UserData>({});
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({});
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null
  );

  const value: RentalFlowContextType = {
    currentStep,
    setCurrentStep,
    selectedProperty,
    setSelectedProperty,
    userData,
    setUserData,
    bookingDetails,
    setBookingDetails,
    paymentIntent,
    setPaymentIntent,
  };

  return (
    <RentalFlowContext.Provider value={value}>
      {children}
    </RentalFlowContext.Provider>
  );
};

// Steps in the rental flow
const RENTAL_STEPS = {
  BROWSING: "browsing",
  PROPERTY_DETAILS: "property_details",
  CONTACT_AGENT: "contact_agent",
  SCHEDULE_VIEWING: "schedule_viewing",
  APPLICATION_FORM: "application_form",
  REVIEW_APPLICATION: "review_application",
  PAYMENT: "payment",
  CONFIRMATION: "confirmation",
} as const;

export { RENTAL_STEPS };
