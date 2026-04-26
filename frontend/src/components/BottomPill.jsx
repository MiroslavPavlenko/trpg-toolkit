import { LuImage,LuMap, LuUserPlus, LuTable} from "react-icons/lu"
import "../style/PillButton.css";

function BottomPill({ onImage, onMap, onAddCharacter, onTables }){
    return (
        <div
            style={{
                position: "fixed",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
                background: "#222",
                padding: "8px 16px",
                borderRadius: "999px",
                border: "1px solid #444",
            }}
        >
            <button onClick={onImage} className="icon-button" aria-label="image">
                <LuImage />
            </button>
            <button onClick={onMap} className="icon-button" aria-label="map">
                <LuMap />
            </button>
            <button onClick={onAddCharacter} className="icon-button" aria-label="add character">
                <LuUserPlus />
            </button>
            <button onClick={onTables} className="icon-button" aria-label="lookup tables">
                <LuTable />
            </button>
        </div>
    );
}

export default BottomPill;