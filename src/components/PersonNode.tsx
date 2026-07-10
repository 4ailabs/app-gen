import { Handle, Position } from '@xyflow/react';
import { NodeData } from '../types';
import { calculateAge, cn } from '../lib/utils';
import { Edit2, AlertCircle } from 'lucide-react';

export function PersonNode({ data, selected }: { data: NodeData; selected: boolean }) {
  const age = calculateAge(data.birthDate || '', data.deathDate || '');
  
  const getInitials = (name: string) => {
    if (!name || name === 'Desconocido' || name === 'Nueva Persona') return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getShapeClasses = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'rounded-none aspect-square w-16 bg-[#242423] border-[3px] border-[#C5C5BC]';
      case 'female':
        return 'rounded-full aspect-square w-16 bg-[#242423] border-[3px] border-[#C5C5BC]';
      case 'unknown':
        return 'rotate-45 aspect-square rounded-sm w-12 bg-[#242423] border-[3px] border-[#C5C5BC]';
      case 'pregnancy':
        return 'w-14 aspect-square'; // Wrapper only
      case 'miscarriage':
        return 'rounded-full aspect-square w-6 bg-[#C5C5BC]';
      case 'abortion':
        return 'rounded-full aspect-square w-6 bg-[#C5C5BC] relative';
      case 'stillbirth':
        return 'rounded-none aspect-square w-16 bg-[#242423] border-[3px] border-[#C5C5BC]';
      default:
        return 'rounded-none aspect-square w-16 bg-[#242423] border-[3px] border-[#C5C5BC]';
    }
  };

  const hasTraumaEvents = data.events?.some(e => 
    ['death_loss', 'violence', 'abuse', 'abandonment_rejection'].includes(e.category)
  );

  const isSpecialShape = ['pregnancy', 'abortion', 'miscarriage', 'stillbirth'].includes(data.gender);
  const isDeceased = data.status === 'deceased';

  return (
    <div className={cn(
      "relative group flex flex-col items-center justify-center min-w-[120px] transition-all",
      selected ? "z-50" : "z-10"
    )}>
      <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Name and Age Label - Top */}
      <div className="absolute -top-10 text-center w-max whitespace-nowrap z-20">
        <span className="text-xs font-bold uppercase tracking-tighter text-[#E8E8E6] bg-[#242423]/90 px-2 py-0.5 rounded shadow-sm backdrop-blur-md border border-[#333331]">
          {data.name || 'Desconocido'} {age !== null && <span className="text-[#9C9C98] font-normal ml-1">({age})</span>}
        </span>
      </div>

      {/* Main Shape */}
      <div className={cn(
        "relative flex items-center justify-center transition-all duration-300",
        getShapeClasses(data.gender),
        selected && !isSpecialShape ? 'shadow-2xl scale-110 ring-8 ring-[#1A1A19]' : 'hover:scale-105 shadow-md',
        selected && isSpecialShape ? 'scale-125 drop-shadow-xl' : '',
        !isSpecialShape && data.status === 'deceased' && 'bg-[#2C2C2B]'
      )}>
        {/* Pregnancy Triangle SVG */}
        {data.gender === 'pregnancy' && (
          <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full text-[#C5C5BC]">
            <polygon points="12,2 22,22 2,22" fill={selected ? "#1A1A19" : "#242423"} stroke="currentColor" strokeWidth="2.5"/>
          </svg>
        )}

        {/* Abortion Diagonal SVG */}
        {data.gender === 'abortion' && (
          <svg viewBox="0 0 24 24" className="absolute inset-[-12px] w-[calc(100%+24px)] h-[calc(100%+24px)] text-[#D6705A] pointer-events-none">
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        )}

        {/* Deceased / Stillbirth Cross */}
        {(isDeceased || data.gender === 'stillbirth') && data.gender !== 'abortion' && data.gender !== 'pregnancy' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[inherit]">
            <div className="absolute w-[150%] h-[2.5px] bg-[#C5C5BC] rotate-45" />
            <div className="absolute w-[150%] h-[2.5px] bg-[#C5C5BC] -rotate-45" />
          </div>
        )}
        
        {/* Inner Content (for the diamond, we need to un-rotate the content) */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center",
          data.gender === 'unknown' && "-rotate-45"
        )}>
          {data.hasUnknownInfo ? (
            <span className="font-serif italic text-3xl font-bold text-[#9C9C98]">
              ?
            </span>
          ) : !isSpecialShape && getInitials(data.name) ? (
            <span className="font-serif italic text-xl text-[#C5C5BC]/80 mt-1">
              {getInitials(data.name)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Dates Label - Bottom */}
      {(data.birthDate || data.deathDate || data.birthDateUnknown || data.deathDateUnknown || data.status === 'deceased') && (
        <div className="absolute -bottom-8 text-center w-max whitespace-nowrap">
          <span className="text-[10px] text-[#9C9C98] font-bold tracking-widest">
            {data.birthDateUnknown ? '?' : data.birthDate ? new Date(data.birthDate).getFullYear() : ((data.deathDate || data.deathDateUnknown || data.status === 'deceased') ? '?' : '')}
            {(data.deathDate || data.deathDateUnknown || data.status === 'deceased') ? ` — ${data.deathDateUnknown ? '?' : data.deathDate ? new Date(data.deathDate).getFullYear() : '?'}` : ''}
          </span>
        </div>
      )}

      {/* Genosociogram Indicators */}
      {data.isGenosociogramMode && hasTraumaEvents && (
        <div className="absolute -right-3 -top-3 bg-[#E06A47] rounded-full p-1 shadow-lg ring-4 ring-[#1A1A19]">
          <AlertCircle size={14} className="text-white" />
        </div>
      )}

      {/* Edit Button (Visible on Hover/Select) */}
      <button 
        onClick={(e) => { e.stopPropagation(); data.onEdit?.(data.id); }}
        className={cn(
          "absolute -right-12 top-1/2 -translate-y-1/2 p-2 bg-[#242423] border border-[#333331] rounded-full text-[#9C9C98] hover:text-[#C5C5BC] hover:bg-[#1A1A19] hover:shadow-lg shadow-sm transition-all duration-200 nodrag cursor-pointer",
          selected ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-90 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0"
        )}
      >
        <Edit2 size={14} />
      </button>

      <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Right} id="right" className="opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="target" position={Position.Left} id="left" className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
