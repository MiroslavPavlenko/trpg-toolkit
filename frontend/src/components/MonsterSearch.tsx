import { useState, useEffect } from "react";
import { fetchDndMonster, type DndMonster } from "../services/dndMonsterSearch";
import { searchMonsters55, fetchMonster55ByName, type Monster55 } from "../services/monsters55Search";
import { useRuleSet } from "../context/RuleSetContext";

export default function MonsterSearch() {
  const { ruleSet } = useRuleSet();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Monster55[]>([]);
  const [monster55, setMonster55] = useState<Monster55 | null>(null);
  const [monster5e, setMonster5e] = useState<DndMonster | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setQuery("");
    setResults([]);
    setMonster55(null);
    setMonster5e(null);
    setError("");
  }, [ruleSet]);

  async function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setMonster55(null);
    setMonster5e(null);
    setResults([]);
    try {
      if (ruleSet === "5.5") {
        const found = await searchMonsters55(query, 10);
        if (found.length === 0) {
          setError("No monsters found. Check that data is imported in Supabase.");
        } else if (found.length === 1) {
          setMonster55(found[0]);
        } else {
          setResults(found);
        }
      } else {
        const result = await fetchDndMonster(query);
        setMonster5e(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(name: string) {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      setMonster55(await fetchMonster55ByName(name));
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

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 5.5e: multiple matches list */}
      {results.length > 1 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {results.map((m) => (
            <li key={m.Name}>
              <button onClick={() => handleSelect(m.Name)}>
                {m.Name} — CR {m.CR} — {m.Type}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 5.5e stat block */}
      {monster55 && (
        <div>
          {monster55["Image URL"] && (
            <img src={monster55["Image URL"]} alt={monster55.Name} style={{ maxHeight: "150px" }} />
          )}
          <h3>{monster55.Name}</h3>
          <p><strong>Type:</strong> {monster55.Size} {monster55.Type}</p>
          <p><strong>Alignment:</strong> {monster55.Alignment ?? "—"}</p>
          <p><strong>CR:</strong> {monster55.CR} ({monster55.XP ?? "—"} XP)</p>
          {monster55.Legendary && <p><strong>Legendary Monster</strong></p>}
          <p><strong>HP:</strong> {monster55.HP ?? "—"}</p>
          <p><strong>AC:</strong> {monster55.AC ?? "—"}</p>
          <p><strong>Speed:</strong> {monster55.Speed ?? "—"}</p>
          <p><strong>Initiative:</strong> {monster55.Initiative ?? "—"}</p>
          <p>
            <strong>STR</strong> {monster55.STR} &nbsp;
            <strong>DEX</strong> {monster55.DEX} &nbsp;
            <strong>CON</strong> {monster55.CON} &nbsp;
            <strong>INT</strong> {monster55.INT} &nbsp;
            <strong>WIS</strong> {monster55.WIS} &nbsp;
            <strong>CHA</strong> {monster55.CHA}
          </p>
          {monster55.Skills && <p><strong>Skills:</strong> {monster55.Skills}</p>}
          {monster55.Senses && <p><strong>Senses:</strong> {monster55.Senses}</p>}
          {monster55.Languages && <p><strong>Languages:</strong> {monster55.Languages}</p>}
          {monster55.Habitat && <p><strong>Habitat:</strong> {monster55.Habitat}</p>}
          {monster55.Source && <p><strong>Source:</strong> {monster55.Source}</p>}
          {monster55.Immunities && <p><strong>Immunities:</strong> {monster55.Immunities}</p>}
          {monster55.Resistances && <p><strong>Resistances:</strong> {monster55.Resistances}</p>}
          {monster55.Vulnerabilities && <p><strong>Vulnerabilities:</strong> {monster55.Vulnerabilities}</p>}
          {monster55.Traits && <div style={{ textAlign: "left" }}><strong>Traits:</strong><p>{monster55.Traits}</p></div>}
          {monster55.Actions && <div style={{ textAlign: "left" }}><strong>Actions:</strong><p>{monster55.Actions}</p></div>}
          {monster55["Bonus Actions"] && <div style={{ textAlign: "left" }}><strong>Bonus Actions:</strong><p>{monster55["Bonus Actions"]}</p></div>}
          {monster55.Reactions && <div style={{ textAlign: "left" }}><strong>Reactions:</strong><p>{monster55.Reactions}</p></div>}
          {monster55["Legendary Actions"] && <div style={{ textAlign: "left" }}><strong>Legendary Actions:</strong><p>{monster55["Legendary Actions"]}</p></div>}
        </div>
      )}

      {/* 5e stat block */}
      {monster5e && (
        <div>
          <h3>{monster5e.name}</h3>
          <p><strong>Type:</strong> {monster5e.size} {monster5e.type}{monster5e.subtype ? ` (${monster5e.subtype})` : ""}</p>
          <p><strong>Alignment:</strong> {monster5e.alignment}</p>
          <p><strong>CR:</strong> {monster5e.challenge_rating} ({monster5e.xp} XP)</p>
          <p><strong>HP:</strong> {monster5e.hit_points} ({monster5e.hit_dice}) — roll: {monster5e.hit_points_roll}</p>
          <p><strong>AC:</strong> {monster5e.armor_class.map((a) => `${a.value} (${a.type})`).join(", ")}</p>
          <p><strong>Speed:</strong> {Object.entries(monster5e.speed).map(([k, v]) => `${k} ${v}`).join(", ")}</p>
          <p>
            <strong>STR</strong> {monster5e.strength} &nbsp;
            <strong>DEX</strong> {monster5e.dexterity} &nbsp;
            <strong>CON</strong> {monster5e.constitution} &nbsp;
            <strong>INT</strong> {monster5e.intelligence} &nbsp;
            <strong>WIS</strong> {monster5e.wisdom} &nbsp;
            <strong>CHA</strong> {monster5e.charisma}
          </p>
          {monster5e.proficiencies.length > 0 && (
            <p><strong>Proficiencies:</strong> {monster5e.proficiencies.map((p) => `${p.proficiency.name} +${p.value}`).join(", ")}</p>
          )}
          {monster5e.damage_vulnerabilities.length > 0 && (
            <p><strong>Vulnerabilities:</strong> {monster5e.damage_vulnerabilities.join(", ")}</p>
          )}
          {monster5e.damage_resistances.length > 0 && (
            <p><strong>Resistances:</strong> {monster5e.damage_resistances.join(", ")}</p>
          )}
          {monster5e.damage_immunities.length > 0 && (
            <p><strong>Immunities:</strong> {monster5e.damage_immunities.join(", ")}</p>
          )}
          {monster5e.condition_immunities.length > 0 && (
            <p><strong>Condition Immunities:</strong> {monster5e.condition_immunities.map((c) => c.name).join(", ")}</p>
          )}
          <p><strong>Senses:</strong> {[
            monster5e.senses.darkvision && `Darkvision ${monster5e.senses.darkvision}`,
            monster5e.senses.blindsight && `Blindsight ${monster5e.senses.blindsight}`,
            monster5e.senses.tremorsense && `Tremorsense ${monster5e.senses.tremorsense}`,
            monster5e.senses.truesight && `Truesight ${monster5e.senses.truesight}`,
            `Passive Perception ${monster5e.senses.passive_perception}`,
          ].filter(Boolean).join(", ")}</p>
          <p><strong>Languages:</strong> {monster5e.languages || "—"}</p>
          {monster5e.special_abilities && monster5e.special_abilities.length > 0 && (
            <div style={{ textAlign: "left" }}>
              <strong>Special Abilities:</strong>
              {monster5e.special_abilities.map((a) => (
                <p key={a.name}><em>{a.name}:</em> {a.desc}</p>
              ))}
            </div>
          )}
          {monster5e.actions.length > 0 && (
            <div style={{ textAlign: "left" }}>
              <strong>Actions:</strong>
              {monster5e.actions.map((a) => (
                <p key={a.name}><em>{a.name}:</em> {a.desc}</p>
              ))}
            </div>
          )}
          {monster5e.reactions && monster5e.reactions.length > 0 && (
            <div style={{ textAlign: "left" }}>
              <strong>Reactions:</strong>
              {monster5e.reactions.map((r) => (
                <p key={r.name}><em>{r.name}:</em> {r.desc}</p>
              ))}
            </div>
          )}
          {monster5e.legendary_actions && monster5e.legendary_actions.length > 0 && (
            <div style={{ textAlign: "left" }}>
              <strong>Legendary Actions:</strong>
              {monster5e.legendary_actions.map((a) => (
                <p key={a.name}><em>{a.name}:</em> {a.desc}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
