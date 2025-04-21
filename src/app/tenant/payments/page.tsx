// app/tenant/pay/page.tsx
'use client'

import { useState } from 'react'
import { DollarSign, CreditCard, Banknote, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState('credit')
  const [amount, setAmount] = useState(1200)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="mt-3 text-xl font-semibold">Payment Successful</h2>
        <p className="mt-2 text-gray-600">
          Your payment of ${amount} has been processed successfully.
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
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
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

            {paymentMethod === 'credit' && (
              <div className="mb-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${amount}`}
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
              <span>${amount}</span>
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