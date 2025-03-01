import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "QuickGate",
  description: "El futuro de los parqueos intelligentes",
  keywords: [
    "QuickGate",
    "QuickGate RD",
    "QuickGate Santo Domingo",
    "QuickGate Parqueos",
    "QuickGate Parqueos RD",
    "QuickGate Parqueos Santo Domingo",

    "Parqueos Santo Domingo",
    "Parqueos inteligentes",
    "Parqueos RD",
    "Parqueos",

    "Estacionamientos Santo Domingo",
    "Estacionamientos RD",
    "Estacionamientos inteligentes",

    "Blue Mall",
    "Agora Mall",
    "Sambil",
    "Acrópolis",
    "Plaza Lama",
    "Plaza Central",
    "Plaza Duarte",
    "Plaza Naco",
    "Plaza Las Americas",
    "Plaza Lama",
    "Galería 360",
    "Casa Cuesta",
    "Novo Centro",
    "Nacional Santo Domingo",
    "Carrefour Santo Domingo",
    "Jumbo Santo Domingo",
    "La Sirena Santo Domingo",
    "Supermercados Nacional",
    "Las Americas",
    "Systema para parqueos RD",
  ],
  openGraph: {
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: "/icon.png",
  },
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/x-icon",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
