import React from 'react';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  isResizing: boolean;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ onMouseDown, isResizing }) => {
  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent text selection initiation
        e.stopPropagation();
        onMouseDown(e);
      }}
      // HIT AREA: 12px wide (w-3), transparent, centered (translate-x-1/2) over the edge
      className="absolute top-0 right-0 bottom-0 w-3 translate-x-1/2 z-30 cursor-col-resize flex justify-center group touch-none select-none"
    >
      {/* VISUAL INDICATOR: 1px blue line, visible only on hover or active drag */}
      <div 
        className={`
          w-[1px] h-full bg-blue-500 rounded-full transition-opacity duration-150
          ${isResizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 delay-75'}
        `} 
      />
    </div>
  );
};