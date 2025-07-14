import React from 'react';
import { 
  Database, 
  FileText, 
  Transform, 
  GitBranch, 
  Search, 
  BarChart3,
  Download,
  Upload,
  Filter
} from 'lucide-react';
import { FlowComponent } from '../types/FlowTypes';

interface ComponentLibraryProps {
  onAddComponent: (type: FlowComponent['type'], position: { x: number; y: number }) => void;
}

const componentTypes = [
  {
    category: 'Sources',
    components: [
      {
        type: 'source' as const,
        name: 'OLE DB Source',
        icon: Database,
        description: 'Extract data from SQL Server or other OLE DB sources'
      },
      {
        type: 'source' as const,
        name: 'Flat File Source',
        icon: FileText,
        description: 'Read data from CSV, TXT, or other flat files'
      }
    ]
  },
  {
    category: 'Transformations',
    components: [
      {
        type: 'transformation' as const,
        name: 'Data Conversion',
        icon: Transform,
        description: 'Convert data types and formats'
      },
      {
        type: 'conditional' as const,
        name: 'Conditional Split',
        icon: GitBranch,
        description: 'Route data based on conditions'
      },
      {
        type: 'lookup' as const,
        name: 'Lookup',
        icon: Search,
        description: 'Perform lookups against reference data'
      },
      {
        type: 'aggregate' as const,
        name: 'Aggregate',
        icon: BarChart3,
        description: 'Group and aggregate data'
      }
    ]
  },
  {
    category: 'Destinations',
    components: [
      {
        type: 'destination' as const,
        name: 'OLE DB Destination',
        icon: Download,
        description: 'Load data into SQL Server or other OLE DB destinations'
      },
      {
        type: 'destination' as const,
        name: 'Flat File Destination',
        icon: Upload,
        description: 'Write data to CSV, TXT, or other flat files'
      }
    ]
  }
];

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onAddComponent }) => {
  const handleDragStart = (e: React.DragEvent, type: FlowComponent['type']) => {
    e.dataTransfer.setData('componentType', type);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Component Library</h2>
      
      <div className="space-y-6">
        {componentTypes.map((category) => (
          <div key={category.category}>
            <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
              {category.category}
            </h3>
            <div className="space-y-2">
              {category.components.map((component) => {
                const IconComponent = component.icon;
                return (
                  <div
                    key={component.name}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component.type)}
                    className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-blue-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                          {component.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {component.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">How to use</h4>
        <p className="text-xs text-blue-700 leading-relaxed">
          Drag components from this library onto the canvas to build your SSIS data flow. 
          Connect components by clicking and dragging between their connection points.
        </p>
      </div>
    </div>
  );
};