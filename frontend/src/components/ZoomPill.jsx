/* --Imports-- */
import { useState } from "react";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";

function ZoomPill({ onZoomIn, onZoomOut }) {
/* --States-- */
    const [zoomPillOpen, setZoomPillOpen] = useState(false);

/* --Constants-- */
    const iconButtonStyle = {
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "2rem",
        cursor: "pointer",
        padding: "8px",
    };

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
                    <button
                        onClick={onZoomIn}
                        style={iconButtonStyle}
                        aria-label="zoom in"
                    >
                        <LuZoomIn />
                    </button>
                    <button
                        onClick={onZoomOut}
                        style={iconButtonStyle}
                        aria-label="zoom out"
                    >
                        <LuZoomOut />
                    </button>
                </>
            ) : (
                <div
                    style={{
                        ...iconButtonStyle,
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
                        stroke="currentColor"
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

export default ZoomPill;