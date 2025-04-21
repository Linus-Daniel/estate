import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import Header from "@/components/header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
      <div
        className={`antialiased`}
      >
      <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen">
      <Header />
        {children}
      </main>
    </SidebarProvider>
      </div>
  );
}
