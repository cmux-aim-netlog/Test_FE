window.UI = (() => {
  const els = {
    result:        () => document.getElementById("result"),
    pickBtn:       () => document.getElementById("pickBtn"),
    filtersBox:    () => document.getElementById("categoryFilters"),
    historyList:   () => document.getElementById("historyList"),
    clearHistory:  () => document.getElementById("clearHistoryBtn"),
  };

  const renderResult = (menu) => {
    const el = els.result();
    if (!menu) {
      el.textContent = "선택된 카테고리에 메뉴가 없어요 😢";
      el.classList.remove("is-pop");
      el.classList.add("is-shake");
      setTimeout(() => el.classList.remove("is-shake"), 350);
      return;
    }
    el.textContent = `${menu.name}  ·  ${menu.category}`;
    el.classList.remove("is-pop");
    void el.offsetWidth; // restart animation
    el.classList.add("is-pop");
  };

  const renderFilters = (categories, active, onToggle) => {
    const box = els.filtersBox();
    box.innerHTML = "";
    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "chip" + (active.includes(cat) ? " chip--active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", () => onToggle(cat));
      box.appendChild(btn);
    });
  };

  const renderHistory = (items) => {
    const list = els.historyList();
    list.innerHTML = "";
    if (items.length === 0) {
      const li = document.createElement("li");
      li.className = "history__item history__item--empty";
      li.textContent = "아직 추천 기록이 없어요.";
      list.appendChild(li);
      return;
    }
    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "history__item";
      li.innerHTML = `
        <span>${item.name}</span>
        <span class="history__time">${window.History.formatTime(item.ts)}</span>
      `;
      list.appendChild(li);
    });
  };

  return { els, renderResult, renderFilters, renderHistory };
})();
