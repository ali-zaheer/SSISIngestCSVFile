import React from 'react';
import { Database, Code, Download, Upload, Play } from 'lucide-react';

interface HeaderProps {
  activeTab: 'designer' | 'code';
  setActiveTab: (tab: 'designer' | 'code') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Database className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SSIS Flow Designer</h1>
          </div>
          
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('designer')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'designer'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Designer
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'code'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Code className="w-4 h-4 inline mr-2" />
              Code
            </button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
            <Play className="w-4 h-4 mr-2" />
            Validate
          </button>
        </div>
      </div>
    </header>
  );
};