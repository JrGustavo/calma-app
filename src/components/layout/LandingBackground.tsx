'use client';

import { useEffect, useState } from 'react';
import { usePreferences } from '@/stores/preferences';

/**
 * Ilustración decorativa de fondo para la landing — versión premium.
 * Capas: sol suave, nubes, montañas, colinas, hojas, flores, partículas.
 */
export function LandingBackground() {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = usePreferences((s) => s.reduceMotion);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Durante SSR no animar para evitar errores de hidratación
  const shouldAnimate = mounted && !reduceMotion;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Sol suave arriba derecha */}
      <div
        className={`absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-40 ${
          shouldAnimate ? 'animate-soft-float' : ''
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(244, 220, 175, 0.6) 0%, rgba(244, 220, 175, 0) 70%)',
        }}
      />

      {/* Halo decorativo abajo izquierda */}
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(159, 180, 140, 0.5) 0%, rgba(159, 180, 140, 0) 70%)',
        }}
      />

      {/* Nubes suaves arriba */}
      <svg
        className={`absolute top-0 left-0 w-full h-auto opacity-70 ${
          shouldAnimate ? 'animate-cloud-drift' : ''
        }`}
        viewBox="0 0 1200 220"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="cloud1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="180" cy="80" rx="130" ry="38" fill="url(#cloud1)" />
        <ellipse cx="700" cy="50" rx="110" ry="30" fill="url(#cloud1)" />
        <ellipse cx="1050" cy="100" rx="150" ry="42" fill="url(#cloud1)" />
        <ellipse cx="450" cy="160" rx="100" ry="28" fill="url(#cloud1)" />
        <ellipse cx="900" cy="180" rx="120" ry="32" fill="url(#cloud1)" />
      </svg>

      {/* Montañas lejanas */}
      <svg
        className="absolute bottom-1/3 left-0 w-full h-auto opacity-25"
        viewBox="0 0 1200 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,320 L0,180 Q200,100 400,140 T800,120 T1200,150 L1200,320 Z"
          fill="#A8B89C"
        />
      </svg>

      {/* Montañas medias */}
      <svg
        className="absolute bottom-1/4 left-0 w-full h-auto opacity-35"
        viewBox="0 0 1200 280"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,280 L0,200 Q150,140 350,170 T700,160 T1050,180 T1200,190 L1200,280 Z"
          fill="#8FA67F"
        />
      </svg>

      {/* Colinas en primer plano */}
      <svg
        className="absolute bottom-0 left-0 w-full h-auto opacity-55"
        viewBox="0 0 1200 220"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hill1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9FB48C" />
            <stop offset="100%" stopColor="#7A9B6E" />
          </linearGradient>
        </defs>
        <path
          d="M0,220 L0,80 Q300,20 600,60 T1200,40 L1200,220 Z"
          fill="url(#hill1)"
        />
      </svg>

      {/* Hoja monstera grande izquierda */}
      <svg
        className={`absolute -left-4 top-1/3 w-40 sm:w-56 opacity-60 ${
          shouldAnimate ? 'animate-leaf-sway' : ''
        }`}
        viewBox="0 0 100 120"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transformOrigin: 'top left' }}
      >
        <defs>
          <linearGradient id="leaf1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9FB48C" />
            <stop offset="100%" stopColor="#6B8E6F" />
          </linearGradient>
        </defs>
        <path
          d="M50,10 Q20,30 15,70 Q15,100 50,115 Q85,100 85,70 Q80,30 50,10 Z"
          fill="url(#leaf1)"
        />
        <path
          d="M50,10 L50,115"
          stroke="#5A7B4E"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M50,30 Q35,45 30,55 M50,50 Q35,60 28,72 M50,70 Q38,78 32,88 M50,30 Q65,45 70,55 M50,50 Q65,60 72,72 M50,70 Q62,78 68,88"
          stroke="#5A7B4E"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* Flores rosadas derecha */}
      <svg
        className={`absolute right-2 top-1/2 w-24 sm:w-36 opacity-75 ${
          shouldAnimate ? 'animate-flower-bob' : ''
        }`}
        viewBox="0 0 80 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="40"
          y1="30"
          x2="40"
          y2="115"
          stroke="#7A9B6E"
          strokeWidth="2"
          opacity="0.7"
        />
        <path
          d="M40,80 Q28,72 22,82 M40,60 Q52,52 58,62"
          stroke="#7A9B6E"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
        <ellipse cx="22" cy="82" rx="6" ry="3" fill="#7A9B6E" opacity="0.5" />
        <ellipse cx="58" cy="62" rx="6" ry="3" fill="#7A9B6E" opacity="0.5" />

        {/* Flor */}
        <g transform="translate(40,28)">
          <circle cx="0" cy="-9" r="7" fill="#E8B4A0" />
          <circle cx="8" cy="-3" r="7" fill="#E8B4A0" />
          <circle cx="-8" cy="-3" r="7" fill="#E8B4A0" />
          <circle cx="5" cy="6" r="7" fill="#E8B4A0" />
          <circle cx="-5" cy="6" r="7" fill="#E8B4A0" />
          <circle cx="0" cy="0" r="3.5" fill="#D4A574" />
        </g>
      </svg>

      {/* Hoja pequeña abajo izquierda */}
      <svg
        className={`absolute bottom-12 left-4 w-28 sm:w-44 opacity-55 ${
          shouldAnimate ? 'animate-leaf-sway' : ''
        }`}
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animationDelay: '2s' }}
      >
        <defs>
          <linearGradient id="leaf2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9FB48C" />
            <stop offset="100%" stopColor="#7A9B6E" />
          </linearGradient>
        </defs>
        <path
          d="M60,10 Q30,15 20,50 Q15,80 30,100 Q40,108 60,110 Q80,108 90,100 Q105,80 100,50 Q90,15 60,10 Z"
          fill="url(#leaf2)"
        />
        <path
          d="M60,30 L40,55 M60,30 L80,55 M60,50 L35,75 M60,50 L85,75 M60,70 L45,90 M60,70 L75,90"
          stroke="#5A7B4E"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* Flores tulipán abajo */}
      <svg
        className={`absolute bottom-8 right-1/4 w-20 sm:w-28 opacity-70 ${
          shouldAnimate ? 'animate-flower-bob' : ''
        }`}
        viewBox="0 0 80 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animationDelay: '1.5s' }}
      >
        <line x1="20" y1="30" x2="20" y2="95" stroke="#7A9B6E" strokeWidth="2" />
        <line x1="50" y1="40" x2="50" y2="95" stroke="#7A9B6E" strokeWidth="2" />
        <path d="M20,30 Q14,20 18,12 Q22,8 26,12 Q30,20 24,30 Z" fill="#E8B4A0" />
        <path d="M50,40 Q44,30 48,22 Q52,18 56,22 Q60,30 54,40 Z" fill="#F0C4A8" />
      </svg>

      {/* Partículas/destellos pequeños */}
      <div
        className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-yellow-200 opacity-50"
        style={{
          boxShadow: '0 0 12px 4px rgba(244, 220, 175, 0.5)',
        }}
      />
      <div
        className="absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full bg-pink-200 opacity-60"
        style={{
          boxShadow: '0 0 10px 3px rgba(232, 180, 160, 0.4)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-1 h-1 rounded-full bg-green-200 opacity-50"
        style={{
          boxShadow: '0 0 8px 2px rgba(159, 180, 140, 0.4)',
        }}
      />
    </div>
  );
}