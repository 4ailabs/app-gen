import React, { useMemo, useState } from 'react';
import { useGenogramStore } from '../store/useGenogramStore';
import { X, Search, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import type { NodeData } from '../types';

/**
 * Panel del Método de Detección de Patrones (Sesión 1).
 * Recorre el árbol ya construido y sugiere coincidencias candidatas
 * para los cuatro pasos: A (edades), A (fechas), R (roles), E (eventos por rama).
 * El estudiante elige su patrón y lo marca con asterisco.
 */

const CATEGORY_LABELS: Record<string, string> = {
  death_loss: 'Muerte / Pérdida',
  abandonment_rejection: 'Abandono / Rechazo',
  betrayal_deceit: 'Traición / Engaño',
  violence: 'Violencia',
  humiliation_exclusion: 'Humillación / Exclusión',
  accident_illness: 'Accidente / Enfermedad',
  secret: 'Secreto',
  crisis: 'Crisis',
};

interface Finding {
  code: 'A' | 'R' | 'E';
  title: string;
  detail: string;
}

export function PatternDetection({ onClose }: { onClose: () => void }) {
  const nodes = useGenogramStore(s => s.nodes);
  const [starred, setStarred] = useState<string | null>(null);

  const people = useMemo(() => nodes.map(n => n.data as NodeData), [nodes]);

  const findings = useMemo<Finding[]>(() => {
    const out: Finding[] = [];

    // --- Paso 1 · Edades (A): misma edad en un evento, en personas distintas ---
    const byAge = new Map<number, { name: string; cat: string }[]>();
    people.forEach(p => {
      (p.events || []).forEach(e => {
        if (typeof e.ageAtEvent === 'number') {
          const arr = byAge.get(e.ageAtEvent) || [];
          arr.push({ name: p.name || 'Sin nombre', cat: CATEGORY_LABELS[e.category] || e.category });
          byAge.set(e.ageAtEvent, arr);
        }
      });
    });
    byAge.forEach((arr, age) => {
      if (arr.length >= 2) {
        out.push({
          code: 'A',
          title: `Edad ${age} repetida`,
          detail: arr.map(a => `${a.name} (${a.cat})`).join(' · '),
        });
      }
    });

    // --- Paso 2 · Fechas de calendario (A): mismo día y mes, distinto año ---
    const byMonthDay = new Map<string, { name: string; year: string }[]>();
    people.forEach(p => {
      (p.events || []).forEach(e => {
        if (e.date) {
          const d = new Date(e.date);
          if (!isNaN(d.getTime())) {
            const key = `${d.getMonth() + 1}-${d.getDate()}`;
            const arr = byMonthDay.get(key) || [];
            arr.push({ name: p.name || 'Sin nombre', year: String(d.getFullYear()) });
            byMonthDay.set(key, arr);
          }
        }
      });
    });
    byMonthDay.forEach((arr, key) => {
      const uniqueYears = new Set(arr.map(a => a.year));
      if (arr.length >= 2 && uniqueYears.size >= 2) {
        const [m, day] = key.split('-');
        out.push({
          code: 'A',
          title: `Fecha ${day}/${m} repetida`,
          detail: arr.map(a => `${a.name} (${a.year})`).join(' · '),
        });
      }
    });

    // --- Paso 3 · Roles / oficios (R): mismo rol en personas distintas ---
    const byRole = new Map<string, string[]>();
    people.forEach(p => {
      const role = (p.roleOrTrade || '').trim().toLowerCase();
      if (role) {
        const arr = byRole.get(role) || [];
        arr.push(p.name || 'Sin nombre');
        byRole.set(role, arr);
      }
    });
    byRole.forEach((names, role) => {
      if (names.length >= 2) {
        out.push({
          code: 'R',
          title: `Rol repetido: ${role}`,
          detail: names.join(' · '),
        });
      }
    });

    // --- Paso 4 · Tipo de evento (E): misma categoría en personas distintas ---
    const byCategory = new Map<string, string[]>();
    people.forEach(p => {
      (p.events || []).forEach(e => {
        const arr = byCategory.get(e.category) || [];
        arr.push(p.name || 'Sin nombre');
        byCategory.set(e.category, arr);
      });
    });
    byCategory.forEach((names, cat) => {
      if (names.length >= 2) {
        out.push({
          code: 'E',
          title: `Evento repetido: ${CATEGORY_LABELS[cat] || cat}`,
          detail: [...new Set(names)].join(' · '),
        });
      }
    });

    return out;
  }, [people]);

  const codeStyles: Record<Finding['code'], string> = {
    A: 'bg-[var(--terra)] text-[var(--bg)]',
    R: 'bg-[var(--sage)] text-[var(--bg)]',
    E: 'bg-[var(--gold)] text-[var(--bg)]',
  };

  return (
    <div className="w-80 bg-[var(--bg)]/95 backdrop-blur-xl border border-[var(--border)] shadow-2xl absolute right-4 top-4 bottom-4 rounded-2xl flex flex-col z-50 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-md">
        <h2 className="text-lg font-serif italic text-[var(--text)] flex items-center gap-2">
          <Search size={16} className="text-[var(--terra)]" />
          Detección de patrones
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-[var(--surface-2)] rounded-full text-[var(--text-3)]">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Los 4 pasos */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-3)]">El método, cuatro pasos</p>
          <div className="grid grid-cols-1 gap-1.5 text-[11px] text-[var(--text-2)]">
            <div className="flex items-start gap-2"><span className="font-mono font-bold text-[var(--terra)] w-4">A</span><span>Edades — misma edad en un evento, en generaciones distintas.</span></div>
            <div className="flex items-start gap-2"><span className="font-mono font-bold text-[var(--terra)] w-4">A</span><span>Fechas — mismo día y mes, sin importar el año.</span></div>
            <div className="flex items-start gap-2"><span className="font-mono font-bold text-[var(--sage)] w-4">R</span><span>Roles — mismo oficio o función familiar en una línea.</span></div>
            <div className="flex items-start gap-2"><span className="font-mono font-bold text-[var(--gold)] w-4">E</span><span>Evento — misma categoría repetida en una rama.</span></div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-4">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-3)] mb-3">
            Coincidencias detectadas {findings.length > 0 && <span className="text-[var(--terra)]">({findings.length})</span>}
          </p>

          {findings.length === 0 ? (
            <p className="text-xs text-[var(--text-3)] italic py-6 text-center leading-relaxed">
              Aún no hay coincidencias.<br />
              Agrega fechas, edades, roles y eventos a las personas del árbol para que el método las encuentre.
            </p>
          ) : (
            <div className="space-y-2">
              {findings.map((f, i) => {
                const key = `${f.code}-${f.title}-${i}`;
                const isStar = starred === key;
                return (
                  <button
                    key={key}
                    onClick={() => setStarred(isStar ? null : key)}
                    className={cn(
                      'w-full text-left bg-[var(--surface)] border rounded-lg p-3 transition-all group',
                      isStar ? 'border-[var(--gold)] ring-1 ring-[var(--gold)]/40' : 'border-[var(--border)] hover:border-[var(--border)]'
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={cn('font-mono font-bold text-xs w-6 h-6 rounded flex items-center justify-center shrink-0', codeStyles[f.code])}>
                        {f.code}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-[var(--text)] truncate">{f.title}</p>
                          <Star size={13} className={cn('shrink-0 transition-colors', isStar ? 'text-[var(--gold)] fill-[var(--gold)]' : 'text-[var(--border)] group-hover:text-[var(--text-3)]')} />
                        </div>
                        <p className="text-[10px] text-[var(--text-3)] mt-1 leading-snug">{f.detail}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-md">
        <p className="text-[10px] text-[var(--text-3)] leading-relaxed">
          <Star size={11} className="inline text-[var(--gold)] fill-[var(--gold)] -mt-0.5" /> Marca con estrella el patrón que puedas <span className="text-[var(--text-2)] font-bold">explicar en una sola frase sin dudar</span> — ese es el que llevas a las próximas sesiones.
        </p>
      </div>
    </div>
  );
}
