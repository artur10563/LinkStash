import { DOMElements } from "./controllers/components/DOMElements.js";
import { EventHandler } from "./controllers/components/EventHandler.js";
import { FolderRendered } from "./controllers/components/FolderRenderer.js";
import { PopupController } from "./controllers/popup-controller.js";
import { FolderService } from "./services/folder-service.js";

document.addEventListener("DOMContentLoaded", async () => {
    const folderService = new FolderService();
    const domElements = new DOMElements();
    const rendered = new FolderRendered(domElements);
    const eventHandler = new EventHandler(folderService, domElements, rendered);

    const popupController = new PopupController(folderService, domElements, rendered, eventHandler);
    await popupController.init();
});