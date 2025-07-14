import React, { useRef, useState } from 'react';
import { FlowComponent } from '../types/FlowTypes';
import { ComponentNode } from './ComponentNode';
import { ConnectionLine } from './ConnectionLine';

interface FlowDesignerProps {
  components: FlowComponent[];
  selectedComponent: FlowComponent | null;
  onSelectComponent: (component: FlowComponent | null) => void;
  onUpdateComponent: (id: string, updates: Partial<FlowComponent>) => void;
  onDeleteComponent: (id: string) => void;
  onConnectComponents: (fromId: string, toId: string) => void;
  onAddComponent: (type: FlowComponent['type'], position: { x: number; y: number }) => void;
}

export const FlowDesigner: React.FC<FlowDesignerProps> = ({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  onConnectComponents,
  onAddComponent
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType') as FlowComponent['type'];
    
    if (componentType && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left - 75, // Center the component
        y: e.clientY - rect.top - 40
      };
      
      // Use the onAddComponent prop that's passed from the parent
      onAddComponent(componentType, position);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleMouseDown = (e: React.MouseEvent, componentId: string) => {
    if (e.button === 0) { // Left click
      const component = components.find(c => c.id === componentId);
      if (component) {
        setDraggedComponent(componentId);
        setDragOffset({
          x: e.clientX - component.position.x,
          y: e.clientY - component.position.y
        });
        onSelectComponent(component);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedComponent && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newPosition = {
        x: e.clientX - rect.left - dragOffset.x,
        y: e.clientY - rect.top - dragOffset.y
      };
      
      onUpdateComponent(draggedComponent, { position: newPosition });
    }
  };

  const handleMouseUp = () => {
    setDraggedComponent(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectComponent(null);
    }
  };

  const handleConnectionStart = (componentId: string) => {
    setConnecting(componentId);
  };

  const handleConnectionEnd = (componentId: string) => {
    if (connecting && connecting !== componentId) {
      onConnectComponents(connecting, componentId);
    }
    setConnecting(null);
  };

  return (
    <div className="flex-1 relative bg-gray-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div
        ref={canvasRef}
        className="w-full h-full relative overflow-hidden cursor-default"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* Connection Lines */}
        {components.map(component =>
          component.connections.map(targetId => {
            const target = components.find(c => c.id === targetId);
            if (!target) return null;
            
            return (
              <ConnectionLine
                key={`${component.id}-${targetId}`}
                from={component.position}
                to={target.position}
              />
            );
          })
        )}
        
        {/* Components */}
        {components.map(component => (
          <ComponentNode
            key={component.id}
            component={component}
            isSelected={selectedComponent?.id === component.id}
            isConnecting={connecting === component.id}
            onMouseDown={(e) => handleMouseDown(e, component.id)}
            onDelete={() => onDeleteComponent(component.id)}
            onConnectionStart={() => handleConnectionStart(component.id)}
            onConnectionEnd={() => handleConnectionEnd(component.id)}
          />
        ))}
        
        {components.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-gray-300 mb-4">🔄</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Start Building Your SSIS Flow
              </h3>
              <p className="text-gray-500 max-w-md">
                Drag components from the library on the left to create your data flow. 
                Connect them together to define your ETL process.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};