import { useEffect, useState } from "react";
import StatsWindow from "../components/StatsWindow";

const STATS_WINDOW_STORAGE_KEY = "trpg-toolkit:stats-window";

function readSnapshot() {
  try {
    const raw = localStorage.getItem(STATS_WINDOW_STORAGE_KEY);
    if (!raw) return { queue: [] };
    const parsed = JSON.parse(raw);
    return { queue: parsed.queue ?? [] };
  } catch {
    return { queue: [] };
  }
}

function sendAction(action) {
  window.opener?.postMessage(
    {
      source: "TRPG_STATS_WINDOW",
      ...action,
    },
    window.location.origin,
  );
}

function StatsPopout() {
  const [queue, setQueue] = useState(() => readSnapshot().queue);

  useEffect(() => {
    document.title = "TRPG Stats";
    document.body.style.background = "#263238";
    document.body.style.overflow = "hidden";

    function applySnapshot(snapshot) {
      if (snapshot?.type !== "TRPG_STATS_SNAPSHOT") return;
      setQueue(snapshot.queue ?? []);
    }

    function onMessage(event) {
      if (event.origin !== window.location.origin) return;
      applySnapshot(event.data);
    }

    function onStorage(event) {
      if (event.key !== STATS_WINDOW_STORAGE_KEY || !event.newValue) return;
      try {
        applySnapshot(JSON.parse(event.newValue));
      } catch {
        // Ignore malformed snapshots from old sessions.
      }
    }

    function onBeforeUnload() {
      sendAction({ action: "close" });
    }

    window.addEventListener("message", onMessage);
    window.addEventListener("storage", onStorage);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  function closeWindow() {
    sendAction({ action: "close" });
    window.close();
  }

  function removeParticipant(id) {
    setQueue((currentQueue) => currentQueue.filter((entry) => entry.id !== id));
    sendAction({ action: "remove", id });
  }

  return (
    <StatsWindow
      isOpen
      queue={queue}
      popout
      onClose={closeWindow}
      onDamage={(id, amount) => sendAction({ action: "damage", id, amount })}
      onHeal={(id, amount) => sendAction({ action: "heal", id, amount })}
      onApplyStatus={(id, status) => sendAction({ action: "applyStatus", id, status })}
      onRemoveStatus={(id, instanceId) => sendAction({ action: "removeStatus", id, instanceId })}
      onRemove={removeParticipant}
    />
  );
}

export default StatsPopout;
