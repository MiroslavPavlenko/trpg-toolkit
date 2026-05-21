import { useEffect, useMemo, useRef, useState } from "react";
import {
  LuBadgePlus,
  LuEye,
  LuEyeOff,
  LuGripVertical,
  LuHeartCrack,
  LuHeartPulse,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import { fetchAllStatuses } from "../services/statusesService";
import "../style/StatsWindow.css";

function getMaxHp(creature) {
  return creature.data?.hit_points ?? creature.data?.hp ?? creature.hit_points ?? 0;
}

function getArmorClass(creature) {
  const ac = creature.data?.armor_class;
  if (Array.isArray(ac)) return ac[0]?.value ?? null;
  return creature.data?.ac ?? creature.armor_class ?? null;
}

function getAbility(creature, shortName, longName) {
  return creature.data?.[shortName] ?? creature.data?.[longName] ?? creature[shortName] ?? null;
}

function abilityMod(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "";
  const mod = Math.floor((Number(value) - 10) / 2);
  return mod >= 0 ? `+${mod}` : String(mod);
}

function makeStatusInstance(status, turns) {
  const instanceId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${status.id}-${Date.now()}-${Math.random()}`;

  return {
    instanceId,
    statusId: status.id,
    name: status.name,
    turnsRemaining: turns,
    stackable: status.stackable,
    effect_summary: status.effect_summary ?? null,
  };
}

function formatStatusLabel(status) {
  return status.statusId === "down" || status.turnsRemaining === null
    ? status.name
    : `${status.name} (${status.turnsRemaining}t)`;
}

function textList(value) {
  if (!value) return "";
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item) return "";
        if (typeof item === "object") {
          const name = item.name ? `${item.name}. ` : "";
          return `${name}${item.desc ?? item.description ?? textList(item)}`;
        }
        return String(item);
      })
      .filter(Boolean)
      .join("\n");
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${key} ${item}`)
      .join(", ");
  }
  return String(value);
}

function DetailBlock({ title, children }) {
  if (!children) return null;
  return (
    <section className="stats-card__detail-block">
      <h4>{title}</h4>
      <div>{children}</div>
    </section>
  );
}

function ActionControls({ creature, statuses, onDamage, onHeal, onApplyStatus, onRemove }) {
  const [amount, setAmount] = useState(1);
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [turns, setTurns] = useState(1);

  const selectedStatus = statuses.find((status) => status.id === selectedStatusId);
  const activeStatuses = creature.statuses ?? [];
  const alreadyApplied =
    selectedStatus && !selectedStatus.stackable
      ? activeStatuses.some((status) => status.statusId === selectedStatus.id)
      : false;

  function applyDamage() {
    const parsed = Number(amount);
    if (parsed > 0) onDamage(creature.id, parsed);
  }

  function applyHeal() {
    const parsed = Number(amount);
    if (parsed > 0) onHeal(creature.id, parsed);
  }

  function applyStatus() {
    const parsedTurns = Number(turns);
    if (!selectedStatus || parsedTurns < 1 || alreadyApplied) return;
    onApplyStatus(creature.id, makeStatusInstance(selectedStatus, parsedTurns));
    setSelectedStatusId("");
    setTurns(1);
  }

  return (
    <div className="stats-actions" aria-label={`${creature.name} shortcuts`}>
      <label className="stats-actions__amount">
        <span>HP</span>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </label>
      <button type="button" className="stats-icon-btn stats-icon-btn--damage" onClick={applyDamage}>
        <LuHeartCrack />
        <span>Damage</span>
      </button>
      <button type="button" className="stats-icon-btn stats-icon-btn--heal" onClick={applyHeal}>
        <LuHeartPulse />
        <span>Heal</span>
      </button>
      <select
        className="stats-actions__status"
        value={selectedStatusId}
        onChange={(event) => setSelectedStatusId(event.target.value)}
        aria-label={`status for ${creature.name}`}
      >
        <option value="">Status</option>
        {statuses.map((status) => (
          <option key={status.id} value={status.id}>
            {status.name}
          </option>
        ))}
      </select>
      <label className="stats-actions__turns">
        <span>Turns</span>
        <input
          type="number"
          min={1}
          value={turns}
          onChange={(event) => setTurns(event.target.value)}
        />
      </label>
      <button
        type="button"
        className="stats-icon-btn stats-icon-btn--status"
        onClick={applyStatus}
        disabled={!selectedStatusId || Number(turns) < 1 || alreadyApplied}
        title={alreadyApplied ? "Status is already active and cannot stack" : "Apply status"}
      >
        <LuBadgePlus />
        <span>Apply</span>
      </button>
      <button
        type="button"
        className="stats-icon-btn stats-icon-btn--remove"
        onClick={() => onRemove(creature.id)}
        title="Remove from map and initiative"
      >
        <LuTrash2 />
        <span>Remove</span>
      </button>
    </div>
  );
}

