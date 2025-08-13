import { Folder, FolderItem } from "../models/Folder.js";
import { FolderService } from "../services/folder-service.js";
import { DOMElements } from "./components/DOMElements.js";
import { EventHandler } from "./components/EventHandler.js";
import { FolderRendered } from "./components/FolderRenderer.js";

export class PopupController {



    constructor(
        protected folderService: FolderService,
        protected domElements: DOMElements,
        protected rendered: FolderRendered,
        protected eventHandler: EventHandler) {
        this.eventHandler.registerEventListeners();
    }


    public async init(): Promise<void> {
        try {
            const folders: Folder[] = await this.folderService.loadFoldersFromStorage();
            folders.forEach(folder => this.rendered.renderFolder(folder));

        } catch (error) {
            console.error("Failed to load folders:", error);
        }
    }



}