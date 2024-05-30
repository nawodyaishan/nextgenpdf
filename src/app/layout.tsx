import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopNav from '@/components/TopNav';
import { auth } from '@clerk/nextjs/server';
import FooterNavigation from '@/components/FooterNavigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextGenPDF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex min-h-screen flex-col">
            <TopNav userId={userId} isUserSignedIn={!!userId} />
            <main className="flex-1">{children}</main>
            <FooterNavigation />
          </div>
          <ToastContainer />
        </body>
      </html>
    </ClerkProvider>
  );
}
