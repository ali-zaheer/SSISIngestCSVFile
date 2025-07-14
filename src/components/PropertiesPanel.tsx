import React from 'react';
import { Settings, Database, FileText, Code } from 'lucide-react';
import { FlowComponent } from '../types/FlowTypes';

interface PropertiesPanelProps {
  selectedComponent: FlowComponent | null;
  onUpdateComponent: (id: string, updates: Partial<FlowComponent>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  onUpdateComponent
}) => {
  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        </div>
        <div className="text-center py-12">
          <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Select a component to view its properties</p>
        </div>
      </div>
    );
  }

  const updateProperty = (key: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      properties: {
        ...selectedComponent.properties,
        [key]: value
      }
    });
  };

  const renderSourceProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Source Type
        </label>
        <select
          value={selectedComponent.properties.sourceType || 'database'}
          onChange={(e) => updateProperty('sourceType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="database">Database (OLE DB)</option>
          <option value="flatfile">Flat File (CSV/TXT)</option>
          <option value="excel">Excel File</option>
          <option value="xml">XML File</option>
        </select>
      </div>
      
      {selectedComponent.properties.sourceType === 'database' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connection String
            </label>
            <textarea
              value={selectedComponent.properties.connectionString || ''}
              onChange={(e) => updateProperty('connectionString', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Server=localhost;Database=MyDB;Integrated Security=true;"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SQL Query
            </label>
            <textarea
              value={selectedComponent.properties.query || ''}
              onChange={(e) => updateProperty('query', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              rows={4}
              placeholder="SELECT * FROM table_name"
            />
          </div>
        </>
      )}
      
      {selectedComponent.properties.sourceType === 'flatfile' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File Path
          </label>
          <input
            type="text"
            value={selectedComponent.properties.filePath || ''}
            onChange={(e) => updateProperty('filePath', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="C:\Data\input.csv"
          />
        </div>
      )}
    </div>
  );

  const renderDestinationProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destination Type
        </label>
        <select
          value={selectedComponent.properties.destinationType || 'database'}
          onChange={(e) => updateProperty('destinationType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="database">Database (OLE DB)</option>
          <option value="flatfile">Flat File (CSV/TXT)</option>
          <option value="excel">Excel File</option>
        </select>
      </div>
      
      {selectedComponent.properties.destinationType === 'database' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connection String
            </label>
            <textarea
              value={selectedComponent.properties.connectionString || ''}
              onChange={(e) => updateProperty('connectionString', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Server=localhost;Database=MyDB;Integrated Security=true;"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Table Name
            </label>
            <input
              type="text"
              value={selectedComponent.properties.tableName || ''}
              onChange={(e) => updateProperty('tableName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="dbo.target_table"
            />
          </div>
        </>
      )}
      
      {selectedComponent.properties.destinationType === 'flatfile' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File Path
          </label>
          <input
            type="text"
            value={selectedComponent.properties.filePath || ''}
            onChange={(e) => updateProperty('filePath', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="C:\Data\output.csv"
          />
        </div>
      )}
    </div>
  );

  const renderTransformationProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transformation Type
        </label>
        <select
          value={selectedComponent.properties.transformationType || 'derived_column'}
          onChange={(e) => updateProperty('transformationType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="derived_column">Derived Column</option>
          <option value="data_conversion">Data Conversion</option>
          <option value="sort">Sort</option>
          <option value="union_all">Union All</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expression
        </label>
        <textarea
          value={selectedComponent.properties.expression || ''}
          onChange={(e) => updateProperty('expression', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          rows={3}
          placeholder="UPPER([FirstName]) + ' ' + UPPER([LastName])"
        />
      </div>
    </div>
  );

  const renderComponentProperties = () => {
    switch (selectedComponent.type) {
      case 'source':
        return renderSourceProperties();
      case 'destination':
        return renderDestinationProperties();
      case 'transformation':
        return renderTransformationProperties();
      default:
        return (
          <div className="text-center py-8">
            <Code className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              Properties for {selectedComponent.type} components coming soon
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Component Name
          </label>
          <input
            type="text"
            value={selectedComponent.properties.name || ''}
            onChange={(e) => updateProperty('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter component name"
          />
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4 capitalize">
            {selectedComponent.type} Settings
          </h3>
          {renderComponentProperties()}
        </div>
      </div>
    </div>
  );
};