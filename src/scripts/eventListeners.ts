import {
  afterTaskAdded,
  handleFilter,
  removeCompletedTask,
} from "./utils";
import { AddingTask } from "./utils";
import {
  clearCompletedButton,
  themeToggleButton,
  todoForm,
  todoList,
} from "./elements";
import { toggleTask, toggleTheme } from "./toggle";
import {
  handleTaskDragEnd,
  handleTaskDragOver,
  handleTaskDragStart,
  handleTaskDrop,
} from "./dragAndDrop";

export const initAppListeners = () => {
  themeToggleButton?.addEventListener("click", toggleTheme);
  todoForm?.addEventListener("submit", AddingTask);
  todoList?.addEventListener("click", afterTaskAdded);
  todoList?.addEventListener("dragstart", handleTaskDragStart);
  todoList?.addEventListener("dragover", handleTaskDragOver);
  todoList?.addEventListener("drop", handleTaskDrop);
  todoList?.addEventListener("dragend", handleTaskDragEnd);
  document
    .querySelectorAll("#filters-desktop, #filters-mobile")
    .forEach((filterContainer) =>
      filterContainer.addEventListener("click", handleFilter),
    );
  clearCompletedButton?.addEventListener("click", removeCompletedTask);
};
