import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalNavigation } from "@/components/organisms/GlobalNavigation";
import { CartProvider } from "@/components/providers/CartProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navbar } from '@/components/organisms/Navbar';
import { CartDrawer } from "@/components/organisms/CartDrawer";
import { ConditionalFooter } from "@/components/organisms/ConditionalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pharmacie des Salines",
  description: "Votre parapharmacie en ligne de confiance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <GlobalNavigation />
                  <CartDrawer />
                  {children}
                  <ConditionalFooter />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}