import { saveToDB, updateItemsLeft } from "./utils";
import { removeIdFromDB } from "./utils";
import { updateFilterButtons } from "./elements";
import type { ToggleTheme } from "./types";

export const toggleTask = (event: MouseEvent | KeyboardEvent) => {
  if (
    event.type !== "click" &&
    (event.type !== "keydown" || (event as KeyboardEvent).key !== "Enter")
  )
    return;
  const listItem = (event.target as HTMLElement).closest("li");
  const toggleButton = listItem?.querySelector(".todo-checkbox");
  const checkedIcon = listItem?.querySelector("img");
  checkedIcon?.classList.toggle("hidden");

  const textSpan = listItem?.querySelector("span");

  ["text-[#d1d2da]", "dark:text-[#4d5067]", "line-through"].forEach((clas) => {
    textSpan?.classList.toggle(clas);
  });

  ["text-[#494c6b]", "dark:text-[#c8cbe7]"].forEach((clas) => {
    textSpan?.classList.toggle(clas);
  });

  ["bg-linear-to-br", "from-[#57ddff]", "to-[#c058f3]"].forEach((clas) => {
    toggleButton?.classList.toggle(clas);
  });

  const isChecked = textSpan?.classList.contains("line-through") ?? false;

  if (listItem) {
    listItem.dataset.completed = String(isChecked);
  }

  updateFilterButtons();

  const taskId = listItem?.id;

  if (isChecked) {
    saveToDB("checkedTask-id", `${taskId}`);
  } else {
    taskId && removeIdFromDB(taskId);
  }
  updateItemsLeft();
};

export const toggleTheme = (event: MouseEvent | KeyboardEvent) => {
  const body = document.querySelector("body");
  body?.classList.toggle("dark");
  const isDark = body?.classList.contains("dark");
  const savedStatus = {
    isDark,
  };
  saveToDB("toggleTheme", savedStatus as ToggleTheme);
};
