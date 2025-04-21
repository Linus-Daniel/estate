// app/tenant/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import TenantSidebar from '@/components/layout/tenantSidebar'
import TenantHeader from '@/components/layout/tenantHeader'
// import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tenant Portal | PropertyPro',
  description: 'Tenant self-service portal',
}

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <div className="flex h-screen overflow-hidden">
          {/* Tenant-specific sidebar */}
          <TenantSidebar />
          
          {/* Main content area */}
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Tenant header */}
            <TenantHeader />
            
            {/* Main content */}
            <main className="flex-1 p-4 md:p-6 bg-white rounded-lg shadow-sm">
              {children}
            </main>
          </div>
        </div>
        
        {/* Toast notifications */}
        {/* <Toaster /> */}
      </body>
    </html>
  )
}