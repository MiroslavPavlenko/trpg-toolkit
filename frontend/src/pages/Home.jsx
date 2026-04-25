import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import MonsterSearch from "../components/MonsterSearch";
import EquipmentSearch from "../components/EquipmentSearch";
import ImageUploader from "../components/ImageUploader";
import MapBackgroundPicker from "../components/MapBackgroundPicker";   

function Home() {
    const navigate = useNavigate();
    const [ruleSet, setRuleSet] = useState("5.0");
    const [backgroundUrl, setBackgroundUrl] = useState(null);
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <div
            style={{ 
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                padding: "40px", 
                backgroundImage: backgroundUrl ? `url("${backgroundUrl}")` : "",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
           <h1>TRPG ToolKit</h1>

            <button onClick={handleSignOut} style={{marginBlock: "16px"}}>
                Sign out    
            </button>    

            <ImageUploader />

            <MapBackgroundPicker onSelect={(setBackgroundUrl)} />

           <div style={{display: "flex", flexDirection: "column", gap: "8px", width: "200px"}}>
            <label htmlFor="ruleset">Choose Rule Set</label>
            <select
                id="ruleset"
                value={ruleSet}
                onChange={(e)=>setRuleSet(e.target.value)}>
                    <option value={"5.0"}>5.0</option>
                    <option value={"5.5"}>5.5</option>
                </select>
        </div>

        {ruleSet === "5.0" ? (
            <div style={{width: "100%", maxWidth: "600px", marginTop: "24px", textAlign: "center" }}>
              <MonsterSearch />
              <EquipmentSearch />
            </div>  
        ):(
             <p>Please select rule set 5.0 to use this page</p>
        )}
        </div>
    );    
}

export default Home;