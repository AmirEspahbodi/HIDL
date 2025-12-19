import React, { useState, useEffect, useRef } from "react";
import { DataRow } from "../types";

interface DataRowItemProps {
  row: DataRow;
  onUpdateExpertOpinion: (id: string, opinion: string) => void;
  onToggleRevision: (
    id: string,
    isRevised: boolean,
    reviserName: string,
  ) => void;
  currentUserName: string;
  gridTemplateColumns: string;
}

export const DataRowItem: React.FC<DataRowItemProps> = ({
  row,
  onUpdateExpertOpinion,
  onToggleRevision,
  currentUserName,
  gridTemplateColumns,
}) => {
  const [expanded, setExpanded] = useState(false);

  const [isEditingOpinion, setIsEditingOpinion] = useState(false);
  const [opinionText, setOpinionText] = useState(row.expert_opinion);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setOpinionText(row.expert_opinion);
  }, [row.expert_opinion]);

  useEffect(() => {
    if (isEditingOpinion && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditingOpinion]);

  const handleDragStart = (e: React.DragEvent) => {
    if (!expanded) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", row.id.toString());
    e.dataTransfer.effectAllowed = "move";

    const el = e.currentTarget as HTMLElement;
    el.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.classList.remove("opacity-50");
  };

  const toggleExpand = () => setExpanded(!expanded);

  const handleSaveOpinion = () => {
    setIsEditingOpinion(false);
    if (opinionText !== row.expert_opinion) {
      onUpdateExpertOpinion(row.id, opinionText);
    }
  };

  const handleOpinionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveOpinion();
    }
  };

  const handleRevisionToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!row.isRevised) {
      onToggleRevision(row.id, true, currentUserName);
    }
  };

  // Styles
  const baseCell =
    "px-4 py-3 text-sm transition-all duration-300 border-r border-transparent";
  const textCellStyle = `${baseCell} text-slate-700 ${
    expanded
      ? "whitespace-normal break-words"
      : "whitespace-nowrap overflow-hidden text-ellipsis"
  }`;
  const scoreCellStyle = `${baseCell} text-slate-500 font-mono text-right`;

  // Dynamic Container Classes
  const getContainerClasses = () => {
    const baseClasses =
      "border-b border-slate-100 transition-colors cursor-pointer group";

    const bgColor = row.isRevised
      ? "bg-green-50 hover:bg-green-100"
      : "bg-white hover:bg-slate-50";

    if (expanded) {
      return `${baseClasses} ${bgColor} shadow-lg ring-1 ring-slate-200 relative z-10 my-2 rounded-lg cursor-grab active:cursor-grabbing`;
    }

    return `${baseClasses} ${bgColor} cursor-pointer`;
  };

  return (
    <div
      draggable={expanded}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDoubleClick={toggleExpand}
      className={getContainerClasses()}
    >
      {/* The Grid Container */}
      <div className="grid items-start" style={{ gridTemplateColumns }}>
        {/* preceding */}
        <div className={`${textCellStyle} text-slate-500`}>{row.preceding}</div>

        {/* target */}
        <div className={`${textCellStyle} font-medium text-slate-900`}>
          {row.target}
        </div>

        {/* following */}
        <div className={`${textCellStyle} text-slate-500`}>{row.following}</div>

        {/* LLM Justification */}
        <div className={`${textCellStyle} text-slate-600`}>
          {row.llm_justification || (
            <span className="text-slate-300 italic">-</span>
          )}
        </div>

        {/* LLM Evidence Quote */}
        <div className={`${textCellStyle} text-slate-600 italic`}>
          {row.llm_evidence_quote ? (
            `"${row.llm_evidence_quote}"`
          ) : (
            <span className="text-slate-300 italic">-</span>
          )}
        </div>

        {/* Expert Opinion (Editable) */}
        <div
          className={`${textCellStyle} text-slate-600 ${expanded ? "cursor-text hover:bg-blue-50/50 rounded" : ""}`}
          onClick={(e) => {
            if (expanded) {
              e.stopPropagation();
              setIsEditingOpinion(true);
            }
          }}
          onDoubleClick={(e) => {
            if (expanded) {
              e.stopPropagation();
            }
          }}
        >
          {expanded && isEditingOpinion ? (
            <textarea
              ref={textareaRef}
              value={opinionText}
              onChange={(e) => setOpinionText(e.target.value)}
              onBlur={handleSaveOpinion}
              onKeyDown={handleOpinionKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="w-full p-2 bg-white border border-blue-400 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-800"
              rows={3}
            />
          ) : (
            row.expert_opinion || (
              <span className="text-slate-300 italic">-</span>
            )
          )}
        </div>

        {/* A Score */}
        <div className={scoreCellStyle}>
          {expanded && (
            <div className="text-[10px] text-slate-300 uppercase mb-1">
              Score
            </div>
          )}
          <span>
            {row.A1_Score},{row.A2_Score},{row.A3_Score}
          </span>
        </div>
      </div>

      {/* Expanded Footer Actions */}
      {expanded && (
        <div className="px-4 pb-3 pt-2 flex justify-between items-center border-t border-slate-100 mt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleRevisionToggle}
              disabled={row.isRevised}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${
                  row.isRevised
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600 active:scale-95 shadow-sm hover:shadow-md"
                }
              `}
            >
              {row.isRevised ? "Revised" : "Set as Revised"}
            </button>
            {row.isRevised && (
              <span className="text-xs text-slate-500">
                by {row.reviserName}
                {row.revisionTimestamp && (
                  <span className="ml-1">
                    on {new Date(row.revisionTimestamp).toLocaleDateString()}
                  </span>
                )}
              </span>
            )}
          </div>

          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded">
            Drag to reassign | Double-click to collapse
          </span>
        </div>
      )}
    </div>
  );
};
