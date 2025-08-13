import { Folder, FolderItem } from "../../models/Folder.js";
import { FolderService } from "../../services/folder-service.js";
import { InputValidator } from "../../utils/InputValidator.js";
import { DOMElements } from "./DOMElements.js";
import { FolderRendered } from "./FolderRenderer.js";

export class EventHandler {

    inputValidator = new InputValidator();

    constructor(
        protected folderService: FolderService,
        protected domElements: DOMElements,
        protected rendered: FolderRendered) { }


    public registerEventListeners(): void {
        this.domElements.foldersDiv.addEventListener("click", (event) =>
            this.handleFoldersContainerClick(event)
        );

        this.domElements.addFolderButton.addEventListener("click", async () =>
            await this.handleAddFolderClick()
        );

        this.domElements.searchInput.addEventListener("input", () => this.filterItems(this.domElements.searchInput.value));
    }



    //#region Private Methods
    //TODO: currently hides only items. Make it hide empty folders as well
    private filterItems(filterText: string): void {

        let recalcTimer;
        clearTimeout(recalcTimer);

        recalcTimer = setTimeout(() => {
            const items = document.querySelectorAll(".folderItem");
            items.forEach((item) => {
                const description = (item.querySelector(".description") as HTMLElement).textContent.toLowerCase();
                const link = (item.querySelector(".link") as HTMLElement).textContent.toLowerCase();
                if (description.includes(filterText) || link.includes(filterText)) {
                    item.classList.remove("hidden");
                } else {
                    item.classList.add("hidden");
                }
            });
        }, 500);
    }


    private async handleFoldersContainerClick(event: MouseEvent): Promise<void> {
        const target = event.target as HTMLElement;

        if (target.classList.contains(Folder.CssClass)) {
            target.classList.toggle("active");
        }

        if (target.classList.contains("newItemBtn")) {
            await this.createNewFolderItem(target as HTMLButtonElement);
        }

        if (target.classList.contains("btn-delete")) {
            await this.deleteFolderItem(target as HTMLButtonElement);
        }

        if (
            target.classList.contains("btn-folder-delete") ||
            target.parentElement?.classList.contains("btn-folder-delete")
        ) {
            await this.deleteFolder(target as HTMLElement);
        }

    }

    private async deleteFolder(target: HTMLElement): Promise<void> {
        const folderDiv = target.closest("[data-id]") as HTMLDivElement;
        const folderId = folderDiv.dataset.id as string;

        if (this.folderService.removeFolderById(folderId)) {
            await this.folderService.saveFoldersToStorage();
            folderDiv.remove();
        }
    }

    private async deleteFolderItem(deleteButton: HTMLButtonElement): Promise<void> {
        const li = deleteButton.closest("li") as HTMLLIElement;
        const folderDiv = deleteButton.closest("[data-id]") as HTMLDivElement;
        const folderId = folderDiv.dataset.id as string;

        var linkElement = li.querySelector(".folderLink") as HTMLAnchorElement;
        const link = linkElement.getAttribute("href") as string;

        const folder = this.folderService.findFolderById(folderId);
        if (!folder) return;

        if (folder.removeFolderItemByLink(link)) {
            await this.folderService.saveFoldersToStorage();
            li.remove();
        }
    }


    private async createNewFolderItem(button: HTMLButtonElement): Promise<void> {
        const parentFolder = button.closest("[data-id]");
        const folderId = parentFolder!.getAttribute("data-id") as string;
        const inputGroup = button.closest(".inputGroup");
        const descriptionInput = inputGroup!.querySelector(".itemDescriptionInput") as HTMLInputElement;
        const linkInput = inputGroup!.querySelector(".itemLinkInput") as HTMLInputElement;
        const ul = parentFolder!.querySelector("ul");

        const link = linkInput.value.trim();
        const description = descriptionInput.value.trim();

        if (!this.inputValidator.isValidInput(description, link)) {
            alert("Description and link are required");
            return;
        }

        const newFolderItem = new FolderItem(description, link, folderId);

        let folderToUpdate = this.folderService.findFolderById(folderId);
        if (!folderToUpdate) {
            alert("Folder not found");
            return;
        }

        folderToUpdate.FolderItems.push(newFolderItem);
        await this.folderService.saveFoldersToStorage();
        this.rendered.appendFolderItemToUL(newFolderItem, ul!);
        linkInput.value = "";
        descriptionInput.value = "";

    }

    private async handleAddFolderClick(): Promise<void> {
        const folderName = this.domElements.folderInput.value.trim();

        if (this.inputValidator.isValidFolderName(folderName)) {
            const folder = new Folder(folderName);
            this.rendered.renderFolder(folder);
            await this.folderService.addFolderToStorage(folder);
            this.domElements.folderInput.value = "";
        } else {
            alert("Folder name length must be 3-50 characters");
        }
    }

    //#endregion
}