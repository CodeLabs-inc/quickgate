import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/_context/AuthContext";
import { SocketProvider } from "@/components/_context/SocketContext";
import { CallProvider } from "@/components/_context/CallContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_PLATFORM_NAME,
  description: "Gater - The new solution for seamless parking management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SocketProvider>
            <CallProvider>
              <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: "#333",
                    color: "#fff",
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                  },
                }}
              />
              {children}
            </CallProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
