import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { HeaderPanel } from './components/HeaderPanel';
import { DataRowItem } from './components/DataRowItem';
import { ResizeHandle } from './components/ResizeHandle';
import { useColumnResizer, ColumnConfig } from './hooks/useColumnResizer';
import initialPrinciples from './principles.json';
import initialSamples from './_prompt_type1_without_example_samples.json';
import { Principle, DataRow } from './types';

// Initial Layout Definition (approximate pixels based on previous col-spans)
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'preceding', label: 'Preceding', width: 100, minWidth: 60 },
  { id: 'target', label: 'Target', width: 280, minWidth: 150 },
  { id: 'following', label: 'Following', width: 100, minWidth: 60 },
  { id: 'justification', label: 'LLM Justification', width: 220, minWidth: 100 },
  { id: 'evidence', label: 'LLM Evidence', width: 220, minWidth: 100 },
  { id: 'expert', label: 'Expert Opinion', width: 220, minWidth: 100 },
  { id: 'score', label: 'Score', width: 80, minWidth: 60 },
];

interface HistoryAction {
  rowId: number;
  fromPrincipleId: number;
  toPrincipleId: number;
}

const MAX_HISTORY_SIZE = 50;

const App: React.FC = () => {
  // 1. Initialize Column State
  const { columns, gridTemplateColumns, handleResizeStart, isResizing } = useColumnResizer(DEFAULT_COLUMNS);

  const [principles, setPrinciples] = useState<Principle[]>(initialPrinciples);
  const [data, setData] = useState<DataRow[]>(initialSamples);
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [selectedPrincipleId, setSelectedPrincipleId] = useState<number>(initialPrinciples[0]?.id || 0);

  const selectedPrinciple = useMemo(
    () => principles.find((p) => p.id === selectedPrincipleId) || principles[0],
    [principles, selectedPrincipleId]
  );

  const visibleRows = useMemo(
    () => data.filter((row) => row.principle_id === selectedPrincipleId),
    [data, selectedPrincipleId]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        setHistory((currentHistory) => {
          if (currentHistory.length === 0) return currentHistory;
          const lastAction = currentHistory[currentHistory.length - 1];
          setData((currentData) => 
            currentData.map((row) => {
              if (row.id === lastAction.rowId) {
                return { ...row, principle_id: lastAction.fromPrincipleId };
              }
              return row;
            })
          );
          return currentHistory.slice(0, -1);
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRenamePrinciple = (id: number, newName: string) => {
    setPrinciples((prev) => prev.map((p) => (p.id === id ? { ...p, label_name: newName } : p)));
  };

  const handleUpdateDescription = (id: number, newDesc: string) => {
    setPrinciples((prev) => prev.map((p) => (p.id === id ? { ...p, definition: newDesc } : p)));
  };

  const handleUpdateInclusion = (id: number, newCriteria: string) => {
    setPrinciples((prev) => prev.map((p) => (p.id === id ? { ...p, inclusion_criteria: newCriteria } : p)));
  };

  const handleUpdateExclusion = (id: number, newCriteria: string) => {
    setPrinciples((prev) => prev.map((p) => (p.id === id ? { ...p, exclusion_criteria: newCriteria } : p)));
  };

  const handleUpdateExpertOpinion = (rowId: number, newOpinion: string) => {
    setData((prev) => prev.map((row) => row.id === rowId ? { ...row, expert_opinion: newOpinion } : row));
  };

  const handleDropRow = (rowId: string, targetPrincipleId: number) => { 
    if (targetPrincipleId === selectedPrincipleId) return;

    const row = data.find(r => r.id === rowId); 

    if (row && row.principle_id !== targetPrincipleId) {
      setHistory((prev) => {
        const newAction: HistoryAction = {
          rowId,
          fromPrincipleId: row.principle_id,
          toPrincipleId: targetPrincipleId
        };
        const newHistory = [...prev, newAction];
        if (newHistory.length > MAX_HISTORY_SIZE) {
          return newHistory.slice(newHistory.length - MAX_HISTORY_SIZE);
        }
        return newHistory;
      });
    }
    setData((prev) => prev.map((row) => row.id === rowId ? { ...row, principle_id: targetPrincipleId } : row));
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden text-slate-800 font-sans">
      <Sidebar
        principles={principles}
        selectedId={selectedPrincipleId}
        onSelect={setSelectedPrincipleId}
        onRename={handleRenamePrinciple}
        onDropRow={handleDropRow}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-white shadow-xl shadow-slate-200/50 m-2 ml-0 rounded-l-2xl overflow-hidden border border-slate-200">
        
        {selectedPrinciple && (
            <HeaderPanel 
                principle={selectedPrinciple} 
                onUpdateDescription={handleUpdateDescription}
                onUpdateInclusion={handleUpdateInclusion}
                onUpdateExclusion={handleUpdateExclusion}
            />
        )}

        <div className="flex-1 overflow-y-auto bg-white overflow-x-auto relative">
          {/* Table Header 
              Note: min-w-max ensures the grid doesn't collapse if total width < screen width
          */}
          <div 
            className="grid px-4 py-3 bg-slate-50 border-b border-slate-200 sticky top-0 z-20 backdrop-blur-sm bg-opacity-90 min-w-max"
            style={{ gridTemplateColumns }} // 2. Apply Dynamic Grid Style
          >
            {columns.map((col, index) => (
              <div key={col.id} className="relative flex items-center px-4 h-full">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate select-none">
                  {col.label}
                </span>
                {/* 3. Insert Resize Handle */}
                <ResizeHandle 
                  isResizing={isResizing}
                  onMouseDown={(e) => handleResizeStart(index, e.clientX)}
                />
              </div>
            ))}
          </div>

          <div className="pb-20 min-w-max">
            {visibleRows.length === 0 ? (
               <div className="p-12 text-center text-slate-400 italic">
                 No data annotations assigned to this principle.
               </div>
            ) : (
              visibleRows.map((row) => (
                <DataRowItem 
                  key={row.id} 
                  row={row} 
                  onUpdateExpertOpinion={handleUpdateExpertOpinion}
                  gridTemplateColumns={gridTemplateColumns} // 4. Pass Layout Down
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;