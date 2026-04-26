(() => {
  const state = {
    activeCategories: window.Storage.getFilters(),
  };

  const refreshFilters = () => {
    window.UI.renderFilters(
      window.CATEGORIES,
      state.activeCategories,
      toggleCategory
    );
  };

  const toggleCategory = (cat) => {
    const i = state.activeCategories.indexOf(cat);
    if (i >= 0) state.activeCategories.splice(i, 1);
    else state.activeCategories.push(cat);
    window.Storage.setFilters(state.activeCategories);
    refreshFilters();
  };

  const handlePick = () => {
    const pool = window.Picker.filterMenus(state.activeCategories);
    const menu = window.Picker.pickRandom(pool, window.History.lastName());
    window.UI.renderResult(menu);
    if (menu) {
      const updated = window.History.add(menu.name);
      window.UI.renderHistory(updated);
    }
  };

  const handleClearHistory = () => {
    const cleared = window.History.clear();
    window.UI.renderHistory(cleared);
  };

  const init = () => {
    refreshFilters();
    window.UI.renderHistory(window.History.list());
    window.UI.els.pickBtn().addEventListener("click", handlePick);
    window.UI.els.clearHistory().addEventListener("click", handleClearHistory);
  };

  document.addEventListener("DOMContentLoaded", init);
})();
