/* --Imports-- */
import { useState, useRef } from "react";                               // React core hooks
import { useNavigate } from "react-router-dom";                         // Routing
import { LuImage, LuMap, LuUserPlus, LuTable, LuCoins, 
         LuChartBar, } from "react-icons/lu";                           // Lucide Icons
import MonsterSearch from "../components/MonsterSearch";                // Table Look - Monster
import EquipmentSearch from "../components/EquipmentSearch";            // Table Look - Equipment
import ImageUploader from "../components/ImageUploader";                // Upload-image
import MapBackgroundPicker from "../components/MapBackgroundPicker";    // Pick-Map
import Modal from "../components/Modal";                                // generic modal
import TopBar from "../components/TopBar";                              // Top Nav
import MapCanvas from "../components/MapCanvas";                        // Konva canvas
import ZoomPill from "../components/ZoomPill";                          // Hover ZoomPill

function VTT() {
/* --States-- */    
    const navigate = useNavigate();
    const mapCanvasRef = useRef(null);
    const [backgroundUrl, setBackgroundUrl] = useState(null);           // URL of currently selected map image
    const [openModal, setOpenModal] = useState(null);                   // Which modal is open
/* --Constants-- */
   
    const iconButtonStyle = {                                           // Shared styling for all toolbar & pill icon buttons
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "2rem",
        cursor: "pointer",
        padding: "8px",
    };
    
    const modalTitles = {                                               // Title shown in the modal header for each modal type
        image: "Upload Image",
        map: "Set Map Background",
        person: "Add Character",
        table: "Lookup Tables",
        dollar: "Loot",
        chart: "Stats",
    };
    
    const renderModalContent = () => {                                  // Picks the body content for the modal based on which one is open
        switch (openModal) {
            case "image":
                return <ImageUploader />;
            case "map":
                return <MapBackgroundPicker onSelect={setBackgroundUrl} />;
            case "person":
                return <p>Coming Soon</p>;
            case "table":
                return (
                    <>
                        <MonsterSearch />
                        <EquipmentSearch />
                    </>
                );
            case "dollar":
                return <p>Coming Soon</p>;
            case "chart":
                return <p>Coming Soon</p>;
            default:
                return null;
        }
    };
   
/* --Render-- */
    return (
        /* Outer flex column: TopBar on top, canvas fills the rest*/
        <div style={{display: "flex", flexDirection: "column", height: "100vh"}}>
            <TopBar />
           {/* Canvas area: holds the Konva Stage and floating toolbar pills */}
            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    boxSizing: "border-box",
                    overflow: "hidden",
                    background: "#2a3439"
                }}
            >
                {/* Konva canvas: only renders once a map image has loaded */}
                <MapCanvas ref={mapCanvasRef} backgroundUrl={backgroundUrl} />

                {/* Right-side pill: loot + stats */}
                <div
                    style={{
                    position: "fixed",
                    right: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    background: "#222",
                    padding: "12px 8px",
                    borderRadius: "999px",
                    border: "1px solid #444",}}
                >
                    <button
                    onClick={() => setOpenModal("dollar")}
                    style={iconButtonStyle}
                    aria-label="loot"
                    >
                        <LuCoins />
                    </button>
                    <button
                        onClick={() => setOpenModal("chart")}
                        style={iconButtonStyle}
                        aria-label="stats"
                    >
                        <LuChartBar />
                    </button>
                </div>

                {/* Lower-right pill: zoom in / zoom out */}
                <ZoomPill
                    onZoomIn={() => mapCanvasRef.current?.zoomIn()}
                    onZoomOut={() => mapCanvasRef.current?.zoomOut()}
                />
                {/* Bottom pill: image / map / character / lookup tables */}
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

                    }}>
                        <button
                            onClick={() => setOpenModal("image")}
                            style={iconButtonStyle}
                            aria-label="image"
                        >
                            <LuImage />
                        </button>
                        <button
                            onClick={() => setOpenModal("map")}
                            style={iconButtonStyle}
                            aria-label="map"
                        >
                            <LuMap />
                        </button>
                        <button
                            onClick={() => setOpenModal("person")}
                            style={iconButtonStyle}
                            aria-label="add character"
                        >
                            <LuUserPlus />
                        </button>
                        <button
                            onClick={() => setOpenModal("table")}
                            style={iconButtonStyle}
                            aria-label="lookup tables"
                        >
                            <LuTable />
                        </button>
                </div>
                {/* Generic modal — body is fanned out by openModal value */}
                <Modal
                    isOpen={openModal !== null}
                    onClose={() => setOpenModal(null)}
                    title={modalTitles[openModal]?? ""}
                >
                    {renderModalContent()}
                </Modal>
            </div>
        </div>
    );
}

export default VTT;
