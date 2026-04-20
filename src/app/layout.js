import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import FloatingCart from "@/components/FloatingCart";

export const metadata = {
  title: "SmartBiz Market",
  description: "Your modern supermarket",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <FloatingCart />
        </CartProvider>
      </body>
    </html>
  );
}