function CreatureCard({
  creature,
  zone,
  statuses,
  onDamage,
  onHeal,
  onApplyStatus,
  onRemoveStatus,
  onRemove,
}) {
  const maxHp = getMaxHp(creature);
  const hpPercent = maxHp > 0 ? Math.max(0, Math.min(100, (creature.hit_points / maxHp) * 100)) : 0;
  const ac = getArmorClass(creature);
  const abilities = [
    ["STR", getAbility(creature, "str", "strength")],
    ["DEX", getAbility(creature, "dex", "dexterity")],
    ["CON", getAbility(creature, "con", "constitution")],
    ["INT", getAbility(creature, "int", "intelligence")],
    ["WIS", getAbility(creature, "wis", "wisdom")],
    ["CHA", getAbility(creature, "cha", "charisma")],
  ];
  const activeStatuses = creature.statuses ?? [];
  const data = creature.data ?? {};

  return (
    <article className={`stats-card stats-card--${zone}`}>
      <header className="stats-card__header">
        <div>
          <h3>{creature.name}</h3>
          <p>
            {creature.type ?? "creature"}
            {creature.edition ? ` - ${creature.edition}` : ""}
            {creature.initiativeTotal !== undefined
              ? ` - Initiative ${creature.initiativeTotal}`
              : ""}
          </p>
        </div>
        <div className="stats-card__quick">
          {ac !== null && ac !== undefined && <span>AC {ac}</span>}
          <span>
            HP {creature.hit_points}
            {maxHp ? `/${maxHp}` : ""}
          </span>
        </div>
      </header>

      <div className="stats-card__hp-track">
        <div className="stats-card__hp-fill" style={{ width: `${hpPercent}%` }} />
      </div>

      <ActionControls
        creature={creature}
        statuses={statuses}
        onDamage={onDamage}
        onHeal={onHeal}
        onApplyStatus={onApplyStatus}
        onRemove={onRemove}
      />

      <div className="stats-card__abilities">
        {abilities.map(([label, value]) => (
          <div key={label} className="stats-card__ability">
            <span>{label}</span>
            <strong>{value ?? "-"}</strong>
            <small>{abilityMod(value)}</small>
          </div>
        ))}
      </div>

      <div className="stats-card__statuses">
        {activeStatuses.length === 0 ? (
          <span className="stats-card__empty-status">No active statuses</span>
        ) : (
          activeStatuses.map((status) => (
            <button
              key={status.instanceId}
              type="button"
              className="stats-card__status-pill"
              onClick={() => onRemoveStatus(creature.id, status.instanceId)}
              title={status.effect_summary ?? "Remove status"}
            >
              {formatStatusLabel(status)} x
            </button>
          ))
        )}
      </div>

      <div className="stats-card__details">
        <DetailBlock title="Core">
          <dl>
            <div>
              <dt>CR</dt>
              <dd>{data.cr ?? data.challenge_rating ?? "-"}</dd>
            </div>
            <div>
              <dt>Speed</dt>
              <dd>{textList(data.speed) || "-"}</dd>
            </div>
            <div>
              <dt>Senses</dt>
              <dd>{textList(data.senses) || "-"}</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>{data.languages || "-"}</dd>
            </div>
          </dl>
        </DetailBlock>
        <DetailBlock title="Defenses">
          <dl>
            <div>
              <dt>Resistances</dt>
              <dd>{textList(data.resistances ?? data.damage_resistances) || "-"}</dd>
            </div>
            <div>
              <dt>Immunities</dt>
              <dd>{textList(data.immunities ?? data.damage_immunities) || "-"}</dd>
            </div>
            <div>
              <dt>Vulnerabilities</dt>
              <dd>{textList(data.damage_vulnerabilities) || "-"}</dd>
            </div>
          </dl>
        </DetailBlock>
        <DetailBlock title="Traits">
          {textList(data.traits) || textList(data.special_abilities)}
        </DetailBlock>
        <DetailBlock title="Actions">{textList(data.actions)}</DetailBlock>
        <DetailBlock title="Bonus Actions">{textList(data.bonus_actions)}</DetailBlock>
        <DetailBlock title="Reactions">{textList(data.reactions)}</DetailBlock>
        <DetailBlock title="Legendary Actions">{textList(data.legendary_actions)}</DetailBlock>
      </div>
    </article>
  );
}

