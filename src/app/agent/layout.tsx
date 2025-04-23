import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import Header from "@/components/header";
import ProtectedRoute from "@/components/protected_route";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`antialiased`}>
      <ProtectedRoute>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full h-screen">
            <Header />
            {children}
          </main>
        </SidebarProvider>
      </ProtectedRoute>
    </div>
  );
}
