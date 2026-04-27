import { useState } from "react";
import { fetchDndMonster } from "../services/dndMonsterSearch";

function AddParticipantForm({ onAdd }) {
  const [tab, setTab] = useState("monster");
  const [query, setQuery] = useState("");
  const [monster, setMonster] = useState(null);
  const [monsterError, setMonsterError] = useState("");
  const [loading, setLoading] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerDex, setPlayerDex] = useState(10);
  const [playerHp, setPlayerHp] = useState(20);
  const [playerInitiative, setPlayerInitiative] = useState("");
  
  function sizeToCells(sizeStr) {
    switch (sizeStr) {
        case "Tiny":       
        case "Small":      
        case "Medium":     return 1;
        case "Large":      return 2;
        case "Huge":       return 3;
        case "Gargantuan": return 4;
        default:           return 1;
    }
  }

  async function handleMonsterSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setMonsterError("");
    setMonster(null);
    try {
      const result = await fetchDndMonster(query);
      setMonster(result);
    } catch (err) {
      setMonsterError(err instanceof Error ? err.message : "Not found");
    } finally {
      setLoading(false);
    }
  }

  function handleAddMonster() {
    if (!monster) return;
    onAdd({
      id: `${monster.index}-${Date.now()}`,
      name: monster.name,
      type: "monster",
      dexterity: monster.dexterity,
      hit_points: monster.hit_points,
      size: sizeToCells(monster.size),
      data: monster,
      
    });
    setMonster(null);
    setQuery("");
  }

  function handleAddPlayer(e) {
    e.preventDefault();
    if (!playerName.trim()) return;
    const player = {
      name: playerName.trim(),
      dexterity: Number(playerDex),
      hit_points: Number(playerHp),
    };
    onAdd({
      id: `player-${Date.now()}`,
      name: player.name,
      type: "player",
      dexterity: player.dexterity,
      size: 1,
      hit_points: player.hit_points,
      ...(playerInitiative !== "" && { initiative_override: Number(playerInitiative) }),
      data: player,
    });
    setPlayerName("");
    setPlayerDex(10);
    setPlayerHp(20);
    setPlayerInitiative("");
  }

  const tabStyle = (active) => ({
    padding: "6px 16px",
    border: "none",
    borderBottom: active ? "2px solid #fff" : "2px solid transparent",
    background: "transparent",
    color: active ? "#fff" : "#888",
    cursor: "pointer",
    fontWeight: active ? "bold" : "normal",
  });

  return (
    <div>
      <div style={{ display: "flex", gap: "4px", marginBottom: "16px", borderBottom: "1px solid #444" }}>
        <button style={tabStyle(tab === "monster")} onClick={() => setTab("monster")}>Monster</button>
        <button style={tabStyle(tab === "player")} onClick={() => setTab("player")}>Player</button>
      </div>

      {tab === "monster" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <form onSubmit={handleMonsterSearch} style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="e.g. goblin, dragon, beholder"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Searching…" : "Search"}
            </button>
          </form>
          {monsterError && <p style={{ color: "red", margin: 0 }}>{monsterError}</p>}
          {monster && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <div>
                <strong>{monster.name}</strong>
                <span style={{ marginLeft: "12px", color: "#aaa", fontSize: "0.9em" }}>
                  DEX {monster.dexterity} · HP {monster.hit_points}
                </span>
              </div>
              <button onClick={handleAddMonster}>Add to Combat</button>
            </div>
          )}
        </div>
      )}

      {tab === "player" && (
        <form onSubmit={handleAddPlayer} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Name
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="Player name"
              style={{ width: "60%" }}
            />
          </label>
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            DEX score
            <input
              type="number"
              min={1}
              max={30}
              value={playerDex}
              onChange={e => setPlayerDex(e.target.value)}
              style={{ width: "60px" }}
            />
          </label>
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Max HP
            <input
              type="number"
              min={1}
              value={playerHp}
              onChange={e => setPlayerHp(e.target.value)}
              style={{ width: "60px" }}
            />
          </label>
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Initiative (optional)
            <input
              type="number"
              min={1}
              max={30}
              value={playerInitiative}
              onChange={e => setPlayerInitiative(e.target.value)}
              placeholder="roll manually"
              style={{ width: "60px" }}
            />
          </label>
          <button type="submit" style={{ alignSelf: "flex-end" }}>Add Player</button>
        </form>
      )}
    </div>
  );
}

export default AddParticipantForm;