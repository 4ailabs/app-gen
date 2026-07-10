/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { ReactFlow, ReactFlowProvider, Background, Controls, NodeMouseHandler, EdgeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGenogramStore } from './store/useGenogramStore';
import { PersonNode } from './components/PersonNode';
import { RelationshipEdge } from './components/RelationshipEdge';
import { Toolbar } from './components/Toolbar';
import { EditPanel } from './components/EditPanel';
import { EditEdgePanel } from './components/EditEdgePanel';
import { Legend } from './components/Legend';
import { NodeData, EdgeData } from './types';

const nodeTypes = {
  person: PersonNode,
};

const edgeTypes = {
  relationship: RelationshipEdge,
};

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, updateNodeData, updateEdgeData } = useGenogramStore();
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    // We handle edit through the edit button inside the node, but could also do it here
    setEditingEdgeId(null);
  }, []);

  const onEdgeClick: EdgeMouseHandler = useCallback((_, edge) => {
    setEditingEdgeId(edge.id);
    setEditingNodeId(null);
  }, []);

  const handleEditRequest = useCallback((id: string) => {
    setEditingNodeId(id);
    setEditingEdgeId(null);
  }, []);

  // Inject the onEdit handler into the nodes data
  const nodesWithHandlers = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onEdit: handleEditRequest
    }
  }));

  const editingNode = nodes.find(n => n.id === editingNodeId)?.data as NodeData | undefined;
  const editingEdge = edges.find(e => e.id === editingEdgeId)?.data;

  return (
    <div className="w-full h-screen bg-[#1A1A19] overflow-hidden flex flex-col font-sans text-[#E8E8E6]">
      <header className="h-20 border-b border-[#333331] flex items-center justify-between px-8 bg-[#242423]/50 backdrop-blur-sm shrink-0 z-10 relative">
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-10 h-10">
            <g transform="translate(80,80)">
              <circle cx="0" cy="-50" r="8" fill="#D6705A"/>
              <circle cx="25" cy="-43.3" r="8" fill="#8FA87A"/>
              <circle cx="43.3" cy="-25" r="8" fill="#D6705A"/>
              <circle cx="50" cy="0" r="8" fill="#8FA87A"/>
              <circle cx="43.3" cy="25" r="8" fill="#D6705A"/>
              <circle cx="25" cy="43.3" r="8" fill="#8FA87A"/>
              <circle cx="0" cy="50" r="8" fill="#D6705A"/>
              <circle cx="-25" cy="43.3" r="8" fill="#8FA87A"/>
              <circle cx="-43.3" cy="25" r="8" fill="#D6705A"/>
              <circle cx="-50" cy="0" r="8" fill="#8FA87A"/>
              <circle cx="-43.3" cy="-25" r="8" fill="#D6705A"/>
              <circle cx="-25" cy="-43.3" r="8" fill="#8FA87A"/>
              <circle cx="0" cy="0" r="5" fill="#E8A857" opacity="0.5"/>
              <circle cx="0" cy="0" r="3" fill="#E8A857"/>
            </g>
          </svg>
          <div>
            <h1 className="text-xl font-serif italic tracking-tight text-[#E8E8E6]">Bioenergética Transgeneracional</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#9C9C98] font-bold">Instituto Centrobioenergética</p>
          </div>
        </div>
        <div className="flex items-center">
          <svg className="w-10 h-10" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="8" r="3.5" stroke="#8FA87A" strokeWidth="1.6"/>
            <circle cx="34" cy="8" r="3.5" stroke="#8FA87A" strokeWidth="1.6"/>
            <circle cx="22" cy="24" r="4.2" fill="#8FA87A" opacity="0.18" stroke="#8FA87A" strokeWidth="1.6"/>
            <path d="M10 11.5 V17 H34 V11.5" stroke="#8FA87A" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M22 17 V19.8" stroke="#8FA87A" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M22 28.2 V33" stroke="#8FA87A" strokeWidth="1.4" strokeLinecap="round"/>
            <circle cx="22" cy="37.5" r="3" fill="#8FA87A"/>
          </svg>
        </div>
      </header>

      <div id="export-container" className="flex-1 relative w-full h-full overflow-hidden">
        <Toolbar />
        
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          fitView
          className="bg-[#1A1A19]"
          defaultEdgeOptions={{ type: 'relationship' }}
        >
          <Background color="#333331" gap={40} size={2} />
          <Controls className="bg-[#242423] border-[#333331] shadow-sm rounded-md" />
        </ReactFlow>

        {editingNodeId && editingNode && (
          <div className="no-export">
            <EditPanel 
              data={editingNode} 
              onClose={() => setEditingNodeId(null)}
              onUpdate={updateNodeData}
            />
          </div>
        )}

        {editingEdgeId && editingEdge && (
          <div className="no-export">
            <EditEdgePanel
              id={editingEdgeId}
              data={editingEdge as EdgeData}
              onClose={() => setEditingEdgeId(null)}
              onUpdate={updateEdgeData}
            />
          </div>
        )}
        <Legend />
        <div className="absolute bottom-6 right-6 text-[10px] text-[#9C9C98] font-bold tracking-wider uppercase pointer-events-none z-50 select-none">
          Creador: Dr. Miguel Ojeda Rios | 4ailabs
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
