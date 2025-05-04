// app/tenant/pay/page.tsx
'use client'

import { useState } from 'react'
import { DollarSign, CreditCard, Banknote, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePaystackPayment } from 'react-paystack'
import { useAuth } from '@/context/auth_context'

interface PaystackConfig {
  reference: string
  email: string
  amount: number
  publicKey: string
  currency: string
}

export default function PaymentPage() {

  const {user} = useAuth()
  const [paymentMethod, setPaymentMethod] = useState('credit')
  const [amount, setAmount] = useState(120000) // Paystack uses amount in kobo (multiply by 100)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState<string>(user?.email as string) // You might want to get this from user or auth context


  // Generate a unique reference for each transaction
  const generateReference = () => {
    return `ref_${Math.floor(Math.random() * 1000000000 + 1)}`
  }

  const config: PaystackConfig = {
    reference: generateReference(),
    email: email,
    amount: amount,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key',
    currency: 'NGN' // Change to your currency
  }

  const initializePayment = usePaystackPayment(config)

  const onSuccess = (reference: any) => {
    setIsProcessing(false)
    setIsSuccess(true)
    // You can verify the payment here with your backend
    console.log('Payment successful:', reference)
  }

  const onClose = () => {
    setIsProcessing(false)
    console.log('Payment closed')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    if (paymentMethod === 'credit') {
      // Initialize Paystack payment
      initializePayment({onSuccess,onClose})
    } else {
      // For bank transfer, you might want to handle differently
      // This is just a simulation
      setTimeout(() => {
        setIsProcessing(false)
        setIsSuccess(true)
      }, 2000)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="mt-3 text-xl font-semibold">Payment Successful</h2>
        <p className="mt-2 text-gray-600">
          Your payment of ${amount / 100} has been processed successfully.
        </p>
        <Button className="mt-5" onClick={() => setIsSuccess(false)}>
          Make Another Payment
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Make a Payment</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={amount / 100}
                  onChange={(e) => setAmount(Number(e.target.value) * 100)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md"
                  placeholder="0.00"
                  min="1"
                />
              </div>
            </div>

            <div className="mb-6">
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

            <div className="mb-6">
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
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                <p>For bank transfers, please use the account details below:</p>
                <div className="mt-2 space-y-1">
                  <p><strong>Bank Name:</strong> Example Bank</p>
                  <p><strong>Account Name:</strong> Your Company Name</p>
                  <p><strong>Account Number:</strong> 1234567890</p>
                </div>
                <p className="mt-2">After payment, please send your proof of payment to payments@example.com</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isProcessing || amount <= 0}
            >
              {isProcessing ? 'Processing...' : `Pay $${amount / 100}`}
            </Button>
          </form>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Rent for November 2023</span>
              <span>$1,100.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Parking Fee</span>
              <span>$100.00</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
              <span>Total Due</span>
              <span>${amount / 100}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Payment History</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>October 2023</span>
                <span className="text-green-600">Paid</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>September 2023</span>
                <span className="text-green-600">Paid</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>August 2023</span>
                <span className="text-green-600">Paid</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}