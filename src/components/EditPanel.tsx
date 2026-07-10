import React from 'react';
import { NodeData, Gender, Status, EventCategory, LifeEvent } from '../types';
import { X, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useGenogramStore } from '../store/useGenogramStore';

interface EditPanelProps {
  data: NodeData | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<NodeData>) => void;
}

export function EditPanel({ data, onClose, onUpdate }: EditPanelProps) {
  const deleteNode = useGenogramStore(s => s.deleteNode);

  if (!data) return null;

  const handleUpdate = (field: keyof NodeData, value: any) => {
    onUpdate(data.id, { [field]: value });
  };

  const addEvent = () => {
    const newEvent: LifeEvent = {
      id: uuidv4(),
      date: '',
      description: '',
      category: 'death_loss'
    };
    handleUpdate('events', [...(data.events || []), newEvent]);
  };

  const updateEvent = (eventId: string, field: keyof LifeEvent, value: string | number | undefined) => {
    const updatedEvents = (data.events || []).map(e =>
      e.id === eventId ? { ...e, [field]: value } : e
    );
    handleUpdate('events', updatedEvents);
  };

  const removeEvent = (eventId: string) => {
    handleUpdate('events', (data.events || []).filter(e => e.id !== eventId));
  };

  return (
    <div className="w-80 bg-[var(--bg)]/95 backdrop-blur-xl border border-[var(--border)] shadow-2xl absolute right-4 top-4 bottom-4 rounded-2xl flex flex-col z-50 overflow-hidden transition-all">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-md">
        <h2 className="text-lg font-serif italic text-[var(--text)]">Editar Persona</h2>
        <button onClick={onClose} className="p-1 hover:bg-[var(--surface-2)] rounded-full text-[var(--text-3)]">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[var(--text-3)] mb-1">Nombre</label>
            <input 
              type="text" 
              value={data.name} 
              onChange={e => handleUpdate('name', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--text-2)] text-sm text-[var(--text)]"
              placeholder="ej. Juan Pérez"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[var(--text-3)] mb-1">Género</label>
              <select 
                value={data.gender} 
                onChange={e => handleUpdate('gender', e.target.value as Gender)}
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--text-2)] text-sm text-[var(--text)]"
              >
                <option value="male">Hombre</option>
                <option value="female">Mujer</option>
                <option value="unknown">Inespecífico</option>
                <option value="pregnancy">Embarazo</option>
                <option value="miscarriage">Aborto espontáneo</option>
                <option value="abortion">Aborto inducido</option>
                <option value="stillbirth">Óbito</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[var(--text-3)] mb-1">Estado</label>
              <select 
                value={data.status} 
                onChange={e => handleUpdate('status', e.target.value as Status)}
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--text-2)] text-sm text-[var(--text)]"
              >
                <option value="alive">Vivo</option>
                <option value="deceased">Fallecido</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[var(--text-3)] mb-1">Nacimiento</label>
              <input 
                type="date" 
                value={data.birthDate || ''} 
                onChange={e => handleUpdate('birthDate', e.target.value)}
                disabled={data.birthDateUnknown}
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--text-2)] text-sm text-[var(--text)] disabled:bg-[var(--surface-2)] disabled:text-[var(--text-3)]"
              />
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input 
                  type="checkbox"
                  checked={data.birthDateUnknown || false}
                  onChange={e => {
                    handleUpdate('birthDateUnknown', e.target.checked);
                    if (e.target.checked) handleUpdate('birthDate', undefined);
                  }}
                  className="rounded text-[var(--text-2)] focus:ring-[var(--text-2)]"
                />
                <span className="text-[10px] font-bold text-[var(--text-3)]">Fecha desconocida</span>
              </label>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[var(--text-3)] mb-1">Fallecimiento</label>
              <input 
                type="date" 
                value={data.deathDate || ''} 
                onChange={e => handleUpdate('deathDate', e.target.value)}
                disabled={data.status !== 'deceased' || data.deathDateUnknown}
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--text-2)] text-sm text-[var(--text)] disabled:bg-[var(--surface-2)] disabled:text-[var(--text-3)]"
              />
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input 
                  type="checkbox"
                  checked={data.deathDateUnknown || false}
                  onChange={e => {
                    handleUpdate('deathDateUnknown', e.target.checked);
                    if (e.target.checked) handleUpdate('deathDate', undefined);
                  }}
                  disabled={data.status !== 'deceased'}
                  className="rounded text-[var(--text-2)] focus:ring-[var(--text-2)] disabled:opacity-50"
                />
                <span className="text-[10px] font-bold text-[var(--text-3)]">Fecha desconocida</span>
              </label>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input 
              type="checkbox"
              checked={data.hasUnknownInfo || false}
              onChange={e => handleUpdate('hasUnknownInfo', e.target.checked)}
              className="rounded text-[var(--text-2)] focus:ring-[var(--text-2)]"
            />
            <span className="text-[11px] font-bold text-[var(--text)]">Información Desconocida (?)</span>
          </label>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[var(--text-3)] mb-1">Rol / Profesión</label>
            <input 
              type="text" 
              value={data.roleOrTrade || ''} 
              onChange={e => handleUpdate('roleOrTrade', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--text-2)] text-sm text-[var(--text)]"
              placeholder="ej. Maestro, Carpintero"
            />
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-serif italic text-[var(--text)]">Eventos de Vida</h3>
            <button 
              onClick={addEvent}
              className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[var(--text-2)] hover:text-[var(--border)] font-bold"
            >
              <Plus size={14} /> Añadir Evento
            </button>
          </div>

          <div className="space-y-4">
            {data.events?.map((event) => (
              <div key={event.id} className="bg-[var(--surface)] p-3 rounded-md border border-[var(--border)] relative group">
                <button 
                  onClick={() => removeEvent(event.id)}
                  className="absolute right-2 top-2 text-[var(--text-3)] hover:text-[var(--terra)] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
                <div className="space-y-3 mt-1">
                  <select
                    value={event.category}
                    onChange={e => updateEvent(event.id, 'category', e.target.value as EventCategory)}
                    className="w-full px-2 py-1.5 border border-[var(--border)] rounded text-xs bg-[var(--surface)] focus:ring-1 focus:ring-[var(--text-2)] outline-none text-[var(--text)]"
                  >
                    <option value="death_loss">Muerte / Pérdida</option>
                    <option value="abandonment_rejection">Abandono / Rechazo</option>
                    <option value="betrayal_deceit">Traición / Engaño</option>
                    <option value="violence">Violencia</option>
                    <option value="humiliation_exclusion">Humillación / Exclusión</option>
                    <option value="accident_illness">Accidente / Enfermedad</option>
                    <option value="secret">Secreto</option>
                    <option value="crisis">Crisis</option>
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-[var(--text-3)] mb-1">Fecha</label>
                      <input
                        type="date"
                        value={event.date}
                        onChange={e => updateEvent(event.id, 'date', e.target.value)}
                        className="w-full px-2 py-1.5 border border-[var(--border)] rounded text-xs focus:ring-1 focus:ring-[var(--text-2)] outline-none text-[var(--text)] bg-[var(--surface)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-[var(--text-3)] mb-1">Edad</label>
                      <input
                        type="number"
                        min={0}
                        max={120}
                        value={event.ageAtEvent ?? ''}
                        onChange={e => updateEvent(event.id, 'ageAtEvent', e.target.value === '' ? undefined : Number(e.target.value))}
                        placeholder="años"
                        className="w-full px-2 py-1.5 border border-[var(--border)] rounded text-xs focus:ring-1 focus:ring-[var(--text-2)] outline-none text-[var(--text)] bg-[var(--surface)]"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={event.description}
                    onChange={e => updateEvent(event.id, 'description', e.target.value)}
                    placeholder="Descripción"
                    className="w-full px-2 py-1.5 border border-[var(--border)] rounded text-xs focus:ring-1 focus:ring-[var(--text-2)] outline-none text-[var(--text)] bg-[var(--surface)]"
                  />
                </div>
              </div>
            ))}
            {(!data.events || data.events.length === 0) && (
              <p className="text-xs text-[var(--text-3)] italic text-center py-4">No hay eventos registrados.</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-md">
        <button 
          onClick={() => {
            deleteNode(data.id);
            onClose();
          }}
          className="w-full py-2.5 px-4 bg-[var(--surface)] border border-[var(--terra)]/30 text-[var(--terra)] rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-[var(--terra)] hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={14} />
          Eliminar Persona
        </button>
      </div>
    </div>
  );
}
