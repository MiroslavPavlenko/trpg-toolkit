import { useState } from "react";
import { generateMobParty } from "./generateMobParty";

export default function EnemyGenerator() {
  // Stores the target challenge rating entered by the user
  const [challengeRating, setChallengeRating] = useState(0.5);

  // Stores the number of MOBs the user wants to generate
  const [mobCount, setMobCount] = useState(3);

  // Stores the selected filter values
  const [habitat, setHabitat] = useState("Any");
  const [type, setType] = useState("Any");
  const [group, setGroup] = useState("Any");

  // Stores the currently generated party of monsters
  const [party, setParty] = useState([]);

  // Stores parties saved by the user during this session
  const [savedParties, setSavedParties] = useState([]);

  // Generates a new random MOB party based on the selected inputs and filters
  function handleGenerateParty() {
    const challengeRatingValue = Number(challengeRating);
    const mobCountValue = Number(mobCount);

    // Prevents invalid inputs before generating the party
    if (challengeRatingValue <= 0 || mobCountValue <= 0) {
      alert("Please enter a challenge rating and MOB count greater than 0.");
      return;
    }

    const generatedParty = generateMobParty(
      challengeRatingValue,
      mobCountValue,
      habitat,
      type,
      group
    );

    // Prevents showing an empty party if no monsters match the selected filters
    if (generatedParty.length === 0) {
      alert("No MOBs match the selected filters.");
      return;
    }

    setParty(generatedParty);
  }

  // Saves the currently generated party
  function handleSaveParty() {
    if (party.length === 0) {
      alert("Generate a party before saving.");
      return;
    }

    setSavedParties([...savedParties, party]);
  }

  return (
    <section>
      <h2>Enemy Party Generator</h2>
      <hr />

      <label htmlFor="challenge-rating">Target Challenge Rating:</label>
      <input
        id="challenge-rating"
        type="number"
        step="0.25"
        min="0.25"
        value={challengeRating}
        onChange={(event) => setChallengeRating(event.target.value)}
      />

      <label htmlFor="mob-count">Number of MOBs:</label>
      <input
        id="mob-count"
        type="number"
        min="1"
        value={mobCount}
        onChange={(event) => setMobCount(event.target.value)}
      />

      <label htmlFor="habitat">Habitat:</label>
      <select
        id="habitat"
        value={habitat}
        onChange={(event) => setHabitat(event.target.value)}
      >
        <option value="Any">Any</option>
        <option value="Forest">Forest</option>
        <option value="Mountain">Mountain</option>
        <option value="Dungeon">Dungeon</option>
        <option value="Swamp">Swamp</option>
        <option value="Road">Road</option>
      </select>

      <label htmlFor="type">Type:</label>
      <select
        id="type"
        value={type}
        onChange={(event) => setType(event.target.value)}
      >
        <option value="Any">Any</option>
        <option value="Humanoid">Humanoid</option>
        <option value="Undead">Undead</option>
      </select>

      <label htmlFor="group">Group:</label>
      <select
        id="group"
        value={group}
        onChange={(event) => setGroup(event.target.value)}
      >
        <option value="Any">Any</option>
        <option value="Tribe">Tribe</option>
        <option value="Warband">Warband</option>
        <option value="Horde">Horde</option>
        <option value="Gang">Gang</option>
      </select>

      <button onClick={handleGenerateParty}>
        Generate Party
      </button>

      <button onClick={handleSaveParty}>
        Save Party
      </button>

      {party.length > 0 && (
        <ul>
          {party.map((monster, index) => (
            <li key={`${monster.name}-${index}`}>
              {monster.name} — CR {monster.cr} — {monster.habitat} —{" "}
              {monster.type} — {monster.group}
            </li>
          ))}
        </ul>
      )}

      {savedParties.length > 0 && (
        <>
          <h3>Saved Parties</h3>

          {savedParties.map((savedParty, partyIndex) => (
            <div key={partyIndex}>
              <h4>Party {partyIndex + 1}</h4>
              <ul>
                {savedParty.map((monster, monsterIndex) => (
                  <li key={`${monster.name}-${partyIndex}-${monsterIndex}`}>
                    {monster.name} — CR {monster.cr}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </section>
  );
}