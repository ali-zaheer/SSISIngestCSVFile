import React from 'react';

interface ConnectionLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({ from, to }) => {
  // Calculate the connection points (right side of source, left side of destination)
  const startX = from.x + 160; // Component width + right connection point
  const startY = from.y + 40;  // Component height / 2
  const endX = to.x - 8;       // Left connection point
  const endY = to.y + 40;      // Component height / 2

  // Create a curved path
  const midX = startX + (endX - startX) / 2;
  const pathData = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-5"
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#6B7280"
          />
        </marker>
      </defs>
      <path
        d={pathData}
        stroke="#6B7280"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead)"
        className="drop-shadow-sm"
      />
    </svg>
  );
};