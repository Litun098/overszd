import { Space_Grotesk, Archivo } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "OVRSZD — Premium Oversized Streetwear",
  description: "Elevating streetwear for the next generation. Heavyweight oversized fits, premium fabric, limited drops.",
  metadataBase: new URL("https://ovrszd.store"),
  openGraph: {
    title: "OVRSZD — Premium Oversized Streetwear",
    description: "Heavyweight oversized fits, premium fabric, limited drops.",
    url: "https://ovrszd.store",
    siteName: "OVRSZD",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${archivo.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <CartProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