function StatsWindow({
  isOpen,
  openKey,
  queue,
  popout = false,
  onClose,
  onDamage,
  onHeal,
  onApplyStatus,
  onRemoveStatus,
  onRemove,
}) {
  const [revealed, setRevealed] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [statusError, setStatusError] = useState("");
  const [position, setPosition] = useState({ x: 96, y: 72 });
  const dragRef = useRef(null);

  const participantsInInitiative = useMemo(() => queue ?? [], [queue]);
  const playersInInitiative = useMemo(
    () => participantsInInitiative.filter((entry) => entry.type === "player"),
    [participantsInInitiative],
  );
  const monstersInInitiative = useMemo(
    () => participantsInInitiative.filter((entry) => entry.type !== "player"),
    [participantsInInitiative],
  );

  useEffect(() => {
    if (isOpen) setRevealed(false);
  }, [isOpen, openKey]);

  useEffect(() => {
    if (!isOpen) return undefined;
    let cancelled = false;
    fetchAllStatuses()
      .then((nextStatuses) => {
        if (!cancelled) setStatuses(nextStatuses);
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) setStatusError("Could not load statuses.");
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    function onPointerMove(event) {
      if (!dragRef.current) return;
      const nextX = event.clientX - dragRef.current.offsetX;
      const nextY = event.clientY - dragRef.current.offsetY;
      setPosition({
        x: Math.max(8, Math.min(window.innerWidth - 320, nextX)),
        y: Math.max(8, Math.min(window.innerHeight - 120, nextY)),
      });
    }

    function onPointerUp() {
      dragRef.current = null;
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const content = useMemo(
    () => (
      <aside
        className={`stats-window${popout ? " stats-window--popout" : ""}`}
        style={popout ? undefined : { left: position.x, top: position.y }}
        aria-label="Initiative stats window"
      >
        <header
          className="stats-window__header"
          onPointerDown={(event) => {
            dragRef.current = {
              offsetX: event.clientX - position.x,
              offsetY: event.clientY - position.y,
            };
          }}
        >
          <LuGripVertical aria-hidden="true" />
          <div>
            <h2>Stats</h2>
            <p>{participantsInInitiative.length} in initiative</p>
          </div>
          <button
            type="button"
            className="stats-window__header-btn"
            onClick={(event) => {
              event.stopPropagation();
              setRevealed((current) => !current);
            }}
            aria-label={revealed ? "hide stats" : "reveal stats"}
          >
            {revealed ? <LuEyeOff /> : <LuEye />}
          </button>
          <button
            type="button"
            className="stats-window__header-btn"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            aria-label="close stats"
          >
            <LuX />
          </button>
        </header>

        {!revealed ? (
          <div className="stats-window__hidden">
            <p>Player and creature information is hidden.</p>
            <button type="button" onClick={() => setRevealed(true)}>
              <LuEye />
              Reveal
            </button>
          </div>
        ) : (
          <div className="stats-window__body">
            {statusError && <p className="stats-window__error">{statusError}</p>}
            {participantsInInitiative.length === 0 ? (
              <p className="stats-window__empty">
                No players or creatures are currently in initiative.
              </p>
            ) : (
              <div className="stats-zones">
                <section className="stats-zone stats-zone--players">
                  <header className="stats-zone__header">
                    <h3>Players</h3>
                    <span>{playersInInitiative.length}</span>
                  </header>
                  <div className="stats-zone__list">
                    {playersInInitiative.length === 0 ? (
                      <p className="stats-zone__empty">No players in initiative.</p>
                    ) : (
                      playersInInitiative.map((creature) => (
                        <CreatureCard
                          key={creature.id}
                          creature={creature}
                          zone="player"
                          statuses={statuses}
                          onDamage={onDamage}
                          onHeal={onHeal}
                          onApplyStatus={onApplyStatus}
                          onRemoveStatus={onRemoveStatus}
                          onRemove={onRemove}
                        />
                      ))
                    )}
                  </div>
                </section>

                <section className="stats-zone stats-zone--monsters">
                  <header className="stats-zone__header">
                    <h3>Monsters</h3>
                    <span>{monstersInInitiative.length}</span>
                  </header>
                  <div className="stats-zone__list">
                    {monstersInInitiative.length === 0 ? (
                      <p className="stats-zone__empty">No monsters in initiative.</p>
                    ) : (
                      monstersInInitiative.map((creature) => (
                        <CreatureCard
                          key={creature.id}
                          creature={creature}
                          zone="monster"
                          statuses={statuses}
                          onDamage={onDamage}
                          onHeal={onHeal}
                          onApplyStatus={onApplyStatus}
                          onRemoveStatus={onRemoveStatus}
                          onRemove={onRemove}
                        />
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}
      </aside>
    ),
    [
      onApplyStatus,
      onClose,
      onDamage,
      onHeal,
      onRemove,
      onRemoveStatus,
      monstersInInitiative,
      participantsInInitiative,
      playersInInitiative,
      popout,
      position.x,
      position.y,
      revealed,
      statusError,
      statuses,
    ],
  );

  if (!isOpen) return null;

  return content;
}

export default StatsWindow;
