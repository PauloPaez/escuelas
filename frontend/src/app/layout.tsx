import AppProvider from "@/components/provider";
import { Ubuntu } from "next/font/google";
import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"],
});


export const metadata: Metadata = {
  title: {
    default: "Sistema de escuelas",
    template: `%s - Sistema de escuelas`,
  },
  description: "Sistema de escuelas",
  keywords: ["sistema", "escuelas"],
  icons: {
    icon: "/logo-san-juan.svg",
    apple: "/logo-san-juan.svg",
  },
  creator: "Juan Morales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${ubuntu.variable} antialiased flex flex-col min-h-screen`}
      >
        <AppProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
