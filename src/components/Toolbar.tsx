import React, { useState, useRef, useEffect } from 'react';
import { useGenogramStore } from '../store/useGenogramStore';
import { v4 as uuidv4 } from 'uuid';
import { Download, Eye, Layers, Image as ImageIcon, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export function Toolbar() {
  const { addNode, isGenosociogramMode, toggleMode } = useGenogramStore();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleAddPerson = (gender: 'male' | 'female' | 'unknown') => {
    const id = uuidv4();
    addNode({
      id,
      type: 'person',
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: {
        id,
        name: 'Nueva Persona',
        gender,
        status: 'alive',
        events: [],
        isGenosociogramMode
      }
    });
  };

  const exportAsImage = async (format: 'png' | 'pdf') => {
    setShowExportMenu(false);
    // Give state a moment to update and hide the menu before capturing
    await new Promise(r => setTimeout(r, 50));

    const exportContainer = document.querySelector('#export-container') as HTMLElement;
    if (!exportContainer) return;

    // Temporarily hide UI elements that shouldn't be in the export
    const elementsToHide = document.querySelectorAll('.react-flow__panel, .no-export, .toolbar-export, .react-flow__handle');
    elementsToHide.forEach((p) => ((p as HTMLElement).style.display = 'none'));

    try {
      const dataUrl = await toPng(exportContainer, {
        backgroundColor: '#1A1A19',
        width: exportContainer.offsetWidth,
        height: exportContainer.offsetHeight,
        style: {
          width: `${exportContainer.offsetWidth}px`,
          height: `${exportContainer.offsetHeight}px`,
        },
      });

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = 'genograma.png';
        link.href = dataUrl;
        link.click();
      } else if (format === 'pdf') {
        const pdf = new jsPDF({
          orientation: exportContainer.offsetWidth > exportContainer.offsetHeight ? 'landscape' : 'portrait',
          unit: 'px',
          format: [exportContainer.offsetWidth, exportContainer.offsetHeight]
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, exportContainer.offsetWidth, exportContainer.offsetHeight);
        pdf.save('genograma.pdf');
      }
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      // Restore UI elements
      elementsToHide.forEach((p) => ((p as HTMLElement).style.display = ''));
    }
  };

  return (
    <div className="toolbar-export absolute top-6 left-1/2 -translate-x-1/2 bg-[#242423]/80 backdrop-blur-xl border border-[#333331]/60 p-1.5 rounded-2xl shadow-xl flex items-center gap-2 z-40">
      
      <div className="flex items-center gap-1 bg-[#1A1A19]/80 p-1 rounded-xl">
        <button 
          onClick={() => handleAddPerson('male')}
          className="flex items-center justify-center p-2 rounded-md hover:bg-[#242423] hover:shadow-sm text-[#C5C5BC] transition-all group relative"
          title="Añadir Hombre"
        >
          <div className="w-5 h-5 border-2 border-current rounded-sm"></div>
        </button>
        <button 
          onClick={() => handleAddPerson('female')}
          className="flex items-center justify-center p-2 rounded-md hover:bg-[#242423] hover:shadow-sm text-[#C5C5BC] transition-all"
          title="Añadir Mujer"
        >
          <div className="w-5 h-5 border-2 border-current rounded-full"></div>
        </button>
        <button 
          onClick={() => handleAddPerson('unknown')}
          className="flex items-center justify-center p-2 rounded-md hover:bg-[#242423] hover:shadow-sm text-[#C5C5BC] transition-all"
          title="Añadir Desconocido"
        >
          <div className="w-5 h-5 border-2 border-current rounded-sm rotate-45 scale-75 origin-center"></div>
        </button>
      </div>

      <div className="w-px h-8 bg-[#333331] mx-2"></div>

      <button
        onClick={toggleMode}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all",
          isGenosociogramMode 
            ? "bg-[#C5C5BC] text-[#1A1A19] shadow-inner" 
            : "bg-transparent text-[#9C9C98] hover:bg-[#2C2C2B] border border-transparent hover:text-[#C5C5BC]"
        )}
      >
        {isGenosociogramMode ? <Layers size={16} /> : <Eye size={16} />}
        {isGenosociogramMode ? 'Genosociograma' : 'Estándar'}
      </button>

      <div className="w-px h-8 bg-[#333331] mx-1"></div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
            showExportMenu 
              ? "bg-[#C5C5BC] text-[#1A1A19]" 
              : "text-[#9C9C98] hover:text-[#C5C5BC] hover:bg-[#2C2C2B]"
          )}
          title="Exportar"
        >
          <Download size={16} />
        </button>
        
        {showExportMenu && (
          <div className="absolute top-full right-0 mt-2 bg-[#242423] border border-[#333331] rounded-xl shadow-xl overflow-hidden min-w-[140px] flex flex-col z-50">
            <button 
              onClick={() => exportAsImage('png')}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#E8E8E6] hover:bg-[#1A1A19] text-left transition-colors"
            >
              <ImageIcon size={16} className="text-[#9C9C98]" />
              Exportar PNG
            </button>
            <div className="w-full h-px bg-[#333331]"></div>
            <button 
              onClick={() => exportAsImage('pdf')}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#E8E8E6] hover:bg-[#1A1A19] text-left transition-colors"
            >
              <FileText size={16} className="text-[#9C9C98]" />
              Exportar PDF
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
