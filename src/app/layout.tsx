import type { Metadata, Viewport } from 'next';
import { Atkinson_Hyperlegible, Fraunces } from 'next/font/google';
import './globals.css';

const atkinson = Atkinson_Hyperlegible({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-atkinson',
});

const fraunces = Fraunces({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
});

export const metadata: Metadata = {
  title: 'Calma — Aprende inglés con calma',
  description:
    'Aplicación de aprendizaje de inglés diseñada para niños con TDAH. Bajo estímulo visual, micro-lecciones y andamiaje cognitivo.',
  applicationName: 'Calma',
  authors: [{ name: 'Calma' }],
  keywords: ['inglés', 'TDAH', 'aprendizaje', 'MCER', 'neuroinclusivo'],
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: 'Calma — Aprende inglés con calma',
    description:
      'Aplicación de bajo estímulo para niños con TDAH. Aprende inglés a tu propio ritmo.',
    images: ['/logo.jpg'],
    locale: 'es_CO',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F8F4EA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      data-contrast="soft"
      data-reduce-motion="false"
      className={`${atkinson.variable} ${fraunces.variable}`}
    >
      <body className="bg-bg-primary text-text-primary antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
