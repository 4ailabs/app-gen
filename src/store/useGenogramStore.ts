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
}

const initialNodes: GenogramNode[] = [
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

const initialEdges: GenogramEdge[] = [
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

export const useGenogramStore = create<GenogramState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  isGenosociogramMode: false,
  onNodesChange: (changes: NodeChange<GenogramNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange<GenogramEdge>[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({ 
        ...connection, 
        id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        type: 'relationship', 
        data: { type: 'marriage' } 
      }, get().edges),
    });
  },
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  updateNodeData: (id, data) => set({
    nodes: get().nodes.map(node => 
      node.id === id ? { ...node, data: { ...node.data, ...data } } : node
    )
  }),
  updateEdgeData: (id, data) => set({
    edges: get().edges.map(edge => 
      edge.id === id ? { ...edge, data: { ...edge.data, ...data } } : edge
    )
  }),
  deleteEdge: (id) => set((state) => ({
    edges: state.edges.filter((e) => e.id !== id)
  })),
  deleteNode: (id) => set((state) => ({
    nodes: state.nodes.filter((n) => n.id !== id),
    edges: state.edges.filter((e) => e.source !== id && e.target !== id)
  })),
  toggleMode: () => set((state) => {
    const newMode = !state.isGenosociogramMode;
    return {
      isGenosociogramMode: newMode,
      nodes: state.nodes.map(n => ({
        ...n,
        data: { ...n.data, isGenosociogramMode: newMode }
      }))
    };
  })
}));
