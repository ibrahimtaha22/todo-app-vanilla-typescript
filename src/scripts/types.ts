export type Task = {
  id: number;
  task: string;
};

export type ToggleTheme = {
  isDark: boolean;
};

export type DBData = {
  tasks: Task;
  toggleTheme: ToggleTheme;
  "checkedTask-id": string;
  isHideCompleted: boolean;
  isShowButton: boolean;
};

export type DBStorage = {
  tasks: Task[];
  toggleTheme: ToggleTheme;
  "checkedTask-id": string[];
  isHideCompleted: boolean;
  isShowButton: boolean;
};

export type GetFromDB = <K extends keyof DBStorage>(
  key: K,
) => DBStorage[K] | null;

export type AddingTask = (event: Event) => void;

export type HasCompletedTask = () => boolean;

export type AfterTaskAdded = (event: MouseEvent) => void;

export type RemoveFromDB = (parentItem: HTMLElement) => void;

export type RemoveIdFromDB = (taskId: string) => void;

export type RemoveTask = (event: Event) => void;

export type RenderTask = (
  taskItem: HTMLElement | string,
  operationType: "adding" | "remove",
) => void;

export type RenderEmptyState = () => void;
