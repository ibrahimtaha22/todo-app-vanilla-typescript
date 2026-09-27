export const todoList = document.querySelector(
  "#todo-list",
) as HTMLUListElement;
export const todoForm = document.querySelector("#todo-form");

export const themeToggleButton = document.querySelector("#theme-toggle");

export const getEmptyStateElement = () => document.querySelector(".EmptyList");

export const clearCompletedButton = document.querySelector("#clear-completed");

export const EmptyList = document.querySelector(".EmptyList");
export const bodyElement = document.querySelector("body");
export const itemsLeft = document.querySelector("#items-left");

export type TaskFilter = "all" | "active" | "completed";

let currentTaskFilter: TaskFilter = "all";

export const getCurrentTaskFilter = () => currentTaskFilter;

export const applyTaskFilter = (filter: TaskFilter) => {
  currentTaskFilter = filter;

  document
    .querySelectorAll<HTMLButtonElement>(".filter-btn[data-filter]")
    .forEach((button) => {
      const isSelected = button.dataset.filter === filter;
      button.classList.toggle("text-[#3a7bfd]", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

  todoList?.querySelectorAll<HTMLLIElement>("li[data-completed]").forEach((item) => {
    const isCompleted = item.dataset.completed === "true";
    const shouldHide =
      (filter === "active" && isCompleted) ||
      (filter === "completed" && !isCompleted);

    item.classList.toggle("hidden", shouldHide);
  });
};

export const updateFilterButtons = () => {
  const taskCounts = {
    active:
      todoList?.querySelectorAll('li[data-completed="false"]').length ?? 0,
    completed:
      todoList?.querySelectorAll('li[data-completed="true"]').length ?? 0,
  };

  (Object.keys(taskCounts) as Array<keyof typeof taskCounts>).forEach(
    (filter) => {
      const isDisabled = taskCounts[filter] === 0;
      document
        .querySelectorAll<HTMLButtonElement>(`[data-filter="${filter}"]`)
        .forEach((button) => {
          button.disabled = isDisabled;
          button.setAttribute("aria-disabled", String(isDisabled));
        });
    },
  );

  const selectedFilterCount =
    currentTaskFilter === "active"
      ? taskCounts.active
      : currentTaskFilter === "completed"
        ? taskCounts.completed
        : null;

  if (selectedFilterCount === 0) {
    applyTaskFilter("all");
  }
};
