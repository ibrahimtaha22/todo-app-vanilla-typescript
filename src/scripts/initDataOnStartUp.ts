import { bodyElement } from "./elements.js";
import { getFromDB, renderEmptyState, renderTask } from "./utils.ts";
import checkmarkIcon from "../assets/icon-check.svg";
import crossIcon from "../assets/icon-cross.svg";
type DbaseElment = {
  id: number;
  task: string;
};

type LocalStorageKey = "tasks" | "toggleTheme";
export const initDataOnStartUp = (localStorageKey: LocalStorageKey) => {
  if (localStorageKey === "tasks") {
    const dataFromDB = getFromDB("tasks");
    const CheckedTaskIdFromDB = getFromDB("checkedTask-id") || [];

    if (dataFromDB && dataFromDB.length) {
      dataFromDB.forEach((element: DbaseElment) => {
        const isCompleted = CheckedTaskIdFromDB.includes(
          `${element.id.toString()}`,
        );

        const spanClasses = isCompleted
          ? "text-[#d1d2da] dark:text-[#4d5067] line-through"
          : "text-[#494c6b] dark:text-[#c8cbe7]";

        const buttonClasses = isCompleted
          ? "border-transparent bg-linear-to-br from-[#57ddff] to-[#c058f3]"
          : "hover:border-transparent hover:bg-linear-to-br hover:from-[#57ddff] hover:to-[#c058f3]";

        const imgHiddenClass = isCompleted ? "" : "hidden";

        const TaskItem = `<li
             id="${element.id}"
            draggable="true"
            class="group flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5"
            data-completed="${isCompleted}"
          >
            <button
              type="button"
              class="todo-checkbox shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#e3e4f1] dark:border-[#393a4b] transition-colors flex justify-center items-center cursor-pointer ${buttonClasses}"
            > 
              <img class="${imgHiddenClass} pointer-events-none" width="11" height="9" src="${checkmarkIcon}" /> 
            </button>
            <span
              class="flex-1 text-[13px] sm:text-lg wrap-break-word ${spanClasses}"
            >
              ${element.task}
            </span>
            <button
              type="button"
              class="todo-delete shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer sm:size-7"
              aria-label="Delete todo"
            >
              <img
                width="18"
                height="18"
              src="${crossIcon}" 
              >
            </button>
          </li>`;

        renderTask(TaskItem, "adding");
      });
    } else {
      renderEmptyState();
    }
  } else if (localStorageKey === "toggleTheme") {
    const returnedData = getFromDB("toggleTheme");
    if (returnedData?.isDark) {
      bodyElement?.classList.toggle("dark");
    }
  } else {
    return;
  }
};
