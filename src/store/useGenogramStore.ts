import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { NodeData, EdgeData } from '../types';

export type GenogramNode = Node<NodeData>;
export type GenogramEdge = Edge<EdgeData>;

const STORAGE_KEY = 'genograma-instituto-v1';

interface GenogramState {
  nodes: GenogramNode[];
  edges: GenogramEdge[];
  isGenosociogramMode: boolean;
  onNodesChange: OnNodesChange<GenogramNode>;
  onEdgesChange: OnEdgesChange<GenogramEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: GenogramNode[]) => void;
  setEdges: (edges: GenogramEdge[]) => void;
  addNode: (node: GenogramNode) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  updateEdgeData: (id: string, data: Partial<EdgeData>) => void;
  toggleMode: () => void;
  deleteEdge: (id: string) => void;
  deleteNode: (id: string) => void;
  // clase: guardar/cargar/limpiar
  clearAll: () => void;
  loadExample: () => void;
  importData: (data: { nodes: GenogramNode[]; edges: GenogramEdge[] }) => void;
  exportData: () => { nodes: GenogramNode[]; edges: GenogramEdge[] };
}

const exampleNodes: GenogramNode[] = [
  {
    id: '1',
    type: 'person',
    position: { x: 250, y: 100 },
    data: {
      id: '1',
      name: 'Abuelo',
      gender: 'male',
      status: 'deceased',
      birthDate: '1940-01-01',
      deathDate: '2010-05-01',
      events: [],
    },
  },
  {
    id: '2',
    type: 'person',
    position: { x: 450, y: 100 },
    data: {
      id: '2',
      name: 'Abuela',
      gender: 'female',
      status: 'deceased',
      birthDate: '1945-06-15',
      deathDate: '2018-11-20',
      events: [],
    },
  },
  {
    id: '3',
    type: 'person',
    position: { x: 350, y: 250 },
    data: {
      id: '3',
      name: 'Padre',
      gender: 'male',
      status: 'alive',
      birthDate: '1970-08-22',
      events: [
        {
          id: 'e1',
          category: 'accident_illness',
          date: '2005-01-01',
          description: 'Accidente automovilístico'
        }
      ],
    },
  },
];

const exampleEdges: GenogramEdge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'relationship',
    sourceHandle: 'right',
    targetHandle: 'left',
    data: { type: 'marriage', label: 'm. 1965' },
  },
  {
    id: 'e-parent-1',
    source: '1',
    target: '3',
    type: 'relationship',
    data: { type: 'parent_child' },
  },
  {
    id: 'e-parent-2',
    source: '2',
    target: '3',
    type: 'relationship',
    data: { type: 'parent_child' },
  }
];

// --- Persistencia en localStorage ---
function loadFromStorage(): { nodes: GenogramNode[]; edges: GenogramEdge[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) return parsed;
  } catch {
    /* ignora datos corruptos */
  }
  return null;
}

function saveToStorage(nodes: GenogramNode[], edges: GenogramEdge[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
  } catch {
    /* almacenamiento no disponible */
  }
}

// Estado inicial: lo guardado del estudiante, o vacío (arranca en blanco para clase).
const saved = typeof window !== 'undefined' ? loadFromStorage() : null;
const startNodes: GenogramNode[] = saved ? saved.nodes : [];
const startEdges: GenogramEdge[] = saved ? saved.edges : [];

export const useGenogramStore = create<GenogramState>((set, get) => ({
  nodes: startNodes,
  edges: startEdges,
  isGenosociogramMode: false,
  onNodesChange: (changes: NodeChange<GenogramNode>[]) => {
    const nodes = applyNodeChanges(changes, get().nodes);
    set({ nodes });
    saveToStorage(nodes, get().edges);
  },
  onEdgesChange: (changes: EdgeChange<GenogramEdge>[]) => {
    const edges = applyEdgeChanges(changes, get().edges);
    set({ edges });
    saveToStorage(get().nodes, edges);
  },
  onConnect: (connection: Connection) => {
    const edges = addEdge({
      ...connection,
      id: `e-${connection.source}-${connection.target}-${Date.now()}`,
      type: 'relationship',
      data: { type: 'marriage' }
    }, get().edges);
    set({ edges });
    saveToStorage(get().nodes, edges);
  },
  setNodes: (nodes) => { set({ nodes }); saveToStorage(nodes, get().edges); },
  setEdges: (edges) => { set({ edges }); saveToStorage(get().nodes, edges); },
  addNode: (node) => {
    const nodes = [...get().nodes, node];
    set({ nodes });
    saveToStorage(nodes, get().edges);
  },
  updateNodeData: (id, data) => {
    const nodes = get().nodes.map(node =>
      node.id === id ? { ...node, data: { ...node.data, ...data } } : node
    );
    set({ nodes });
    saveToStorage(nodes, get().edges);
  },
  updateEdgeData: (id, data) => {
    const edges = get().edges.map(edge =>
      edge.id === id ? { ...edge, data: { ...edge.data, ...data } } : edge
    );
    set({ edges });
    saveToStorage(get().nodes, edges);
  },
  deleteEdge: (id) => {
    const edges = get().edges.filter((e) => e.id !== id);
    set({ edges });
    saveToStorage(get().nodes, edges);
  },
  deleteNode: (id) => {
    const nodes = get().nodes.filter((n) => n.id !== id);
    const edges = get().edges.filter((e) => e.source !== id && e.target !== id);
    set({ nodes, edges });
    saveToStorage(nodes, edges);
  },
  toggleMode: () => set((state) => {
    const newMode = !state.isGenosociogramMode;
    const nodes = state.nodes.map(n => ({
      ...n,
      data: { ...n.data, isGenosociogramMode: newMode }
    }));
    saveToStorage(nodes, state.edges);
    return { isGenosociogramMode: newMode, nodes };
  }),
  // --- Acciones para clase ---
  clearAll: () => {
    set({ nodes: [], edges: [] });
    saveToStorage([], []);
  },
  loadExample: () => {
    const nodes = exampleNodes.map(n => ({ ...n, data: { ...n.data, isGenosociogramMode: get().isGenosociogramMode } }));
    set({ nodes, edges: exampleEdges });
    saveToStorage(nodes, exampleEdges);
  },
  importData: (data) => {
    const nodes = (data.nodes || []).map(n => ({ ...n, data: { ...n.data, isGenosociogramMode: get().isGenosociogramMode } }));
    const edges = data.edges || [];
    set({ nodes, edges });
    saveToStorage(nodes, edges);
  },
  exportData: () => ({ nodes: get().nodes, edges: get().edges }),
}));
