import React, { useState, useRef, useEffect } from 'react';
import { useGenogramStore } from '../store/useGenogramStore';
import { v4 as uuidv4 } from 'uuid';
import { Download, Eye, Layers, Image as ImageIcon, FileText, FilePlus, Save, FolderOpen, Sparkles, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export function Toolbar({ onOpenDetection }: { onOpenDetection?: () => void }) {
  const { addNode, isGenosociogramMode, toggleMode, clearAll, loadExample, importData, exportData } = useGenogramStore();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNew = () => {
    if (confirm('¿Empezar un genograma nuevo? Se borrará el trabajo actual del lienzo.')) {
      clearAll();
    }
  };

  const handleSaveJson = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    link.download = `genograma-${stamp}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
          importData(parsed);
        } else {
          alert('El archivo no tiene el formato de un genograma válido.');
        }
      } catch {
        alert('No se pudo leer el archivo. ¿Es un JSON de genograma válido?');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

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
        backgroundColor: 'var(--bg)',
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
    <div className="toolbar-export absolute top-6 left-1/2 -translate-x-1/2 bg-[var(--surface)]/80 backdrop-blur-xl border border-[var(--border)]/60 p-1.5 rounded-2xl shadow-xl flex items-center gap-2 z-40">
      
      <div className="flex items-center gap-1 bg-[var(--bg)]/80 p-1 rounded-xl">
        <button 
          onClick={() => handleAddPerson('male')}
          className="flex items-center justify-center p-2 rounded-md hover:bg-[var(--surface)] hover:shadow-sm text-[var(--text-2)] transition-all group relative"
          title="Añadir Hombre"
        >
          <div className="w-5 h-5 border-2 border-current rounded-sm"></div>
        </button>
        <button 
          onClick={() => handleAddPerson('female')}
          className="flex items-center justify-center p-2 rounded-md hover:bg-[var(--surface)] hover:shadow-sm text-[var(--text-2)] transition-all"
          title="Añadir Mujer"
        >
          <div className="w-5 h-5 border-2 border-current rounded-full"></div>
        </button>
        <button 
          onClick={() => handleAddPerson('unknown')}
          className="flex items-center justify-center p-2 rounded-md hover:bg-[var(--surface)] hover:shadow-sm text-[var(--text-2)] transition-all"
          title="Añadir Desconocido"
        >
          <div className="w-5 h-5 border-2 border-current rounded-sm rotate-45 scale-75 origin-center"></div>
        </button>
      </div>

      <div className="w-px h-8 bg-[var(--border)] mx-2"></div>

      {/* Archivo: nuevo, ejemplo, guardar, cargar */}
      <div className="flex items-center gap-1 bg-[var(--bg)]/80 p-1 rounded-xl">
        <button
          onClick={handleNew}
          className="flex items-center justify-center p-2 rounded-md hover:bg-[var(--surface)] text-[var(--text-2)] transition-all"
          title="Nuevo (empezar en blanco)"
        >
          <FilePlus size={18} />
        </button>
        <button
          onClick={loadExample}
          className="flex items-center justify-center p-2 rounded-md hover:bg-[var(--surface)] text-[var(--text-2)] transition-all"
          title="Cargar ejemplo"
        >
          <Sparkles size={18} />
        </button>
        <button
          onClick={handleSaveJson}
          className="flex items-center justify-center p-2 rounded-md hover:bg-[var(--surface)] text-[var(--text-2)] transition-all"
          title="Guardar en archivo (.json)"
        >
          <Save size={18} />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center p-2 rounded-md hover:bg-[var(--surface)] text-[var(--text-2)] transition-all"
          title="Cargar archivo (.json)"
        >
          <FolderOpen size={18} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleLoadJson}
          className="hidden"
        />
      </div>

      <div className="w-px h-8 bg-[var(--border)] mx-2"></div>

      <button
        onClick={toggleMode}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all",
          isGenosociogramMode 
            ? "bg-[var(--text-2)] text-[var(--bg)] shadow-inner" 
            : "bg-transparent text-[var(--text-3)] hover:bg-[var(--surface-2)] border border-transparent hover:text-[var(--text-2)]"
        )}
      >
        {isGenosociogramMode ? <Layers size={16} /> : <Eye size={16} />}
        {isGenosociogramMode ? 'Genosociograma' : 'Estándar'}
      </button>

      <button
        onClick={onOpenDetection}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--terra)] transition-all"
        title="Método de detección de patrones (A / R / E)"
      >
        <Search size={16} />
        Patrones
      </button>

      <div className="w-px h-8 bg-[var(--border)] mx-1"></div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
            showExportMenu 
              ? "bg-[var(--text-2)] text-[var(--bg)]" 
              : "text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-[var(--surface-2)]"
          )}
          title="Exportar"
        >
          <Download size={16} />
        </button>
        
        {showExportMenu && (
          <div className="absolute top-full right-0 mt-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden min-w-[140px] flex flex-col z-50">
            <button 
              onClick={() => exportAsImage('png')}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--bg)] text-left transition-colors"
            >
              <ImageIcon size={16} className="text-[var(--text-3)]" />
              Exportar PNG
            </button>
            <div className="w-full h-px bg-[var(--border)]"></div>
            <button 
              onClick={() => exportAsImage('pdf')}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--bg)] text-left transition-colors"
            >
              <FileText size={16} className="text-[var(--text-3)]" />
              Exportar PDF
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
