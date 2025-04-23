import TenantHeader from "@/components/layout/tenantHeader";
import TenantSidebar from "@/components/layout/tenantSidebar";
import ProtectedRoute from "@/components/protected_route";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
      <div
        className={`antialiased`}
      >
    
        {/* <ProtectedRoute> */}
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
        {/* </ProtectedRoute> */}
      </div>
  );
}

