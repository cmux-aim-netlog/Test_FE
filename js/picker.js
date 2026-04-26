window.Picker = (() => {
  const filterMenus = (activeCategories) => {
    if (!activeCategories || activeCategories.length === 0) {
      return window.MENU_DATA;
    }
    return window.MENU_DATA.filter((m) => activeCategories.includes(m.category));
  };

  const pickRandom = (list, exclude) => {
    if (list.length === 0) return null;
    const candidates = list.length > 1 && exclude
      ? list.filter((m) => m.name !== exclude)
      : list;
    const idx = Math.floor(Math.random() * candidates.length);
    return candidates[idx];
  };

  return { filterMenus, pickRandom };
})();
