'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from '@/context/AuthContext';
import theme from '@/styles/theme';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 