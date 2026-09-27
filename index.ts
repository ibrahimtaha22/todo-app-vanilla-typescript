import { initAppListeners } from "./src/scripts/eventListeners";
import {
  applyTaskFilter,
  updateFilterButtons,
} from "./src/scripts/elements";
import { initDataOnStartUp } from "./src/scripts/initDataOnStartUp";
import { updateItemsLeft } from "./src/scripts/utils";

initDataOnStartUp("tasks");
initDataOnStartUp("toggleTheme");
applyTaskFilter("all");
updateFilterButtons();
updateItemsLeft();
initAppListeners();
