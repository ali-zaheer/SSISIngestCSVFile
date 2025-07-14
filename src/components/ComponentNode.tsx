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
  Trash2,
  Circle
} from 'lucide-react';
import { FlowComponent } from '../types/FlowTypes';

interface ComponentNodeProps {
  component: FlowComponent;
  isSelected: boolean;
  isConnecting: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDelete: () => void;
  onConnectionStart: () => void;
  onConnectionEnd: () => void;
}

const getComponentIcon = (type: FlowComponent['type']) => {
  switch (type) {
    case 'source':
      return Database;
    case 'destination':
      return Download;
    case 'transformation':
      return Transform;
    case 'conditional':
      return GitBranch;
    case 'lookup':
      return Search;
    case 'aggregate':
      return BarChart3;
    default:
      return FileText;
  }
};

const getComponentColor = (type: FlowComponent['type']) => {
  switch (type) {
    case 'source':
      return 'bg-green-100 border-green-300 text-green-800';
    case 'destination':
      return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'transformation':
      return 'bg-purple-100 border-purple-300 text-purple-800';
    case 'conditional':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    case 'lookup':
      return 'bg-indigo-100 border-indigo-300 text-indigo-800';
    case 'aggregate':
      return 'bg-pink-100 border-pink-300 text-pink-800';
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};

export const ComponentNode: React.FC<ComponentNodeProps> = ({
  component,
  isSelected,
  isConnecting,
  onMouseDown,
  onDelete,
  onConnectionStart,
  onConnectionEnd
}) => {
  const IconComponent = getComponentIcon(component.type);
  const colorClass = getComponentColor(component.type);

  return (
    <div
      className={`absolute select-none group ${isSelected ? 'z-20' : 'z-10'}`}
      style={{
        left: component.position.x,
        top: component.position.y,
        transform: 'translate(0, 0)'
      }}
    >
      {/* Connection Points */}
      <div
        className={`absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-400 bg-white cursor-pointer hover:bg-blue-100 hover:border-blue-400 transition-colors ${
          isConnecting ? 'bg-blue-200 border-blue-500' : ''
        }`}
        onClick={onConnectionEnd}
        title="Input connection point"
      >
        <Circle className="w-2 h-2 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <div
        className={`absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-400 bg-white cursor-pointer hover:bg-green-100 hover:border-green-400 transition-colors ${
          isConnecting ? 'bg-green-200 border-green-500' : ''
        }`}
        onClick={onConnectionStart}
        title="Output connection point"
      >
        <Circle className="w-2 h-2 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Component Body */}
      <div
        className={`w-40 p-4 rounded-lg border-2 cursor-move transition-all duration-200 ${colorClass} ${
          isSelected 
            ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg' 
            : 'hover:shadow-md'
        }`}
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center space-x-3">
          <IconComponent className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {component.properties.name || 'Unnamed Component'}
            </p>
            <p className="text-xs opacity-75 capitalize">
              {component.type.replace('_', ' ')}
            </p>
          </div>
        </div>
        
        {/* Delete Button */}
        {isSelected && (
          <button
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete component"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};