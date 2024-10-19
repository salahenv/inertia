"use client";
import { AppDataProvider } from "@/shared/hooks/AppDataProvider";
import { StoreProvider } from "@/shared/hooks/useStore";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
            <AppDataProvider>
                {children}
            </AppDataProvider>
        </StoreProvider>
      </body>
    </html>
  );
}