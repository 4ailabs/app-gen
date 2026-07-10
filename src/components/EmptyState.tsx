import React from 'react';
import { useGenogramStore } from '../store/useGenogramStore';
import { Square, Circle, Sparkles, ArrowUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Estado inicial del lienzo vacío: orienta al estudiante sobre cómo empezar.
 * Aparece solo cuando no hay personas en el árbol.
 */
export function EmptyState() {
  const { addNode, loadExample, isGenosociogramMode } = useGenogramStore();

  const addFirst = (gender: 'male' | 'female') => {
    const id = uuidv4();
    addNode({
      id,
      type: 'person',
      position: { x: window.innerWidth / 2 - 60, y: window.innerHeight / 2 - 60 },
      data: { id, name: 'Yo', gender, status: 'alive', events: [], isGenosociogramMode },
    });
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-6">
      <div className="pointer-events-auto max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <svg viewBox="0 0 160 160" className="w-16 h-16 opacity-90" aria-hidden="true">
            <g transform="translate(80,80)">
              {Array.from({ length: 12 }).map((_, k) => {
                const ang = ((k * 30 - 90) * Math.PI) / 180;
                const x = 50 * Math.cos(ang);
                const y = 50 * Math.sin(ang);
                return <circle key={k} cx={x} cy={y} r="7" fill={k % 2 === 0 ? 'var(--terra)' : 'var(--sage)'} />;
              })}
              <circle cx="0" cy="0" r="5" fill="var(--gold)" opacity="0.4" />
              <circle cx="0" cy="0" r="3" fill="var(--gold)" />
            </g>
          </svg>
        </div>

        <h2 className="text-2xl font-serif italic text-[var(--text)] mb-3">Construye tu genograma</h2>
        <p className="text-sm text-[var(--text-3)] leading-relaxed mb-8 max-w-sm mx-auto">
          Empieza por ti, agrega a tus padres y a tus abuelos — mínimo tres generaciones.
          Después registra fechas, roles y eventos para rastrear los patrones.
        </p>

        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => addFirst('female')}
            className="flex items-center gap-2.5 px-5 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm font-bold text-[var(--text)] hover:border-[var(--sage)] hover:bg-[var(--surface-2)] transition-all"
          >
            <Circle size={18} className="text-[var(--sage)]" strokeWidth={2.5} />
            Empezar (mujer)
          </button>
          <button
            onClick={() => addFirst('male')}
            className="flex items-center gap-2.5 px-5 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm font-bold text-[var(--text)] hover:border-[var(--terra)] hover:bg-[var(--surface-2)] transition-all"
          >
            <Square size={18} className="text-[var(--terra)]" strokeWidth={2.5} />
            Empezar (hombre)
          </button>
        </div>

        <button
          onClick={loadExample}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[var(--text-3)] hover:text-[var(--gold)] transition-colors"
        >
          <Sparkles size={14} />
          o ver un ejemplo
        </button>

        <div className="mt-10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[var(--text-3)]">
          <ArrowUp size={12} />
          También puedes usar la barra de arriba
        </div>
      </div>
    </div>
  );
}
