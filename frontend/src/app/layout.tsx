import AppProvider from "@/components/provider";
import { Ubuntu } from "next/font/google";
import type { Metadata } from "next";
import "@/styles/globals.css";

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
          <main className="flex-grow">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
