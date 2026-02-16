import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PackStack - Install All Your Apps in One Click',
  description: 'The open-source Ninite alternative for Windows, macOS, and Linux. Select apps, get one command, install everything from official sources.',
  keywords: ['app installer', 'software installer', 'Ninite alternative', 'package manager', 'Windows', 'macOS', 'Linux'],
  authors: [{ name: 'PackStack' }],
  openGraph: {
    title: 'PackStack - Install All Your Apps in One Click',
    description: 'Open-source bulk software installer for Windows, Mac, and Linux',
    type: 'website',
    url: 'https://packstack.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="packstack-theme"
        >
          <TooltipProvider delayDuration={0}>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
