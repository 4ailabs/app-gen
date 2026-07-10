import React from 'react';
import { EdgeData, RelationshipType } from '../types';
import { X, Trash2 } from 'lucide-react';
import { useGenogramStore } from '../store/useGenogramStore';

interface EditEdgePanelProps {
  id: string;
  data: EdgeData | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<EdgeData>) => void;
}

export function EditEdgePanel({ id, data, onClose, onUpdate }: EditEdgePanelProps) {
  const deleteEdge = useGenogramStore(s => s.deleteEdge);

  if (!data) return null;

  const handleUpdate = (field: keyof EdgeData, value: any) => {
    onUpdate(id, { ...data, [field]: value });
  };

  return (
    <div className="w-80 bg-[#1A1A19]/95 backdrop-blur-xl border border-[#333331] shadow-2xl absolute right-4 top-4 bottom-4 rounded-2xl flex flex-col z-50 overflow-hidden transition-all">
      <div className="flex items-center justify-between p-4 border-b border-[#333331] bg-[#242423]/50 backdrop-blur-md">
        <h2 className="text-lg font-serif italic text-[#E8E8E6]">Editar Vínculo</h2>
        <button onClick={onClose} className="p-1 hover:bg-[#2C2C2B] rounded-full text-[#9C9C98]">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9C9C98] mb-1">Tipo de Vínculo</label>
            <select 
              value={data.type || 'relationship'} 
              onChange={e => handleUpdate('type', e.target.value as RelationshipType)}
              className="w-full px-3 py-2 bg-[#242423] border border-[#333331] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C5C5BC] text-sm text-[#E8E8E6]"
            >
              <option value="relationship">Relación General</option>
              <option value="marriage">Matrimonio / Unión</option>
              <option value="divorce">Divorcio / Separación</option>
              <option value="conflict">Conflicto</option>
              <option value="cutoff">Corte Emocional</option>
              <option value="parent_child">Padres a Hijos (Normal)</option>
              <option value="adopted">Adopción</option>
              <option value="twins">Gemelos</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9C9C98] mb-1">Etiqueta (opcional)</label>
            <input 
              type="text" 
              value={data.label || ''} 
              onChange={e => handleUpdate('label', e.target.value)}
              className="w-full px-3 py-2 bg-[#242423] border border-[#333331] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C5C5BC] text-sm text-[#E8E8E6]"
              placeholder="ej. m. 1965"
            />
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-[#333331] bg-[#242423]/50 backdrop-blur-md">
        <button 
          onClick={() => {
            deleteEdge(id);
            onClose();
          }}
          className="w-full py-2.5 px-4 bg-[#242423] border border-[#E06A47]/30 text-[#E06A47] rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-[#E06A47] hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={14} />
          Eliminar Vínculo
        </button>
      </div>
    </div>
  );
}
