import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Calma — Aprende inglés con calma',
  description:
    'Aplicación de aprendizaje de inglés diseñada para niños con TDAH. Bajo estímulo visual, micro-lecciones y andamiaje cognitivo.',
  applicationName: 'Calma',
  authors: [{ name: 'Calma' }],
  keywords: ['inglés', 'TDAH', 'aprendizaje', 'MCER', 'neuroinclusivo'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F5F1E8',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-contrast="soft" data-reduce-motion="false">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
