window.Storage = (() => {
  const HISTORY_KEY = "lunch-picker:history";
  const FILTERS_KEY = "lunch-picker:filters";

  const safeGet = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const safeSet = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  };

  return {
    getHistory: () => safeGet(HISTORY_KEY, []),
    setHistory: (list) => safeSet(HISTORY_KEY, list),
    getFilters: () => safeGet(FILTERS_KEY, []),
    setFilters: (list) => safeSet(FILTERS_KEY, list),
  };
})();
