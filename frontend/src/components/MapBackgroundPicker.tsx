// MapBackgroundPicker.jsx
// Lists the user's uploaded maps and lets them click one to set as the home page background.
// Receives an `onSelect` callback prop — calls it with the chosen image's URL.

import { useState, useEffect } from "react";
import { getSignedUrl, listImages } from "../services/vttStorage";

type Props = {
    onSelect: (url: string) => void;   // function the parent passes us, called with the chosen image URL
    showGrid: boolean;
    onToggleGrid: () => void;
};

type MapItem = {
    name: string;
    url: string;
};

function MapBackgroundPicker({ onSelect, showGrid, onToggleGrid }: Props) {
    const [maps, setMaps] = useState<MapItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadMaps = async () => {
            try {
                const names = (await listImages("maps")).filter(n => !n.startsWith("."));
                const items = await Promise.all(
                    names.map(async (name) => ({
                        name,
                        url: await getSignedUrl("maps",name),
                    }))
                );
                setMaps(items);
            }
            catch (err: any) {
                setError(err.message);

            }
            finally {
                setLoading(false);
            }
        };
        loadMaps();
    },[]);
    return (
        <div>
            <h2>
                Maps
            </h2>
            <button
                onClick={onToggleGrid}
                style={{
                    marginBottom: "12px",
                    padding: "6px 12px",
                    background: showGrid ? "#3b82f6" : "#444",
                    color: "white",
                    border: "1px solid #666",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                Grid: {showGrid ? "On" : "Off"}
            </button>
            {loading && <p>Loading Maps...</p>}
            {error && <p style={{color: "red" }}>{error}</p>}
            {!loading && maps.length ===0 && (
                <p style={{opacity: 0.7}}>
                    No maps uploaded yet
                </p>
            )}
            {!loading && maps.length > 0 && (
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "12px", }}
                >
                    {maps.map((m) => (
                        <button
                            key={m.name}
                            onClick={()=> onSelect(m.url)}
                            style={{
                                padding: 0,
                                border: "1px solid #999",
                                borderRadius: "4px",
                                cursor: "pointer",
                                background: "transparent",
                            }}
                        >
                            <img
                                src={m.url}
                                alt={m.name}
                                style={{
                                    width: "120px",
                                    height: "80px",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                        </button>
                    ))}
                </div>
             )}
        </div>
    );
}

export default MapBackgroundPicker