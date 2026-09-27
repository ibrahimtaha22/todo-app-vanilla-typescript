import { todoList } from "./elements";
import type { Task } from "./types";

let draggedTaskId: string | null = null;

const getTaskItem = (target: EventTarget | null): HTMLLIElement | null => {
  if (!(target instanceof HTMLElement)) return null;

  const taskItem = target.closest("li[id]");
  return taskItem instanceof HTMLLIElement && taskItem.parentElement === todoList
    ? taskItem
    : null;
};

const saveTaskOrder = () => {
  const storedTasks = JSON.parse(
    localStorage.getItem("tasks") ?? "[]",
  ) as Task[];
  const tasksById = new Map(
    storedTasks.map((task) => [String(task.id), task] as const),
  );
  const orderedTasks = Array.from(todoList?.children ?? [])
    .filter(
      (child): child is HTMLLIElement =>
        child instanceof HTMLLIElement && Boolean(child.id),
    )
    .map((taskItem) => tasksById.get(taskItem.id))
    .filter((task): task is Task => task !== undefined);

  if (orderedTasks.length === storedTasks.length) {
    // Startup renders each stored task at the top, so storage order is reversed.
    localStorage.setItem("tasks", JSON.stringify([...orderedTasks].reverse()));
  }
};

export const handleTaskDragStart = (event: DragEvent) => {
  const taskItem = getTaskItem(event.target);
  if (!taskItem || !event.dataTransfer) return;

  draggedTaskId = taskItem.id;
  taskItem.classList.add("opacity-50");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", taskItem.id);
};

export const handleTaskDragOver = (event: DragEvent) => {
  if (!draggedTaskId) return;

  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
};

export const handleTaskDrop = (event: DragEvent) => {
  event.preventDefault();

  const taskId = draggedTaskId ?? event.dataTransfer?.getData("text/plain");
  const draggedTask = Array.from(todoList?.children ?? []).find(
    (child): child is HTMLLIElement =>
      child instanceof HTMLLIElement && child.id === taskId,
  );
  if (!draggedTask) return;

  const targetTask = getTaskItem(event.target);
  if (targetTask && targetTask !== draggedTask) {
    const targetRect = targetTask.getBoundingClientRect();
    const dropAfterTarget = event.clientY > targetRect.top + targetRect.height / 2;

    if (dropAfterTarget) {
      targetTask.after(draggedTask);
    } else {
      targetTask.before(draggedTask);
    }
  } else if (!targetTask) {
    todoList?.append(draggedTask);
  }

  saveTaskOrder();
};

export const handleTaskDragEnd = (event: DragEvent) => {
  getTaskItem(event.target)?.classList.remove("opacity-50");
  draggedTaskId = null;
};
