import {
  afterTaskAdded,
  handleFilter,
  removeCompletedTask,
  updateItemsLeft,
} from "./utils";
//@ts-ignore
import { AddingTask } from "./utils";
import {
  clearCompletedButton,
  filterBox,
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
  todoList?.addEventListener("click", updateItemsLeft);
  todoList?.addEventListener("click", afterTaskAdded);
  todoList?.addEventListener("dragstart", handleTaskDragStart);
  todoList?.addEventListener("dragover", handleTaskDragOver);
  todoList?.addEventListener("drop", handleTaskDrop);
  todoList?.addEventListener("dragend", handleTaskDragEnd);
  filterBox?.addEventListener("click", handleFilter);
  clearCompletedButton?.addEventListener("click", removeCompletedTask);
};
