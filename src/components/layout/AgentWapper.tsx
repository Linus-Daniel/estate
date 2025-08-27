import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import Header from "@/components/header";
import ProtectedRoute from "@/components/protected_route";
import { AuthProvider } from "@/context/auth_context";

export default function AgentWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`antialiased`}>
        <AuthProvider>
      <ProtectedRoute requiredRole="agent">
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full h-screen">
              <Header />
              {children}
            </main>
          </SidebarProvider>
      </ProtectedRoute>
        </AuthProvider>
    </div>
  );
}
