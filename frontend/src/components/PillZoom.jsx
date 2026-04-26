/* --Imports-- */
import { useState } from "react";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import "../style/PillButton.css";

function PillZoom({ onZoomIn, onZoomOut }) {
/* --States-- */
    const [zoomPillOpen, setZoomPillOpen] = useState(false);

/* --Render-- */
    return (
        <div
            onMouseEnter={() => setZoomPillOpen(true)}
            onMouseLeave={() => setZoomPillOpen(false)}
            style={{
                position: "fixed",
                right: "20px",
                bottom: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                background: "#222",
                padding: "12px 8px",
                borderRadius: "999px",
                border: "1px solid #444",
            }}
        >
            {zoomPillOpen ? (
                <>
                    <button onClick={onZoomIn} className="icon-button" aria-label="zoom in">
                        <LuZoomIn />
                    </button>
                    <button onClick={onZoomOut} className="icon-button" aria-label="zoom out">
                        <LuZoomOut />
                    </button>
                </>
            ) : (
                <div
                    className="icon-nutton"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                    }}
                    aria-label="zoom"
                >
                    <svg
                        width="1rem"
                        height="1rem"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {/* Magnifying glass */}
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>
            )}
        </div>
    );
}

export default PillZoom;