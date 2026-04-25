import { useState, useEffect } from "react";
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
    const [imgSize,setImgSize] = useState(null);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

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

    useEffect(()=>{
        console.log("Window Size (width x height): ", window.innerWidth, "x", window.innerHeight);

        if (!backgroundUrl){
            setImgSize(null);
            return;
        } 

        const img = new Image();
        img.onload = () => {
            console.log("Map Size(width x height): ", img.naturalWidth, "x", img.naturalHeight);
            setImgSize({ width: img.naturalWidth, height: img.naturalHeight});
        };
        img.src = backgroundUrl;
    }, [backgroundUrl]);

    useEffect(()=>{
        const handleResize = () => {
            const newSize = { width: window.innerWidth, height: window.innerHeight };
                console.log("Window Size (width x height): ", newSize.width, "x", newSize.height);
            setWindowSize(newSize);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div style={{display: "flex", flexDirection: "column", height: "100vh"}}>
            <TopBar />
            <div
                style={{
                    flex: 1,
                    minHeight: 0, 
                    boxSizing: "border-box",
                    overflow: "hidden",
                    padding: "40px",
                    backgroundImage: 
                        backgroundUrl 
                        ? `url("${backgroundUrl}")` : "",
                    backgroundSize:
                        (imgSize 
                        && imgSize.width >=windowSize.width
                        && imgSize.height >= windowSize.height)
                        ? "auto" : "cover",
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
        </div>
    );
}

export default VTT;