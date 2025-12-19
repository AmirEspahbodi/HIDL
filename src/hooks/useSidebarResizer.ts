import { useState, useCallback, useEffect, useRef } from 'react';

interface SidebarResizerConfig {
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  collapsedWidth: number;
}

export const useSidebarResizer = ({
  defaultWidth = 256,
  minWidth = 180,
  maxWidth = 480,
  collapsedWidth = 60
}: Partial<SidebarResizerConfig> = {}) => {
  const [sidebarWidth, setSidebarWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const widthBeforeCollapse = useRef(defaultWidth);

  // Double-click handler: toggle between collapsed and previous width
  const handleDoubleClick = useCallback(() => {
    if (isCollapsed) {
      // Expand to previous width
      setSidebarWidth(widthBeforeCollapse.current);
      setIsCollapsed(false);
    } else {
      // Collapse to minimal width
      widthBeforeCollapse.current = sidebarWidth;
      setSidebarWidth(collapsedWidth);
      setIsCollapsed(true);
    }
  }, [isCollapsed, sidebarWidth, collapsedWidth]);

  // Drag resize handler
  const handleResizeStart = useCallback((startX: number) => {
    setIsResizing(true);
    const startWidth = sidebarWidth;

    // Prevent text selection during drag
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      const newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, startWidth + delta)
      );

      setSidebarWidth(newWidth);

      // Update collapsed state based on width
      if (newWidth <= collapsedWidth + 20) {
        setIsCollapsed(true);
      } else {
        if (isCollapsed) {
          setIsCollapsed(false);
        }
        widthBeforeCollapse.current = newWidth;
      }
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [sidebarWidth, minWidth, maxWidth, collapsedWidth, isCollapsed]);

  return {
    sidebarWidth,
    isResizing,
    isCollapsed,
    handleResizeStart,
    handleDoubleClick
  };
};
