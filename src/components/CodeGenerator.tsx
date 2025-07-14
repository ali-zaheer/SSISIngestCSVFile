import React, { useState } from 'react';
import { Code, Download, Copy, Check } from 'lucide-react';
import { FlowComponent } from '../types/FlowTypes';

interface CodeGeneratorProps {
  components: FlowComponent[];
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({ components }) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'xml' | 'documentation'>('sql');
  const [copied, setCopied] = useState(false);

  const generateSQL = () => {
    if (components.length === 0) {
      return '-- No components to generate SQL for';
    }

    let sql = '-- Generated SQL for SSIS Data Flow\n';
    sql += '-- This is a representation of your data flow logic\n\n';

    components.forEach((component, index) => {
      sql += `-- Component ${index + 1}: ${component.properties.name || 'Unnamed'}\n`;
      
      switch (component.type) {
        case 'source':
          if (component.properties.sourceType === 'database') {
            sql += `-- Source Query:\n${component.properties.query || 'SELECT * FROM source_table'}\n\n`;
          } else {
            sql += `-- Flat File Source: ${component.properties.filePath || 'path/to/file.csv'}\n\n`;
          }
          break;
          
        case 'transformation':
          sql += `-- Transformation: ${component.properties.transformationType || 'derived_column'}\n`;
          if (component.properties.expression) {
            sql += `-- Expression: ${component.properties.expression}\n`;
          }
          sql += '\n';
          break;
          
        case 'destination':
          if (component.properties.destinationType === 'database') {
            sql += `-- Insert into: ${component.properties.tableName || 'target_table'}\n`;
            sql += `INSERT INTO ${component.properties.tableName || 'target_table'}\nSELECT * FROM previous_step;\n\n`;
          } else {
            sql += `-- Output to file: ${component.properties.filePath || 'path/to/output.csv'}\n\n`;
          }
          break;
      }
    });

    return sql;
  };

  const generateXML = () => {
    if (components.length === 0) {
      return '<!-- No components to generate XML for -->';
    }

    let xml = '<?xml version="1.0"?>\n';
    xml += '<!-- Generated SSIS Package Structure -->\n';
    xml += '<DTS:Executable xmlns:DTS="www.microsoft.com/SqlServer/Dts">\n';
    xml += '  <DTS:Executables>\n';
    xml += '    <DTS:Executable DTS:ExecutableType="Microsoft.Pipeline">\n';
    xml += '      <DTS:ObjectData>\n';
    xml += '        <pipeline version="1">\n';
    xml += '          <components>\n';

    components.forEach((component, index) => {
      xml += `            <!-- ${component.properties.name || 'Component'} -->\n`;
      xml += `            <component refId="Component_${index + 1}" name="${component.properties.name || 'Component'}">\n`;
      xml += `              <properties>\n`;
      
      Object.entries(component.properties).forEach(([key, value]) => {
        if (key !== 'name' && value) {
          xml += `                <property name="${key}">${value}</property>\n`;
        }
      });
      
      xml += `              </properties>\n`;
      xml += `            </component>\n`;
    });

    xml += '          </components>\n';
    xml += '        </pipeline>\n';
    xml += '      </DTS:ObjectData>\n';
    xml += '    </DTS:Executable>\n';
    xml += '  </DTS:Executables>\n';
    xml += '</DTS:Executable>';

    return xml;
  };

  const generateDocumentation = () => {
    if (components.length === 0) {
      return '# SSIS Data Flow Documentation\n\nNo components defined yet.';
    }

    let doc = '# SSIS Data Flow Documentation\n\n';
    doc += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    doc += `## Overview\n\nThis data flow contains ${components.length} component(s):\n\n`;

    components.forEach((component, index) => {
      doc += `### ${index + 1}. ${component.properties.name || 'Unnamed Component'}\n\n`;
      doc += `**Type:** ${component.type.charAt(0).toUpperCase() + component.type.slice(1)}\n\n`;
      
      switch (component.type) {
        case 'source':
          doc += `**Source Type:** ${component.properties.sourceType || 'database'}\n\n`;
          if (component.properties.sourceType === 'database') {
            doc += `**Connection:** ${component.properties.connectionString || 'Not specified'}\n\n`;
            doc += `**Query:**\n\`\`\`sql\n${component.properties.query || 'SELECT * FROM table'}\n\`\`\`\n\n`;
          } else {
            doc += `**File Path:** ${component.properties.filePath || 'Not specified'}\n\n`;
          }
          break;
          
        case 'transformation':
          doc += `**Transformation Type:** ${component.properties.transformationType || 'derived_column'}\n\n`;
          if (component.properties.expression) {
            doc += `**Expression:** \`${component.properties.expression}\`\n\n`;
          }
          break;
          
        case 'destination':
          doc += `**Destination Type:** ${component.properties.destinationType || 'database'}\n\n`;
          if (component.properties.destinationType === 'database') {
            doc += `**Connection:** ${component.properties.connectionString || 'Not specified'}\n\n`;
            doc += `**Table:** ${component.properties.tableName || 'Not specified'}\n\n`;
          } else {
            doc += `**File Path:** ${component.properties.filePath || 'Not specified'}\n\n`;
          }
          break;
      }
      
      if (component.connections.length > 0) {
        doc += `**Connected to:** ${component.connections.length} component(s)\n\n`;
      }
      
      doc += '---\n\n';
    });

    return doc;
  };

  const getContent = () => {
    switch (activeTab) {
      case 'sql':
        return generateSQL();
      case 'xml':
        return generateXML();
      case 'documentation':
        return generateDocumentation();
      default:
        return '';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadFile = () => {
    const content = getContent();
    const extension = activeTab === 'sql' ? 'sql' : activeTab === 'xml' ? 'xml' : 'md';
    const filename = `ssis-flow.${extension}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Generated Code</h2>
            </div>
            
            <nav className="flex space-x-1">
              {[
                { key: 'sql', label: 'SQL' },
                { key: 'xml', label: 'XML' },
                { key: 'documentation', label: 'Documentation' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={downloadFile}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <div className="h-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <pre className="h-full p-4 overflow-auto text-sm font-mono text-gray-800 whitespace-pre-wrap">
            {getContent()}
          </pre>
        </div>
      </div>
    </div>
  );
};