import { useState } from "react";
import MonsterSearch from "./components/MonsterSearch";
import EquipmentSearch from "./components/EquipmentSearch";

// Root component — renders the app layout and controls which rule set is active.
// To add a new feature: import its component and render it inside the ruleSet === "5.0" block.
function App() {
  // Tracks which rule set the user has selected from the dropdown.
  // "0.0" = nothing selected, "5.0" = D&D 5th edition (2014 API).
  const [ruleSet, setRuleSet] = useState("0.0");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", padding: "40px" }}>
      <h1>TRPG Toolkit</h1>

      {/* Rule set selector — adding a new edition here also requires a new API service + components */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "200px" }}>
        <label htmlFor="ruleset">Choose Rule Set</label>
        <select
          id="ruleset"
          value={ruleSet}
          onChange={(e) => setRuleSet(e.target.value)}
        >
          <option value="0.0">Select a rule set</option>
          <option value="5.0">5.0</option>
          <option value="6.0">6.0 Coming Soon</option>
        </select>
      </div>

      {/* Only show features when a valid rule set is selected */}
      {ruleSet === "5.0" ? (
        <div style={{ width: "100%", maxWidth: "600px", marginTop: "24px", textAlign: "center" }}>
          {/* Add new feature components here as the project grows */}
          <MonsterSearch />
          <EquipmentSearch />
        </div>
      ) : (
        <p>Please select rule set 5.0 to use this page.</p>
      )}
    </div>
  );
}

export default App;
