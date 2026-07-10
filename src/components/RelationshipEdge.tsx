import { BaseEdge, EdgeLabelRenderer, EdgeProps, Edge, getSmoothStepPath, getStraightPath } from '@xyflow/react';
import { EdgeData } from '../types';
import { useGenogramStore } from '../store/useGenogramStore';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

export function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  style = {},
  markerEnd,
  data,
}: EdgeProps<Edge<EdgeData>>) {
  const deleteEdge = useGenogramStore(s => s.deleteEdge);
  
  let edgePath, labelX, labelY;
  
  // Use StraightPath for twins (diagonal connecting to the same point)
  // Use SmoothStepPath (with 0 radius) for standard orthogonal genogram lines
  if (data?.type === 'twins') {
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  } else {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: 0,
    });
  }

  const getEdgeStyle = () => {
    switch (data?.type) {
      case 'marriage':
        return { ...style, strokeWidth: selected ? 3 : 2, stroke: selected ? '#E8E8E6' : '#C5C5BC' };
      case 'divorce':
        return { ...style, strokeWidth: selected ? 3 : 2, stroke: selected ? '#E8E8E6' : '#C5C5BC' }; // Solid line, but with slashes
      case 'conflict':
        return { ...style, strokeWidth: selected ? 3 : 2, stroke: '#E06A47', strokeDasharray: '4 4' };
      case 'cutoff':
        return { ...style, strokeWidth: selected ? 3 : 2, stroke: selected ? '#E8E8E6' : '#C5C5BC' }; // Solid with a cut
      case 'adopted':
        return { ...style, strokeWidth: selected ? 3 : 2, stroke: selected ? '#E8E8E6' : '#C5C5BC', strokeDasharray: '6 6' };
      case 'close':
        return { ...style, strokeWidth: selected ? 5 : 4, stroke: selected ? '#E8E8E6' : '#C5C5BC' };
      case 'parent_child':
      default:
        return { ...style, strokeWidth: selected ? 3 : 2, stroke: selected ? '#C5C5BC' : '#9C9C98' };
    }
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={getEdgeStyle()} id={id} />
      
      {/* Divorce Slashes */}
      {data?.type === 'divorce' && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <line x1="-6" y1="-10" x2="6" y2="10" stroke="#D6705A" strokeWidth="2.5" />
          <line x1="-14" y1="-10" x2="-2" y2="10" stroke="#D6705A" strokeWidth="2.5" />
        </g>
      )}

      {/* Cutoff (Corte emocional) Marks */}
      {data?.type === 'cutoff' && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <line x1="-12" y1="-10" x2="0" y2="10" stroke="#A65630" strokeWidth="2.5" />
          <line x1="0" y1="-10" x2="12" y2="10" stroke="#A65630" strokeWidth="2.5" />
          {/* Create a small gap effect by overlapping a white line or similar if needed, but the manual shows // cutting it */}
        </g>
      )}
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-300",
            selected ? "z-50" : "z-10"
          )}
        >
          {data?.label && (
            <div className="bg-[#1A1A19]/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm text-[#E8E8E6] border border-[#333331] font-bold tracking-widest uppercase text-[9px] min-w-max">
              {data.label}
            </div>
          )}
          
          <button 
            className={cn(
              "w-6 h-6 rounded-full bg-[#242423] shadow-lg border border-[#333331] flex items-center justify-center text-[#E06A47] hover:bg-[#E06A47] hover:text-white transition-all duration-200 cursor-pointer nodrag",
              selected ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none absolute"
            )}
            onClick={(e) => {
              e.stopPropagation();
              deleteEdge(id);
            }}
            title="Eliminar Conexión"
          >
            <X size={14} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
