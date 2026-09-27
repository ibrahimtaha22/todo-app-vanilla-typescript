import { initAppListeners } from "./src/scripts/eventListeners";
import { updateFilterButtons } from "./src/scripts/elements";
import { initDataOnStartUp } from "./src/scripts/initDataOnStartUp";

initDataOnStartUp("tasks");
initDataOnStartUp("toggleTheme");
updateFilterButtons();
initAppListeners();
