
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from '@/components/footer';
import SessionWrapper from '@/components/sessionWrapper';
import { Toaster } from '@/components/ui/toaster';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'UNI-ED - AI Study Assistant',
  description: 'Your all-in-one AI-driven study assistant designed to simplify learning, improve retention, and keep you organized.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionWrapper>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col">
              <Navbar />
              <main className="min-h-screen pt-16">{children}</main>
              <Toaster />
              <Footer />
            </div>
          </ThemeProvider>
        </body>
      </SessionWrapper>
    </html>
  );
}