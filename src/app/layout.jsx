import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gamer text-white antialiased">
        <div className="bg-layer bg-grid" />
        <div className="bg-layer bg-noise" />

        <Navbar />
        <main className="relative z-10 min-h-[calc(100vh-220px)]">{children}</main>
        <Footer />

        <Toaster
          position="top-right"
          richColors
          expand
          theme="dark"
          toastOptions={{
            classNames: {
              toast: 'border border-white/10 bg-white/5 backdrop-blur',
              title: 'text-white',
              description: 'text-white/80',
              actionButton: 'bg-white/10',
              cancelButton: 'bg-white/10',
            },
          }}
        />
      </body>
    </html>
  );
}
