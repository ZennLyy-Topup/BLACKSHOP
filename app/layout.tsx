import "./globals.css";
import { SessionProviderWrapper } from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import CartProvider from "@/components/CartProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NexusStore -- Premium Gear & Cards",
  description: "Premium hardware and digital cards. Pay with Visa, PayPal or Crypto.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <CartProvider>
            <Navbar />
            <div className="min-h-[calc(100vh-4rem)]">{children}</div>
            <Footer />
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}