import React from "react";

interface SidebarResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  isResizing: boolean;
  isCollapsed: boolean;
}

export const SidebarResizeHandle: React.FC<SidebarResizeHandleProps> = ({
  onMouseDown,
  onDoubleClick,
  isResizing,
  isCollapsed,
}) => {
  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onMouseDown(e);
      }}
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDoubleClick();
      }}
      className="absolute top-0 right-0 bottom-0 w-1 hover:w-1.5 z-50 cursor-col-resize group touch-none select-none transition-all duration-150"
      style={{
        background: isResizing
          ? "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), rgba(59, 130, 246, 0.8))"
          : "transparent",
      }}
    >
      {/* Invisible Hit Area (wider for better UX) */}
      <div className="absolute inset-0 -left-2 -right-2" />

      {/* Visual Indicator */}
      <div
        className={`
          absolute inset-0 transition-all duration-200
          ${
            isResizing
              ? "bg-blue-500 shadow-lg shadow-blue-500/50"
              : "bg-slate-300 group-hover:bg-blue-400 group-hover:shadow-md group-hover:shadow-blue-400/30"
          }
          ${isCollapsed ? "opacity-60" : ""}
        `}
      />

      {/* Double-click hint (visible on hover) */}
      <div
        className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg
          opacity-0 group-hover:opacity-100 transition-opacity duration-75 pointer-events-none
          whitespace-nowrap z-60
        "
        style={{ marginLeft: "12px" }}
      >
        Double-click to {isCollapsed ? "expand" : "collapse"}
      </div>
    </div>
  );
};
