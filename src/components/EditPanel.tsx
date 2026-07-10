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

  const updateEvent = (eventId: string, field: keyof LifeEvent, value: string) => {
    const updatedEvents = (data.events || []).map(e => 
      e.id === eventId ? { ...e, [field]: value } : e
    );
    handleUpdate('events', updatedEvents);
  };

  const removeEvent = (eventId: string) => {
    handleUpdate('events', (data.events || []).filter(e => e.id !== eventId));
  };

  return (
    <div className="w-80 bg-[#1A1A19]/95 backdrop-blur-xl border border-[#333331] shadow-2xl absolute right-4 top-4 bottom-4 rounded-2xl flex flex-col z-50 overflow-hidden transition-all">
      <div className="flex items-center justify-between p-4 border-b border-[#333331] bg-[#242423]/50 backdrop-blur-md">
        <h2 className="text-lg font-serif italic text-[#E8E8E6]">Editar Persona</h2>
        <button onClick={onClose} className="p-1 hover:bg-[#2C2C2B] rounded-full text-[#9C9C98]">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9C9C98] mb-1">Nombre</label>
            <input 
              type="text" 
              value={data.name} 
              onChange={e => handleUpdate('name', e.target.value)}
              className="w-full px-3 py-2 bg-[#242423] border border-[#333331] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C5C5BC] text-sm text-[#E8E8E6]"
              placeholder="ej. Juan Pérez"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9C9C98] mb-1">Género</label>
              <select 
                value={data.gender} 
                onChange={e => handleUpdate('gender', e.target.value as Gender)}
                className="w-full px-3 py-2 bg-[#242423] border border-[#333331] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C5C5BC] text-sm text-[#E8E8E6]"
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
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9C9C98] mb-1">Estado</label>
              <select 
                value={data.status} 
                onChange={e => handleUpdate('status', e.target.value as Status)}
                className="w-full px-3 py-2 bg-[#242423] border border-[#333331] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C5C5BC] text-sm text-[#E8E8E6]"
              >
                <option value="alive">Vivo</option>
                <option value="deceased">Fallecido</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9C9C98] mb-1">Nacimiento</label>
              <input 
                type="date" 
                value={data.birthDate || ''} 
                onChange={e => handleUpdate('birthDate', e.target.value)}
                disabled={data.birthDateUnknown}
                className="w-full px-3 py-2 bg-[#242423] border border-[#333331] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C5C5BC] text-sm text-[#E8E8E6] disabled:bg-[#2C2C2B] disabled:text-[#9C9C98]"
              />
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input 
                  type="checkbox"
                  checked={data.birthDateUnknown || false}
                  onChange={e => {
                    handleUpdate('birthDateUnknown', e.target.checked);
                    if (e.target.checked) handleUpdate('birthDate', undefined);
                  }}
                  className="rounded text-[#C5C5BC] focus:ring-[#C5C5BC]"
                />
                <span className="text-[10px] font-bold text-[#9C9C98]">Fecha desconocida</span>
              </label>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9C9C98] mb-1">Fallecimiento</label>
              <input 
                type="date" 
                value={data.deathDate || ''} 
                onChange={e => handleUpdate('deathDate', e.target.value)}
                disabled={data.status !== 'deceased' || data.deathDateUnknown}
                className="w-full px-3 py-2 bg-[#242423] border border-[#333331] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C5C5BC] text-sm text-[#E8E8E6] disabled:bg-[#2C2C2B] disabled:text-[#9C9C98]"
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
                  className="rounded text-[#C5C5BC] focus:ring-[#C5C5BC] disabled:opacity-50"
                />
                <span className="text-[10px] font-bold text-[#9C9C98]">Fecha desconocida</span>
              </label>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input 
              type="checkbox"
              checked={data.hasUnknownInfo || false}
              onChange={e => handleUpdate('hasUnknownInfo', e.target.checked)}
              className="rounded text-[#C5C5BC] focus:ring-[#C5C5BC]"
            />
            <span className="text-[11px] font-bold text-[#E8E8E6]">Información Desconocida (?)</span>
          </label>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9C9C98] mb-1">Rol / Profesión</label>
            <input 
              type="text" 
              value={data.roleOrTrade || ''} 
              onChange={e => handleUpdate('roleOrTrade', e.target.value)}
              className="w-full px-3 py-2 bg-[#242423] border border-[#333331] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C5C5BC] text-sm text-[#E8E8E6]"
              placeholder="ej. Maestro, Carpintero"
            />
          </div>
        </div>

        <div className="border-t border-[#333331] pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-serif italic text-[#E8E8E6]">Eventos de Vida</h3>
            <button 
              onClick={addEvent}
              className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#C5C5BC] hover:text-[#484833] font-bold"
            >
              <Plus size={14} /> Añadir Evento
            </button>
          </div>

          <div className="space-y-4">
            {data.events?.map((event) => (
              <div key={event.id} className="bg-[#242423] p-3 rounded-md border border-[#333331] relative group">
                <button 
                  onClick={() => removeEvent(event.id)}
                  className="absolute right-2 top-2 text-[#9C9C98] hover:text-[#E06A47] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
                <div className="space-y-3 mt-1">
                  <select
                    value={event.category}
                    onChange={e => updateEvent(event.id, 'category', e.target.value as EventCategory)}
                    className="w-full px-2 py-1.5 border border-[#333331] rounded text-xs bg-[#242423] focus:ring-1 focus:ring-[#C5C5BC] outline-none text-[#E8E8E6]"
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
                  <input 
                    type="date" 
                    value={event.date}
                    onChange={e => updateEvent(event.id, 'date', e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#333331] rounded text-xs focus:ring-1 focus:ring-[#C5C5BC] outline-none text-[#E8E8E6] bg-[#242423]"
                  />
                  <input 
                    type="text" 
                    value={event.description}
                    onChange={e => updateEvent(event.id, 'description', e.target.value)}
                    placeholder="Descripción"
                    className="w-full px-2 py-1.5 border border-[#333331] rounded text-xs focus:ring-1 focus:ring-[#C5C5BC] outline-none text-[#E8E8E6] bg-[#242423]"
                  />
                </div>
              </div>
            ))}
            {(!data.events || data.events.length === 0) && (
              <p className="text-xs text-[#9C9C98] italic text-center py-4">No hay eventos registrados.</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-[#333331] bg-[#242423]/50 backdrop-blur-md">
        <button 
          onClick={() => {
            deleteNode(data.id);
            onClose();
          }}
          className="w-full py-2.5 px-4 bg-[#242423] border border-[#E06A47]/30 text-[#E06A47] rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-[#E06A47] hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={14} />
          Eliminar Persona
        </button>
      </div>
    </div>
  );
}
