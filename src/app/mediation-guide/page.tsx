import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { Card } from '@/components/ui/Card';

export const metadata = {
  title: 'Guía de mediación — Calma',
};

export default function MediationGuidePage() {
  return (
    <>
      <CognitiveBatteryPanel />
      <main className="min-h-screen px-6 py-12">
        <div className="max-w-prose mx-auto space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>

          <header>
            <h1 className="text-3xl font-bold mb-2">Guía de mediación</h1>
            <p className="text-text-secondary">
              Recursos para acompañar a niños con TDAH durante el aprendizaje
              del inglés en Calma.
            </p>
          </header>

          <Card>
            <h2 className="text-xl font-bold mb-3">
              Cómo acompañar una sesión
            </h2>
            <p className="mb-3">
              Las sesiones en Calma están diseñadas para ser cortas (10-15
              minutos). No insistas en alargarlas. Si el niño pierde el
              interés, mejor cerrar la sesión y retomar después.
            </p>
            <p className="mb-3">
              Antes de empezar, asegúrate de que el espacio sea tranquilo:
              sin TV de fondo, sin notificaciones del celular, con buena luz.
            </p>
            <p>
              Siéntate a su lado las primeras veces, pero no tomes el control.
              Tu rol es estar presente, no resolver por él/ella.
            </p>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-3">
              Señales de fatiga cognitiva
            </h2>
            <p className="mb-3">
              Detén la sesión inmediatamente si observas:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>El niño empieza a tocarse mucho la cara o a tirarse del pelo</li>
              <li>Lee la misma frase varias veces sin avanzar</li>
              <li>Responde sin mirar la pantalla</li>
              <li>Se irrita con preguntas que antes contestaba bien</li>
            </ul>
            <p>
              La fatiga cognitiva no se vence con esfuerzo: empeora. Diez
              minutos al día son más efectivos que treinta una vez por semana.
            </p>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-3">
              Panel de Batería Cognitiva
            </h2>
            <p className="mb-3">
              El icono de engrane (arriba a la derecha) abre los controles
              de accesibilidad. Cada uno tiene un propósito específico:
            </p>
            <p className="mb-2">
              <strong>Tamaño de letra.</strong> Si el niño se acerca mucho a
              la pantalla o entrecierra los ojos, sube el tamaño.
            </p>
            <p className="mb-2">
              <strong>Contraste.</strong> Para lectura prolongada el contraste
              suave reduce la fatiga visual. Solo usa contraste alto si la
              persona tiene baja visión.
            </p>
            <p className="mb-2">
              <strong>Velocidad de audio.</strong> Empieza siempre en 0.75x
              la primera vez que escuchas un audio nuevo. Sube a 1x cuando
              el niño identifique las palabras sin esfuerzo.
            </p>
            <p>
              <strong>Reducir movimiento.</strong> Para niños con
              hipersensibilidad a estímulos visuales o que se distraen con
              transiciones.
            </p>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-3">
              Niveles del MCER
            </h2>
            <p className="mb-3">
              Calma sigue el Marco Común Europeo de Referencia para las
              lenguas. Los niveles van de A1 (principiante) a C2 (dominio).
            </p>
            <p className="mb-2">
              <strong>A1.</strong> Saludos, números, familia, colores, comida
              básica. Frases muy cortas.
            </p>
            <p className="mb-2">
              <strong>A2.</strong> Rutinas diarias, descripciones simples,
              tiempos verbales básicos.
            </p>
            <p className="mb-2">
              <strong>B1.</strong> Conversaciones cotidianas, narrar
              experiencias, planes y deseos.
            </p>
            <p>
              <strong>B2.</strong> Discusiones, opiniones, textos complejos,
              gramática avanzada.
            </p>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-3">
              Modo Enfoque: lo que sí y lo que no
            </h2>
            <p className="mb-3">
              El Modo Enfoque (escudo escolar) es un andamiaje, no una
              prisión. Lo que hace:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Pone la pantalla en modo completo</li>
              <li>Detecta cuando el niño cambia de pestaña y registra el evento</li>
              <li>Avisa al cerrar la pestaña accidentalmente</li>
              <li>Muestra un saludo amable cuando regresa</li>
            </ul>
            <p className="mb-3">
              Lo que NO hace (limitación técnica de los navegadores):
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>No puede impedir abrir otras pestañas</li>
              <li>No puede cerrar otras apps del computador</li>
              <li>No bloquea el celular</li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-3">
              Formato de tareas (para docentes)
            </h2>
            <p className="mb-3">
              Las tareas se crean pegando JSON en el editor. Aquí los formatos:
            </p>
            <p className="font-mono text-xs mb-2 mt-3"><strong>Vocabulario:</strong></p>
            <pre className="text-xs bg-bg-alt p-3 rounded-md overflow-x-auto border border-border-subtle">
{`{
  "word": "hello",
  "translation": "hola",
  "audio_url": "",
  "hint": "Saludo informal"
}`}
            </pre>
            <p className="font-mono text-xs mb-2 mt-3"><strong>Gramática:</strong></p>
            <pre className="text-xs bg-bg-alt p-3 rounded-md overflow-x-auto border border-border-subtle">
{`{
  "sentence_segments": [
    {"type":"text","content":"She "},
    {"type":"marker","content":"is going","marker_type":"verb-tense","hint":"Presente continuo"},
    {"type":"text","content":" to school."}
  ],
  "prompt": "¿Qué tiempo verbal es?",
  "options": ["Presente simple","Presente continuo","Pasado"],
  "correct": "Presente continuo"
}`}
            </pre>
            <p className="font-mono text-xs mb-2 mt-3"><strong>Comprensión auditiva:</strong></p>
            <pre className="text-xs bg-bg-alt p-3 rounded-md overflow-x-auto border border-border-subtle">
{`{
  "audio_url": "https://...",
  "prompt": "¿Qué dijo?",
  "options": ["Hello","Goodbye","Thanks"],
  "correct": "Hello"
}`}
            </pre>
            <p className="font-mono text-xs mb-2 mt-3"><strong>Lectura:</strong></p>
            <pre className="text-xs bg-bg-alt p-3 rounded-md overflow-x-auto border border-border-subtle">
{`{
  "text_segments": [
    {"type":"text","content":"My name "},
    {"type":"marker","content":"is","marker_type":"auxiliary"},
    {"type":"text","content":" Maria."}
  ],
  "prompt": "¿Cómo se llama?",
  "options": ["Maria","Sofia","Ana"],
  "correct": "Maria"
}`}
            </pre>
          </Card>
        </div>
      </main>
    </>
  );
}
