import {
  applyTaskFilter,
  getCurrentTaskFilter,
  getEmptyStateElement,
  itemsLeft,
  todoList,
  updateFilterButtons,
} from "./elements";
import { toggleTask } from "./toggle";
import type {
  AfterTaskAdded,
  DBData,
  GetFromDB,
  HasCompletedTask,
  RemoveFromDB,
  RemoveIdFromDB,
  RemoveTask,
  RenderEmptyState,
  RenderTask,
  Task,
} from "./types";

import checkmarkIcon from "../assets/icon-check.svg";
import crossIcon from "../assets/icon-cross.svg";
import emptyIcon from "../assets/icon-empty.svg";

export const AddingTask: (event: Event) => void = (event) => {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const inputElement = form.querySelector("input") as HTMLInputElement;
  const inputValue = inputElement?.value.trim();

  if (!inputValue) return;

  todoList?.querySelector(".EmptyList")?.remove();

  const savedTaskInfo = {
    id: Date.now(),
    task: inputValue,
  };

  saveToDB("tasks", savedTaskInfo);

  const TaskItem = ` <li
             id = ${savedTaskInfo.id}
             draggable="true"
            class="group flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5"
            data-completed="false"
        
          >
            <button
              type="button"
              class="todo-checkbox shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#e3e4f1] dark:border-[#393a4b] hover:border-transparent hover:bg-linear-to-br hover:from-[#57ddff] hover:to-[#c058f3] transition-colors flex justify-center items-center cursor-pointer"
            > <img class="hidden pointer-events-none" width="11" height="9" src="${checkmarkIcon}" /></button>
            <span
              class="flex-1 text-[13px] sm:text-lg text-[#494c6b] dark:text-[#c8cbe7] wrap-break-word"
            >
              ${inputValue}
            </span>
            <button
              type="button"
              class="todo-delete shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer sm:size-7"
              aria-label="Delete todo"
            >
              <img
                width="18"
                height="18"
              src=${crossIcon} 
              >
            </button>
          </li>`;

  // removeEmptyState();
  renderTask(TaskItem, "adding");
  applyTaskFilter(getCurrentTaskFilter());
  updateFilterButtons();
  inputElement.value = "";
};
export const renderTask: RenderTask = (taskItem, operationType) => {
  if (operationType === "adding") {
    todoList?.insertAdjacentHTML("afterbegin", taskItem as string);
    updateItemsLeft();
  } else if (operationType === "remove") {
    todoList?.removeChild(taskItem as HTMLElement);
    todoList?.children.length === 0 && renderEmptyState();
    updateItemsLeft();
  }
};

