// app/tenant/pay/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { DollarSign, CreditCard, Banknote, Check, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { usePaystackPayment } from 'react-paystack'
import { useAuth } from '@/context/auth_context'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Property } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api, { getCsrfToken, handlePayment } from '@/lib/api'
import { useProperty } from '@/context/PropertyContext'

interface PaystackConfig {
  reference: string
  email: string
  amount: number
  publicKey: string
  currency: string
  metadata?: {
    [key: string]: any
  }
}


// Update the imports at the top of your page.tsx

// Add this after your imports (lazy load the animation to reduce bundle size)

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('propertyId')

  const trxref = searchParams.get('trxref');
  const reference = searchParams.get('reference');
  const {params} = useParams()
  // const { trxref, reference ;


  console.log(reference,trxref)
  
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState('credit')
  const [amount, setAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState<string>(user?.email || '')
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVerifying,setIsVerifying] = useState<Boolean>(false)
  const [paymentDescription, setPaymentDescription] = useState('Rent Payment')
  const {fetchPropertyById} = useProperty()





  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      setIsVerifying(true)
      try {
        // Replace with your actual API call
        const response = await fetchPropertyById("6817bdac1f573ae021ef18bd") as Property
        setProperty(response)
        console.log(response)
      } catch (error) {
        console.error('Error fetching property:', error)
        toast.error('Failed to load property details')
      } finally {
        setLoading(false)
        setIsVerifying(false)
      }
    }
    fetchProperty()
  }, [propertyId, router])
  useEffect(() => {
    const verifyPayment = async () => {
      if (reference) {
        try {
          const verifyRes = await api.get(`/payments/verify/${reference}`, {
            headers: {
              "x-csrf-token": await getCsrfToken()
            },
            withCredentials: true
          });
          
          const paymentStatus = verifyRes.data.data.status;
          console.log(paymentStatus)
          if (paymentStatus === 'completed') {
            setIsSuccess(true);
            toast.success('Payment verified successfully!');
          } else {
            toast.error('Payment verification failed');
          }
        } catch (error) {
          toast.error('Error verifying payment');
        }
      }
      setLoading(false);
    };
  
    if (trxref || reference) {
      verifyPayment();
    }
  }, [trxref, reference]);

  const PaymentSuccessAnimation = dynamic(
    () => import('@/components/paymentSuccessful'),
    { ssr: false }
  )
  
  // In your component, replace the isSuccess return with:
  if (isSuccess) {
    return <PaymentSuccessAnimation />
  }
  


  // Generate a unique reference for each transaction
  const generateReference = () => {
    return `ref_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  }

  const config: PaystackConfig = {
    reference: generateReference(),
    email: email,
    amount: amount,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key',
    currency: 'NGN', // Change to your currency
    metadata: {
      property_id: propertyId,
      user_id: user?._id,
      description: paymentDescription,
      custom_fields: [
        {
          display_name: "Paid By",
          variable_name: "paid_by",
          value: user?.name || ''
        }
      ]
    }
  }


  const onClose = () => {
    setIsProcessing(false)
    console.log('Payment closed')
  }

  const recordPayment = async (reference: string) => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          amount: amount / 100,
          reference,
          paymentMethod,
          description: paymentDescription
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to record payment')
      }
    } catch (error) {
      console.error('Error recording payment:', error)
    }
  }

  const handleSubmit = () =>{
    const token = localStorage.getItem("token") as string
    const data = {
      propertyId:property?._id as string,
      email:user?.email as string,
      token
    }

     handlePayment(data)

  }



  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="mt-3 text-xl font-semibold">Payment Successful</h2>
        <p className="mt-2 text-gray-600">
          Your payment of ${(amount / 100).toLocaleString()} for {property?.title} has been processed.
        </p>
        <div className="mt-4 space-y-2 text-sm">
          <p>Reference: {config.reference}</p>
          <p>Property: {property?.title}</p>
        </div>
        <div className="mt-6 flex gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href={`/user/properties/${propertyId}`}>
              View Property
            </Link>
          </Button>
          <Button onClick={() => setIsSuccess(false)}>
            Make Another Payment
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }


  
  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Property Not Found</h2>
        <p className="mt-2 text-gray-600">The property you're trying to pay for doesn't exist.</p>
        <Button className="mt-4" asChild>
          <Link href="/user/properties">
            Browse Properties
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Make Payment</h1>
        <Badge variant="outline" className="px-4 py-1">
          {property?.type}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                {property?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p>{property?.location?.formattedAddress}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Monthly Rent</p>
                  <p className="font-medium">${property?.price?.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>



{isVerifying && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg">
      <p>Verifying payment...</p>
    </div>
  </div>
)}

          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form  className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Description
                  </label>
                  <select
                    value={paymentDescription}
                    onChange={(e) => setPaymentDescription(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Rent Payment">Rent Payment</option>
                    <option value="Security Deposit">Security Deposit</option>
                    <option value="Utility Bill">Utility Bill</option>
                    <option value="Maintenance Fee">Maintenance Fee</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Amount ($)
                  </label>
                  <input
                    type="number"
                    value={amount / 100}
                    onChange={(e) => setAmount(Number(e.target.value) * 100)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit')}
                      className={`p-4 border rounded-lg flex items-center ${
                        paymentMethod === 'credit' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard className="h-5 w-5 mr-3" />
                      <span>Credit/Debit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-4 border rounded-lg flex items-center ${
                        paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Banknote className="h-5 w-5 mr-3" />
                      <span>Bank Transfer</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'bank' && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                    <p>For bank transfers, please use the account details below:</p>
                    <div className="mt-2 space-y-1">
                      <p><strong>Bank Name:</strong> Property Management Bank</p>
                      <p><strong>Account Name:</strong> RentEase Properties</p>
                      <p><strong>Account Number:</strong> 1234567890</p>
                    </div>
                    <p className="mt-2">Include your name and property address as reference</p>
                  </div>
                )}

                <Button
                  type="button"
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isProcessing || amount <= 0}
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      Processing Payment...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Pay ${(amount / 100).toLocaleString()}
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Rent</span>
                  <span>${property?.price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span>${(amount / 100).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            {/* <CardContent className="space-y-3">
              {property.paymentHistory?.length > 0 ? (
                property.paymentHistory.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{payment.month}</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </div>
                    <Badge variant="outline" className="px-2">
                      Paid
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No payment history found</p>
              )}
            </CardContent> */}
          </Card>
        </div>
      </div>
    </div>
  )
}