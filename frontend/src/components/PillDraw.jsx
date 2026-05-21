import { useState } from "react";
import { LuEraser, LuPencil, LuTrash2, LuUndo2 } from "react-icons/lu";
import "../style/PillButton.css";

const COLORS = ["#facc15", "#ef4444", "#22c55e", "#38bdf8", "#a855f7", "#ffffff"];

function PillDraw({
  drawingEnabled,
  drawingTool,
  onToggleDrawing,
  onChangeDrawingTool,
  onUndoDrawing,
  onClearDrawings,
}) {
  const [open, setOpen] = useState(false);

  const updateTool = (patch) => {
    onChangeDrawingTool((prev) => ({ ...prev, ...patch }));
  };

  const iconButtonStyle = (active = false) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    border: active ? "1px solid #93c5fd" : "1px solid #444",
    borderRadius: "999px",
    background: active ? "#1d4ed8" : "#2d2d2d",
    color: "#eee",
    cursor: "pointer",
    fontSize: "0.9rem",
  });

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      role="presentation"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1em",
        height: "1em",
      }}
    >
      {open && (
        <div
          style={{
            position: "absolute",
            right: "100%",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: "#222",
            border: "1px solid #444",
            borderRadius: "12px",
            padding: "12px 14px",
            color: "#eee",
            minWidth: "190px",
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              type="button"
              aria-label="Draw on map"
              title="Draw"
              onClick={() => {
                updateTool({ mode: "pen" });
                onToggleDrawing(true);
              }}
              style={iconButtonStyle(drawingEnabled && drawingTool.mode !== "eraser")}
            >
              <LuPencil />
            </button>
            <button
              type="button"
              aria-label="Erase map drawings"
              title="Erase"
              onClick={() => {
                updateTool({ mode: "eraser" });
                onToggleDrawing(true);
              }}
              style={iconButtonStyle(drawingEnabled && drawingTool.mode === "eraser")}
            >
              <LuEraser />
            </button>
            <button
              type="button"
              aria-label="Undo last map drawing"
              title="Undo"
              onClick={onUndoDrawing}
              style={iconButtonStyle()}
            >
              <LuUndo2 />
            </button>
            <button
              type="button"
              aria-label="Clear map drawings"
              title="Clear"
              onClick={onClearDrawings}
              style={iconButtonStyle()}
            >
              <LuTrash2 />
            </button>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Use ${color} drawing color`}
                title={color}
                onClick={() => updateTool({ color, mode: "pen" })}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "999px",
                  border: drawingTool.color === color ? "2px solid #93c5fd" : "1px solid #555",
                  background: color,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

          <input
            type="range"
            aria-label="Drawing brush size"
            min="2"
            max="18"
            value={drawingTool.strokeWidth}
            onChange={(e) => updateTool({ strokeWidth: Number(e.target.value) })}
          />

          <button
            type="button"
            onClick={() => onToggleDrawing(!drawingEnabled)}
            style={{
              border: "1px solid #444",
              borderRadius: "6px",
              background: drawingEnabled ? "#1d4ed8" : "#2d2d2d",
              color: "#eee",
              cursor: "pointer",
              padding: "5px 8px",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {drawingEnabled ? "Drawing on" : "Drawing off"}
          </button>
        </div>
      )}
      <LuPencil color={drawingEnabled ? "#93c5fd" : undefined} />
    </div>
  );
}

export default PillDraw;
