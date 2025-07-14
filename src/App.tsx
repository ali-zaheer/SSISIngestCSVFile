import React, { useState } from 'react';
import { FlowDesigner } from './components/FlowDesigner';
import { ComponentLibrary } from './components/ComponentLibrary';
import { PropertiesPanel } from './components/PropertiesPanel';
import { CodeGenerator } from './components/CodeGenerator';
import { Header } from './components/Header';
import { FlowComponent } from './types/FlowTypes';

function App() {
  const [components, setComponents] = useState<FlowComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<FlowComponent | null>(null);
  const [activeTab, setActiveTab] = useState<'designer' | 'code'>('designer');

  const addComponent = (type: FlowComponent['type'], position: { x: number; y: number }) => {
    const newComponent: FlowComponent = {
      id: `${type}_${Date.now()}`,
      type,
      position,
      properties: getDefaultProperties(type),
      connections: []
    };
    setComponents([...components, newComponent]);
  };

  const updateComponent = (id: string, updates: Partial<FlowComponent>) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ));
    if (selectedComponent?.id === id) {
      setSelectedComponent({ ...selectedComponent, ...updates });
    }
  };

  const deleteComponent = (id: string) => {
    setComponents(components.filter(comp => comp.id !== id));
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  const connectComponents = (fromId: string, toId: string) => {
    setComponents(components.map(comp => {
      if (comp.id === fromId) {
        return {
          ...comp,
          connections: [...comp.connections, toId]
        };
      }
      return comp;
    }));
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'designer' ? (
          <>
            <ComponentLibrary onAddComponent={addComponent} />
            
            <div className="flex-1 flex flex-col">
              <FlowDesigner
                components={components}
                selectedComponent={selectedComponent}
                onSelectComponent={setSelectedComponent}
                onUpdateComponent={updateComponent}
                onDeleteComponent={deleteComponent}
                onConnectComponents={connectComponents}
              />
            </div>
            
            <PropertiesPanel
              selectedComponent={selectedComponent}
              onUpdateComponent={updateComponent}
            />
          </>
        ) : (
          <CodeGenerator components={components} />
        )}
      </div>
    </div>
  );
}

function getDefaultProperties(type: FlowComponent['type']): Record<string, any> {
  switch (type) {
    case 'source':
      return {
        name: 'Data Source',
        connectionString: '',
        query: 'SELECT * FROM table',
        sourceType: 'database'
      };
    case 'destination':
      return {
        name: 'Data Destination',
        connectionString: '',
        tableName: '',
        destinationType: 'database'
      };
    case 'transformation':
      return {
        name: 'Data Transformation',
        transformationType: 'derived_column',
        expression: ''
      };
    case 'conditional':
      return {
        name: 'Conditional Split',
        conditions: [{ name: 'Default', expression: '' }]
      };
    case 'lookup':
      return {
        name: 'Lookup',
        lookupTable: '',
        joinColumns: []
      };
    case 'aggregate':
      return {
        name: 'Aggregate',
        groupBy: [],
        aggregations: []
      };
    default:
      return { name: 'Component' };
  }
}

export default App;