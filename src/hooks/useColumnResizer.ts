import { useState, useCallback } from 'react';

export interface ColumnConfig {
  id: string;
  label: string;
  width: number;
  minWidth: number;
}

export const useColumnResizer = (initialColumns: ColumnConfig[]) => {
  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns);
  const [isResizing, setIsResizing] = useState(false);

  // Generates a string like "120px 300px 120px..." for the style tag
  const gridTemplateColumns = columns.map((col) => `${col.width}px`).join(' ');

  const handleResizeStart = useCallback((index: number, startX: number) => {
    setIsResizing(true);
    const startWidth = columns[index].width;

    // "Apple Feel": Lock cursor globally and prevent text selection during drag
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (e: MouseEvent) => {
      // Calculate real-time delta
      const currentX = e.clientX;
      const delta = currentX - startX;

      setColumns((prevCols) => {
        const newCols = [...prevCols];
        // Apply min-width constraint immediately
        const newWidth = Math.max(
          newCols[index].minWidth,
          startWidth + delta
        );
        newCols[index] = { ...newCols[index], width: newWidth };
        return newCols;
      });
    };

    const onMouseUp = () => {
      // Cleanup
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [columns]);

  return {
    columns,
    gridTemplateColumns,
    handleResizeStart,
    isResizing,
  };
};