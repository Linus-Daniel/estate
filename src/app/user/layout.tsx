import TenantHeader from "@/components/layout/AccountHeader";
import UserSidebar from "@/components/layout/tenantSidebar";
import ProtectedRoute from "@/components/protected_route";
import { AuthProvider } from "@/context/auth_context";
import "../globals.css";
import { PropertyProvider } from "@/context/PropertyContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <div className={`antialiased`}>
          <AuthProvider>
            <PropertyProvider>
              <ProtectedRoute requiredRole="user">
                <div className="flex h-screen overflow-hidden">
                  <UserSidebar />
                  <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    {/* Tenant header */}
                    <TenantHeader />
                    <main className="flex-1 p-4 md:p-6 bg-white rounded-lg shadow-sm">
                      {children}
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            </PropertyProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
