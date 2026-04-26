window.History = (() => {
  const MAX_ITEMS = 10;

  const formatTime = (ts) => {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`;
  };

  const add = (menuName) => {
    const list = window.Storage.getHistory();
    list.unshift({ name: menuName, ts: Date.now() });
    const trimmed = list.slice(0, MAX_ITEMS);
    window.Storage.setHistory(trimmed);
    return trimmed;
  };

  const list = () => window.Storage.getHistory();

  const clear = () => {
    window.Storage.setHistory([]);
    return [];
  };

  const lastName = () => {
    const items = window.Storage.getHistory();
    return items[0]?.name ?? null;
  };

  return { add, list, clear, lastName, formatTime };
})();
