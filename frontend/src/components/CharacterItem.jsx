import "../style/CharacterItem.css";

function CharacterItem({ character, isActive, onClick }) {
  const typeClass =
    character.type === "player" ? "character-item-player" : "character-item-enemy";

  return (
    <button
      className={`character-item ${typeClass} ${isActive ? "character-item-active" : ""}`}
      onClick={onClick}
      title={character.name}
    >
      <span className="character-item-icon">👤</span>
    </button>
  );
}

export default CharacterItem;