export const saveToDB = <K extends keyof DBData>(
  key: K,
  data: DBData[K],
): void => {
  if (key === "tasks") {
    const tasks = getFromDB("tasks") || [];
    tasks.push(data as Task);

    localStorage.setItem(key, JSON.stringify(tasks));
  } else if (key === "toggleTheme") {
    localStorage.setItem(key, JSON.stringify(data));
  } else if (key === "checkedTask-id") {
    const existingData = getFromDB(key);
    const taskIds = Array.isArray(existingData) ? existingData : [];

    if (!(taskIds as string[]).includes(data as string)) {
      (taskIds as string[]).push(data as string);
    }

    localStorage.setItem(key, JSON.stringify(taskIds));
  } else {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const getFromDB: GetFromDB = (key) => {
  const returnedData = localStorage.getItem(key);

  if (!returnedData) {
    return null;
  }

  return JSON.parse(returnedData);
};

export const renderEmptyState: RenderEmptyState = () => {
  const tasks = getFromDB("tasks");

  if (tasks?.length === 0 || todoList?.children.length === 0) {
    (todoList as Element).innerHTML =
      `<li class="EmptyList flex flex-col justify-center items-center">
      <p class=" pt-1 sm:pt-3 text-xl text-[#9495a5] font-light">Your list is empty.</p>
      <img
        class="w-[70%]"
        src=${emptyIcon}
        alt="list is empty"
      />
    </li>`;
  }
};

export const removeFromDB: RemoveFromDB = (taskElement) => {
  const taskElementId = taskElement.id;
  const taskElementText = taskElement.querySelector("span")?.innerText.trim();
  const dataFromDB = getFromDB("tasks");

  if (!dataFromDB) return;

  dataFromDB.forEach((element, index) => {
    if (
      element.id === parseFloat(taskElementId) &&
      element.task.trim() === taskElementText
    ) {
      dataFromDB.splice(index, 1);

      localStorage.setItem("tasks", JSON.stringify(dataFromDB));
    }
  });
};

export const removeIdFromDB: RemoveIdFromDB = (taskId) => {
  if (!taskId) return;

  const checkedTaskIdFromDB = getFromDB("checkedTask-id");

  if (!checkedTaskIdFromDB) return;

  const isId = checkedTaskIdFromDB.includes(taskId);

  if (isId) {
    const idIndex = checkedTaskIdFromDB.indexOf(taskId);
    const splicedTaskIdArr = [
      ...checkedTaskIdFromDB.slice(0, idIndex),
      ...checkedTaskIdFromDB.slice(idIndex + 1),
    ];

    localStorage.setItem("checkedTask-id", JSON.stringify(splicedTaskIdArr));
  }
};

export const removeTask: RemoveTask = (event) => {
  const answer = confirm("Are you sure you want to delete this task?");

  if (answer === false) return;

  const targetItem = (event.target as HTMLElement).closest("li") as HTMLElement;

  const removedIdTask = targetItem?.id as string;

  removeFromDB(targetItem);
  removeIdFromDB(removedIdTask);
  renderTask(targetItem, "remove");
  renderEmptyState();
  updateFilterButtons();
};

export const removeEmptyState = () => {
  getEmptyStateElement() && ((todoList as Element).innerHTML = "");
};

export const afterTaskAdded: AfterTaskAdded = (event) => {
  const htmlElement = event.target as HTMLElement;

  if (
    htmlElement.classList.contains("todo-delete") ||
    htmlElement.closest("button")?.classList.contains("todo-delete")
  ) {
    removeTask(event);
    todoList?.children.length === 0 && renderEmptyState();
  } else if (htmlElement.classList.contains("todo-checkbox")) {
    toggleTask(event);
  }
};

export const handleFilter = (event: Event) => {
  if (!(event.target instanceof Element)) return;

  const filterButton = event.target.closest<HTMLButtonElement>(
    ".filter-btn[data-filter]",
  );
  const filter = filterButton?.dataset.filter;

  if (filter === "all" || filter === "active" || filter === "completed") {
    applyTaskFilter(filter);
  }
};

export const removeCompletedTask = () => {
  const checkedTaskIds = getFromDB("checkedTask-id") ?? [];
  const checkedTaskIdSet = new Set(checkedTaskIds);
  const tasks = getFromDB("tasks") ?? [];
  const activeTasks = tasks.filter(
    (task) => !checkedTaskIdSet.has(String(task.id)),
  );

  localStorage.setItem("tasks", JSON.stringify(activeTasks));
  localStorage.setItem("checkedTask-id", JSON.stringify([]));

  todoList
    ?.querySelectorAll('li[data-completed="true"]')
    .forEach((element) => element.remove());
  applyTaskFilter("all");

  updateFilterButtons();
  renderEmptyState();
  updateItemsLeft();
};

export const updateItemsLeft = () => {
  const activeCount =
    todoList?.querySelectorAll("li[data-completed='false']").length ?? 0;
  const itemLabel = activeCount === 1 ? "item" : "items";

  if (itemsLeft) {
    itemsLeft.textContent = `${activeCount} ${itemLabel} left`;
  }
};
