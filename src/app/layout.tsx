import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { AuthProvider } from '@/contexts/AuthContext';
import { TeamProvider } from '@/contexts/TeamContext';
import { SyncProvider } from '@/contexts/SyncContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SyncFloatingIndicator } from '@/components/sync/SyncStatus';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TRAQ - Tree Risk Assessment',
  description: 'Tree Risk Assessment Qualified (TRAQ) form application based on ISA standards',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TRAQ',
  },
};

export const viewport: Viewport = {
  themeColor: '#B4975A', // VGK Gold
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider>
          <AuthProvider>
            <TeamProvider>
              <SyncProvider>
                <Header />
                <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
                <SyncFloatingIndicator />
              </SyncProvider>
            </TeamProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
