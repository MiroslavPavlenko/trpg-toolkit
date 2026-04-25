import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuImage, LuMap, LuUserPlus, LuTable, LuCoins, LuChartBar } from "react-icons/lu";
import MonsterSearch from "../components/MonsterSearch";
import EquipmentSearch from "../components/EquipmentSearch";
import ImageUploader from "../components/ImageUploader";
import MapBackgroundPicker from "../components/MapBackgroundPicker";
import Modal from "../components/Modal";
import TopBar from "../components/TopBar";

function VTT() {
    const navigate = useNavigate();
    const [backgroundUrl, setBackgroundUrl] = useState(null);
    const [openModal, setOpenModal] = useState(null);

    const iconButtonStyle = {
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "2rem",
        cursor: "pointer",
        padding: "8px",
    };

    const modalTitles = {
        image: "Upload Image",
        map: "Set Map Background",
        person: "Add Character",
        table: "Lookup Tables",
        dollar: "Loot",
        chart: "Stats",
    };

    const renderModalContent = () => {
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

    return (
        <>
            <TopBar />
            <div
                style={{
                    minHeight: "calc(100vh - 60px)",
                    padding: "40px",
                    backgroundImage: backgroundUrl ? `url("${backgroundUrl}")` : "",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
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

                <Modal
                    isOpen={openModal !== null}
                    onClose={() => setOpenModal(null)}
                    title={modalTitles[openModal]?? ""}
                >
                    {renderModalContent()}
                </Modal>
            </div>
        </>
    );
}

export default VTT;