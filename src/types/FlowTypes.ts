export interface FlowComponent {
  id: string;
  type: 'source' | 'destination' | 'transformation' | 'conditional' | 'lookup' | 'aggregate';
  position: { x: number; y: number };
  properties: Record<string, any>;
  connections: string[];
}

export interface ComponentType {
  type: FlowComponent['type'];
  name: string;
  icon: string;
  description: string;
  category: 'source' | 'destination' | 'transformation';
}