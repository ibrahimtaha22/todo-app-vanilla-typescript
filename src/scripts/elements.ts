export const todoList = document.querySelector(
  "#todo-list",
) as HTMLUListElement;
export const todoForm = document.querySelector("#todo-form");

export const themeToggleButton = document.querySelector("#theme-toggle");

export const getEmptyStateElement = () => document.querySelector(".EmptyList");

export const filterBox = document.querySelector("#filters-desktop");
export const clearCompletedButton = document.querySelector("#clear-completed");

export const EmptyList = document.querySelector(".EmptyList");
export const bodyElement = document.querySelector("body");
export const itemsLeft = document.querySelector("#items-left");

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
};
