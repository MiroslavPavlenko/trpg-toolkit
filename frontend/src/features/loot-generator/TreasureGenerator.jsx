import { useState } from "react";
import { generateTreasure } from "./generateTreasure";

export default function TreasureGenerator() {
  // Stores the selected MOB type
  const [mobType, setMobType] = useState("Beast");

  // Stores the generated treasure items
  const [treasure, setTreasure] = useState([]);

  // Generates treasure based on the selected MOB type
  function handleGenerateTreasure() {
    const generatedTreasure = generateTreasure(mobType);
    setTreasure(generatedTreasure);
  }

  return (
    <section>
      <h2>Generate Treasure</h2>
      <hr />

      {/* Dropdown to select MOB type */}
      <label htmlFor="mob-type">MOB Type:</label>
      <select
        id="mob-type"
        value={mobType}
        onChange={(event) => setMobType(event.target.value)}
      >
        <option value="Beast">Beast</option>
        <option value="Undead">Undead</option>
        <option value="Dragon">Dragon</option>
        <option value="Humanoid">Humanoid</option>
      </select>

      {/* Button that generates treasure */}
      <button onClick={handleGenerateTreasure}>
        Generate Treasure
      </button>

      {/* Displays the generated treasure item names */}
      {treasure.length > 0 && (
        <ul>
          {treasure.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}