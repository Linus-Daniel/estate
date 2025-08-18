import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth_context";
import Header from "@/components/sections/header";
import { PropertyProvider } from "@/context/PropertyContext";
import { SocketProvider } from "@/context/socketContext";



export const metadata: Metadata = {
  title: "Linux Homes",
  description: "Buy, Sell and Rent your House",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <AuthProvider>
          <SocketProvider>
            <PropertyProvider>
              {/* <Header /> */}
              <main className="">{children}</main>
            </PropertyProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
