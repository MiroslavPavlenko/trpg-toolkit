import { useState } from "react";
import { LuRotateCcw, LuRotateCw } from "react-icons/lu";
import "../style/PillButton.css";

function normalizeRotation(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  if (numeric === 360) return 360;
  return ((numeric % 360) + 360) % 360;
}

function PillMapRotation({
  mapRotation = 0,
  rotationStep = 15,
  onChangeMapRotation,
  onChangeRotationStep,
}) {
  const [open, setOpen] = useState(false);
  const rotation = normalizeRotation(mapRotation);

  const setRotation = (value) => {
    onChangeMapRotation?.(normalizeRotation(value));
  };
  const step = Math.max(1, Math.min(360, Number(rotationStep) || 1));

  return (
    <div
      data-testid="pill-map-rotation"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
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
            right: "0%",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            background: "#222",
            border: "1px solid #444",
            borderRadius: "12px",
            padding: "12px 14px",
            color: "#eee",
            width: "190px",
            boxSizing: "border-box",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setRotation(rotation === 0 ? 360 : rotation - step)}
              className="icon-button"
              aria-label="rotate map counterclockwise"
              title="Rotate map counterclockwise"
            >
              <LuRotateCcw />
            </button>
            <span style={{ minWidth: "48px", textAlign: "center", fontSize: "0.85rem" }}>
              {rotation}deg
            </span>
            <button
              type="button"
              onClick={() => setRotation(rotation === 360 ? 0 : rotation + step)}
              className="icon-button"
              aria-label="rotate map clockwise"
              title="Rotate map clockwise"
            >
              <LuRotateCw />
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={rotation}
            aria-label="map rotation"
            onChange={(event) => setRotation(event.target.value)}
            style={{ width: "140px" }}
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.75rem",
            }}
          >
            Step
            <input
              type="number"
              min="1"
              max="360"
              value={step}
              aria-label="map rotation shortcut degrees"
              onChange={(event) => onChangeRotationStep?.(event.target.value)}
              style={{
                width: "58px",
                padding: "3px 5px",
                background: "#333",
                color: "#eee",
                border: "1px solid #444",
                borderRadius: "4px",
                textAlign: "center",
              }}
            />
            deg
          </label>
        </div>
      )}

      <LuRotateCw aria-label="map rotation controls" />
    </div>
  );
}

export default PillMapRotation;
