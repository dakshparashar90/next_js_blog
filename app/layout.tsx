import React from 'react';
import Navbar from '@/app/components/Navbar'; // Navbar component ko import kiya

export const metadata = {
  title: 'Next.js TS Blog Platform',
  description: 'Full-Stack Blog System with TypeScript',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, backgroundColor: '#fafafa', color: '#333' }}>
        {/* Navbar sabse top par render hoga */}
        <Navbar /> 
        
        {/* Baaki saare pages ka content iske neeche aayega */}
        <div style={{ minHeight: 'calc(100vh - 70px)' }}>
          {children}
        </div>
      </body>
    </html>
  );
}