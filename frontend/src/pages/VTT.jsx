/* --Imports-- */
import { useState, useEffect, useRef } from "react";                    // React core hooks
import { useNavigate } from "react-router-dom";                         // Routing
import { CombatTracker } from "../services/combatTracker";              // Combat tracker service
import MonsterSearch from "../components/MonsterSearch";                // Table Look - Monster
import EquipmentSearch from "../components/EquipmentSearch";            // Table Look - Equipment
import ImageUploader from "../components/ImageUploader";                // Upload-image
import MapBackgroundPicker from "../components/MapBackgroundPicker";    // Pick-Map
import Modal from "../components/Modal";                                // generic modal
import TopBar from "../components/TopBar";                              // Top Nav
import MapCanvas from "../components/MapCanvas";                        // Konva canvas
import ZoomPill from "../components/ZoomPill";                          // Hover ZoomPill
import RightPill from "../components/RightPill";                        // Right NavPill
import BottomPill from "../components/BottomPill";                      // Bottom NavPill
import InitiativeTracker from "../components/InitiativeTracker";        // Initiative panel
import AddParticipantForm from "../components/AddParticipantForm";      // Add character form
import ParticipantSheet from "../components/ParticipantSheet";          // Selected participant sheet
function VTT() {
/* --States-- */    
    const navigate = useNavigate();
    const mapCanvasRef = useRef(null);
    const [backgroundUrl, setBackgroundUrl] = useState(null);           // URL of currently selected map image
    const [openModal, setOpenModal] = useState(null);                   // Which modal is open
    const [showGrid, setShowGrid] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [initiativeQueue, setInitiativeQueue] = useState([]);
    const [combatActive, setCombatActive] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const combatRef = useRef(null);

    // Pull the current ordered participant list out of the CombatTracker queue,
    // carrying the rolled initiative total so the UI can display and edit it.
    function syncQueue() {
        if (combatRef.current) {
            setInitiativeQueue(
                combatRef.current.queue.map(e => ({ ...e.entity, initiativeTotal: e.total }))
            );
        }
    }

    function handleAddParticipant(participant) {
        setParticipants(prev => [...prev, participant]);
    }

    function handleRemoveParticipant(id) {
        setParticipants(prev => {
            const next = prev.filter(p => p.id !== id);
            if (next.length === 0) {
                setCombatActive(false);
                setInitiativeQueue([]);
                combatRef.current = null;
                return next;
            }
            return next;
        });
        if (combatRef.current) {
            combatRef.current.queue = combatRef.current.queue.filter(e => e.entity.id !== id);
            syncQueue();
        } else {
            setInitiativeQueue(prev => prev.filter(p => p.id !== id));
        }
        setSelectedParticipant(null);
    }

    function updateHp(id, calc) {
        setParticipants(prev =>
            prev.map(p => p.id === id ? { ...p, hit_points: calc(p) } : p)
        );
        if (combatRef.current) {
            combatRef.current.queue.forEach(entry => {
                if (entry.entity.id === id) {
                    entry.entity = { ...entry.entity, hit_points: calc(entry.entity) };
                }
            });
            syncQueue();
        } else {
            setInitiativeQueue(prev =>
                prev.map(p => p.id === id ? { ...p, hit_points: calc(p) } : p)
            );
        }
        setSelectedParticipant(prev =>
            prev?.id === id ? { ...prev, hit_points: calc(prev) } : prev
        );
    }

    function handleDamage(id, amount) {
        updateHp(id, p => Math.max(0, p.hit_points - amount));
    }

    function handleHeal(id, amount) {
        updateHp(id, p => Math.min(p.data.hit_points, p.hit_points + amount));
    }

    function handleRoll() {
        if (participants.length === 0) return;
        combatRef.current = new CombatTracker(participants);
        syncQueue();
        setCombatActive(true);
    }

    function handleNextTurn() {
        if (!combatRef.current) return;
        combatRef.current.nextTurn();
        syncQueue();
    }

    function handleAdjustInitiative(name, total) {
        if (!combatRef.current) return;
        combatRef.current.adjustInitiative(name, total);
        syncQueue();
    }

/* --Constants-- */
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
                return (
                    <MapBackgroundPicker
                    onSelect = {setBackgroundUrl} 
                    showGrid = {showGrid}
                    onToggleGrid={() => setShowGrid(g =>!g)}
                    />
                );
            case "person":
                return <AddParticipantForm onAdd={handleAddParticipant} />;
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
                <MapCanvas ref={mapCanvasRef} backgroundUrl={backgroundUrl} showGrid={showGrid} />

                {/* Initiative tracker overlay */}
                <InitiativeTracker
                    participants={participants}
                    queue={initiativeQueue}
                    combatActive={combatActive}
                    onRoll={handleRoll}
                    onNext={handleNextTurn}
                    onSelect={setSelectedParticipant}
                    onDamage={handleDamage}
                    onHeal={handleHeal}
                    onAdjustInitiative={handleAdjustInitiative}
                />

                {/* Participant sheet for selected character */}
                <ParticipantSheet
                    participant={selectedParticipant}
                    onClose={() => setSelectedParticipant(null)}
                    onRemove={handleRemoveParticipant}
                    onDamage={handleDamage}
                    onHeal={handleHeal}
                />

                {/* Right-side pill: loot + stats */}
                <RightPill
                    onLoot={() => setOpenModal("dollar")}
                    onStats={() => setOpenModal("chart")}
                />

                {/* Lower-right pill: zoom in / zoom out */}
                <ZoomPill
                    onZoomIn={() => mapCanvasRef.current?.zoomIn()}
                    onZoomOut={() => mapCanvasRef.current?.zoomOut()}
                />
                {/* Bottom pill: image / map / character / lookup tables */}
                <BottomPill
                    onImage={() => setOpenModal("image")}
                    onMap={() => setOpenModal("map")}
                    onAddCharacter={() => setOpenModal("person")}
                    onTable={() => setOpenModal("tables")}
                />

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