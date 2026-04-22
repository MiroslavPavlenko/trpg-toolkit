import { useState } from "react";
import { fetchDndMonster, type DndMonster } from "../services/dndMonsterSearch";

// Displays a search form for D&D monsters and shows the full stat block from the API.
// To add more fields to the output, update the DndMonster interface in dndMonsterSearch.ts first.
export default function MonsterSearch() {
  // What the user is typing in the input box
  const [query, setQuery] = useState<string>("");
  // The monster returned by the API — null means nothing has been fetched yet
  const [monster, setMonster] = useState<DndMonster | null>(null);
  // Error message shown if the API call fails
  const [error, setError] = useState<string>("");
  // True while the API call is in progress — disables the button to prevent double-submits
  const [loading, setLoading] = useState<boolean>(false);

  // Runs when the user submits the form.
  // Calls the API and stores the result, or stores an error message if it fails.
  async function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setMonster(null);
    try {
      const result = await fetchDndMonster(query);
      setMonster(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>D&D Monster Search</h2>
      <form onSubmit={handleSearch} style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        <input
          type="text"
          placeholder="e.g. goblin, dragon, beholder"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Show error only if the fetch failed */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Show stat block only once a result has been fetched */}
      {monster && (
        <div>
          <h3>{monster.name}</h3>

          {/* Basic Info */}
          <p><strong>Type:</strong> {monster.size} {monster.type}{monster.subtype ? ` (${monster.subtype})` : ""}</p>
          <p><strong>Alignment:</strong> {monster.alignment}</p>
          <p><strong>CR:</strong> {monster.challenge_rating} ({monster.xp} XP)</p>

          {/* Combat Stats */}
          <p><strong>HP:</strong> {monster.hit_points} ({monster.hit_dice}) — roll: {monster.hit_points_roll}</p>
          <p><strong>AC:</strong> {monster.armor_class.map((a) => `${a.value} (${a.type})`).join(", ")}</p>
          <p><strong>Speed:</strong> {Object.entries(monster.speed).map(([k, v]) => `${k} ${v}`).join(", ")}</p>

          {/* Ability Scores */}
          <p>
            <strong>STR</strong> {monster.strength} &nbsp;
            <strong>DEX</strong> {monster.dexterity} &nbsp;
            <strong>CON</strong> {monster.constitution} &nbsp;
            <strong>INT</strong> {monster.intelligence} &nbsp;
            <strong>WIS</strong> {monster.wisdom} &nbsp;
            <strong>CHA</strong> {monster.charisma}
          </p>

          {/* Only render proficiencies if the monster has any */}
          {monster.proficiencies.length > 0 && (
            <p><strong>Proficiencies:</strong> {monster.proficiencies.map((p) => `${p.proficiency.name} +${p.value}`).join(", ")}</p>
          )}

          {/* Damage modifiers — each block only renders if the array is non-empty */}
          {monster.damage_vulnerabilities.length > 0 && (
            <p><strong>Vulnerabilities:</strong> {monster.damage_vulnerabilities.join(", ")}</p>
          )}
          {monster.damage_resistances.length > 0 && (
            <p><strong>Resistances:</strong> {monster.damage_resistances.join(", ")}</p>
          )}
          {monster.damage_immunities.length > 0 && (
            <p><strong>Immunities:</strong> {monster.damage_immunities.join(", ")}</p>
          )}
          {monster.condition_immunities.length > 0 && (
            <p><strong>Condition Immunities:</strong> {monster.condition_immunities.map((c) => c.name).join(", ")}</p>
          )}

          {/* Senses — filter(Boolean) removes any undefined senses before joining */}
          <p><strong>Senses:</strong> {[
            monster.senses.darkvision && `Darkvision ${monster.senses.darkvision}`,
            monster.senses.blindsight && `Blindsight ${monster.senses.blindsight}`,
            monster.senses.tremorsense && `Tremorsense ${monster.senses.tremorsense}`,
            monster.senses.truesight && `Truesight ${monster.senses.truesight}`,
            `Passive Perception ${monster.senses.passive_perception}`,
          ].filter(Boolean).join(", ")}</p>
          <p><strong>Languages:</strong> {monster.languages || "—"}</p>

          {/* Special Abilities, Actions, Reactions, Legendary Actions — all optional */}
          {monster.special_abilities && monster.special_abilities.length > 0 && (
            <div>
              <strong>Special Abilities:</strong>
              {monster.special_abilities.map((a) => (
                <p key={a.name}><em>{a.name}:</em> {a.desc}</p>
              ))}
            </div>
          )}

          {monster.actions.length > 0 && (
            <div>
              <strong>Actions:</strong>
              {monster.actions.map((a) => (
                <p key={a.name}><em>{a.name}:</em> {a.desc}</p>
              ))}
            </div>
          )}

          {monster.reactions && monster.reactions.length > 0 && (
            <div>
              <strong>Reactions:</strong>
              {monster.reactions.map((r) => (
                <p key={r.name}><em>{r.name}:</em> {r.desc}</p>
              ))}
            </div>
          )}

          {monster.legendary_actions && monster.legendary_actions.length > 0 && (
            <div>
              <strong>Legendary Actions:</strong>
              {monster.legendary_actions.map((a) => (
                <p key={a.name}><em>{a.name}:</em> {a.desc}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
