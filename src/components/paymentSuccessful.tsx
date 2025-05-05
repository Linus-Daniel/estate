// components/PaymentSuccessAnimation.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Lottie from 'lottie-react'
import animationData from '../../public/animations/success-animation.json' // Your Lottie JSON file

export default function PaymentSuccessAnimation() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/user/rented-property')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="max-w-md mx-auto">
        <Lottie 
          animationData={animationData} 
          loop={false} 
          style={{ height: 200 }} 
        />
        <h2 className="mt-6 text-2xl font-bold">Payment Successful!</h2>
        <p className="mt-2 text-gray-600">
          Your payment has been processed successfully. Redirecting to your rented properties...
        </p>
      </div>
    </div>
  )
}