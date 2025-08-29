export interface Details {

    icon:string | any;
    value:number
    title:string;
    color:string;



}

export interface RoomData {
    title:string;
    price:number;
    owner:string;
    roomd:number;
    description:string;
    

}




export type UserRole = "admin" | "agent" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}



export interface Property {
    _id: string;
    title: string;
    price: number;
    location?:{
        formattedAddress:string
    }
    description:string;
   address:string;
    bedrooms: number;
    bathrooms: number;
    status:string;
    images: [{
        url:string;
        public_id:string
    }];
    type:string
    amenities:[string];
    area:number
  }


export interface PaymentPropsTypes {
    token:string;
    email:string;
    propertyId:string
}




export type Message = {
    _id: string;
    chat: string;
    sender: {
      _id: string;
      name: string;
      avatar?: string;
    };
    content: string;
    read: boolean;
    readAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    chatId:string;
    status:string;
  };
  
 export  type TypingEvent = {
    chatId: string;
    userId: string;
  };
  
 export  type SendMessageCallback = (response: {
    status: 'success' | 'error';
    message?: Message;
    error?: string;
  }) => void;


  
  export interface Transaction {
    _id: string;
    user: string;
    property: Property | string;
    amount: number;
    status: "pending" | "completed" | "failed";
    transactionId: string;
    paymentMethod: string;
    createdAt: string;
    __v: number;
  }

  export interface ChatInfo {
    _id: string;
    participants: {
      _id: string;
      name: string;
      photo?: string;
    }[];
    property?: {
      _id: string;
      title: string;
      images: { url: string }[];
    };
  }


  // Base subscription plan details
export interface PlanDetails {
  name: string;
  price: number;
  duration: number; // in days
  propertyLimit: number;
  featuredListings: number;
  prioritySupport: boolean;
}

// Payment information
export interface PaymentDetails {
  amountPaid: number;
  paidAt: string; // ISO date string
  paymentMethod: 'paystack' | 'flutterwave' | 'bank_transfer' | string;
  transactionId: string;
}

// Main subscription object from API
export interface SubscriptionResponse {
  _id: string;
  agent: string; // Agent ID
  plan: 'basic' | 'premium' | 'enterprise' | string;
  planDetails: PlanDetails;
  paymentDetails: PaymentDetails;
  autoRenewal: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  featuredListingsUsed: number;
  propertiesPosted: number;
  __v: number;
}

// Transformed subscription data for UI display
export interface SubscriptionData {
  plan: string;
  price: string; // Formatted with currency
  duration: string; // e.g., "30 days"
  properties: number;
  featured: number;
  support: string;
  transactionId: string;
  endDate: string; // Formatted date
  startDate: string; // Formatted date
  autoRenewal: boolean;
  status: string;
  paymentMethod: string;
  paidAt: string; // Formatted date
}

// API Response wrapper
export interface SubscriptionApiResponse {
  success: boolean;
  message: string;
  data: SubscriptionResponse;
}

// Payment verification request
export interface PaymentVerificationRequest {
  reference: string;
}

// Payment verification response
export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data: SubscriptionResponse;
}

// Plan types enum for better type safety
export enum PlanType {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

// Subscription status enum
export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PENDING = 'pending'
}

// Payment method enum
export enum PaymentMethod {
  PAYSTACK = 'paystack',
  FLUTTERWAVE = 'flutterwave',
  BANK_TRANSFER = 'bank_transfer'
}

// Component props type
export interface SubscriptionSuccessPageProps {
  reference?: string;
}

// Hook return type for subscription data
export interface UseSubscriptionData {
  // subscriptionData: TransformedSubscriptionData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Utility type for creating new subscriptions
export interface CreateSubscriptionPayload {
  agentId: string;
  planType: PlanType;
  paymentReference: string;
  autoRenewal?: boolean;
}

// Subscription update payload
export interface UpdateSubscriptionPayload {
  subscriptionId: string;
  autoRenewal?: boolean;
  status?: SubscriptionStatus;
}

// Subscription analytics/stats
export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  totalRevenue: number;
  monthlyRevenue: number;
}