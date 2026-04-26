import { useState } from "react";
import { LuSettings2 } from "react-icons/lu";
import "../style/PillButton.css"

function PillMapContorl({ children}){
    const [open, setOpen] = useState(false);

    return(
        <div
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            style={{
                position: "fixed",
                right: "20px",
                bottom: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
                background: "#222",
                border: "1px solid #444",
                borderRadius: "999px",
                padding: "12px 10px",
                color: "#eee",
                padding: open ? "16px 14px" : "12px 10px",
                fontSize: open ? "1.4rem" : "1.1rem",
                gap: open ? "16px" : "12px",
            }}
        >
           {open && children}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                aria-label="map controls"
            >
                <LuSettings2 />
            </div>
        </div>
    );
}

export default PillMapContorl;