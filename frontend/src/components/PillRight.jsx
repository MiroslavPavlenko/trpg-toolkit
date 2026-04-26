import { LuCoins, LuChartBar } from "react-icons/lu";
import "../style/PillButton.css";

function PillRight ({onLoot, onStats}) {
    return (
        <div
            style={{
                position: "fixed",
                right: "20px",
                top: "50%",
                transform: "translateY(-50)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding :"12x 8px",
                borderRadius: "999px",
                background: "#222",
                border: "1px solid #444",
            }}
        >
            <button onClick={onLoot} className="icon-button" aria-label="loot">
                <LuCoins />
            </button>
            <button onClick={onStats} className="icon-button" aria-label="stats">
                <LuChartBar />
            </button>
        </div>
    )
}

export default PillRight;