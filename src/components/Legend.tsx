import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Info } from 'lucide-react';

export function Legend() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-6 left-6 bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] p-3 rounded-xl shadow-lg flex items-center gap-2 text-[var(--text-2)] hover:bg-[var(--bg)] transition-all z-40"
      >
        <Info size={18} />
        <span className="text-[10px] uppercase tracking-widest font-bold">Leyenda</span>
      </button>
    );
  }

  return (
    <div className="absolute bottom-6 left-6 bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--border)] rounded-2xl shadow-2xl w-64 z-40 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)] bg-[var(--bg)]/50">
        <h3 className="text-xs font-serif italic text-[var(--text)] flex items-center gap-2">
          <Info size={14} className="text-[var(--text-2)]" />
          Símbolos del Genograma
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-[var(--text-3)] hover:text-[var(--text-2)] p-1 rounded hover:bg-[var(--surface-2)] transition-colors">
          <ChevronDown size={16} />
        </button>
      </div>
      <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">
        {/* Personas */}
        <div>
           <h4 className="text-[9px] uppercase tracking-widest font-bold text-[var(--text-3)] mb-3">Personas</h4>
           <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3">
                 <div className="w-5 h-5 border-[2px] border-[var(--text-2)] rounded-none bg-[var(--surface)]"></div>
                 <span className="text-[10px] font-bold text-[var(--text)]">Hombre</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-5 h-5 border-[2px] border-[var(--text-2)] rounded-full bg-[var(--surface)]"></div>
                 <span className="text-[10px] font-bold text-[var(--text)]">Mujer</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-4 h-4 border-[2px] border-[var(--text-2)] rounded-sm rotate-45 ml-0.5 bg-[var(--surface)]"></div>
                 <span className="text-[10px] font-bold text-[var(--text)]">Inespecífico</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-5 h-5 border-[2px] border-[var(--text-2)] relative flex items-center justify-center overflow-hidden bg-[var(--surface)]">
                   <div className="absolute w-[150%] h-[1.5px] bg-[var(--text-2)] rotate-45"></div>
                   <div className="absolute w-[150%] h-[1.5px] bg-[var(--text-2)] -rotate-45"></div>
                 </div>
                 <span className="text-[10px] font-bold text-[var(--text)]">Fallecido</span>
              </div>
           </div>
        </div>

        {/* Embarazo y Pérdidas */}
        <div>
           <h4 className="text-[9px] uppercase tracking-widest font-bold text-[var(--text-3)] mb-3">Embarazo y Pérdidas</h4>
           <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <svg viewBox="0 0 24 24" className="w-5 h-5 text-[var(--text-2)]"><polygon points="12,2 22,22 2,22" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                 <span className="text-[10px] font-bold text-[var(--text)]">Embarazo</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-[var(--text-2)] rounded-full ml-1"></div>
                 <span className="text-[10px] font-bold text-[var(--text)]">Aborto espontáneo</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-[var(--text-2)] rounded-full ml-1 relative">
                    <svg viewBox="0 0 24 24" className="absolute inset-[-6px] w-[calc(100%+12px)] h-[calc(100%+12px)] text-[var(--terra)] pointer-events-none">
                      <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2.5" />
                    </svg>
                 </div>
                 <span className="text-[10px] font-bold text-[var(--text)] ml-1">Aborto inducido</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-5 h-5 border-[2px] border-[var(--text-2)] ml-0.5 relative flex items-center justify-center overflow-hidden bg-[var(--surface)]">
                   <div className="absolute w-[150%] h-[1.5px] bg-[var(--text-2)] rotate-45"></div>
                   <div className="absolute w-[150%] h-[1.5px] bg-[var(--text-2)] -rotate-45"></div>
                 </div>
                 <span className="text-[10px] font-bold text-[var(--text)]">Óbito</span>
              </div>
           </div>
        </div>

        {/* Vínculos */}
        <div>
           <h4 className="text-[9px] uppercase tracking-widest font-bold text-[var(--text-3)] mb-3">Vínculos y Conexiones</h4>
           <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-6 h-[2px] bg-[var(--text-2)]"></div>
                 <span className="text-[10px] font-bold text-[var(--text)]">Matrimonio / Unión</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="relative overflow-hidden w-6 h-6">
                   <div className="w-6 h-[2px] bg-[var(--text-2)] absolute top-1/2 -translate-y-1/2"></div>
                   <div className="w-[18px] h-[10px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                     <div className="absolute w-[2px] h-full bg-[var(--terra)] rotate-45 left-[4px]"></div>
                     <div className="absolute w-[2px] h-full bg-[var(--terra)] rotate-45 right-[4px]"></div>
                   </div>
                 </div>
                 <span className="text-[10px] font-bold text-[var(--text)]">Divorcio</span>
              </div>

              <div className="flex items-center gap-3">
                 <div className="w-6 h-[2px] border-t-[2px] border-[var(--terra)] border-dashed"></div>
                 <span className="text-[10px] font-bold text-[var(--text)]">Conflicto</span>
              </div>

              <div className="flex items-center gap-3">
                 <div className="relative overflow-hidden w-6 h-6">
                   <div className="w-6 h-[2px] bg-[var(--text-2)] absolute top-1/2 -translate-y-1/2"></div>
                   <div className="w-[18px] h-[10px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                     <div className="absolute w-[2px] h-full bg-[var(--terra)] rotate-[30deg] left-[4px]"></div>
                     <div className="absolute w-[2px] h-full bg-[var(--terra)] rotate-[30deg] right-[4px]"></div>
                   </div>
                 </div>
                 <span className="text-[10px] font-bold text-[var(--text)]">Corte emocional</span>
              </div>

              <div className="flex items-center gap-3">
                 <div className="w-6 h-[2px] border-t-[2px] border-[var(--text-2)] border-dashed"></div>
                 <span className="text-[10px] font-bold text-[var(--text)]">Adopción</span>
              </div>

              <div className="flex items-center gap-3">
                 <svg viewBox="0 0 24 24" className="w-6 h-5 text-[var(--text-3)]"><path d="M12,24 L12,12 M12,12 L2,12 M12,12 L22,12 M2,12 L2,2 M22,12 L22,2" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                 <span className="text-[10px] font-bold text-[var(--text)]">Hijos</span>
              </div>
              <div className="flex items-center gap-3">
                 <svg viewBox="0 0 24 24" className="w-6 h-5 text-[var(--text-3)]"><path d="M12,2 L2,22 M12,2 L22,22" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                 <span className="text-[10px] font-bold text-[var(--text)]">Gemelos</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
