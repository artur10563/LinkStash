import { Folder } from "./Folder.js";

export class HTMLFolder {
    public readonly folderDiv: HTMLDivElement;
    public readonly folderButton: HTMLButtonElement;
    public readonly folderItems: HTMLLIElement[];

    constructor(folderDiv: HTMLDivElement, folderButton: HTMLButtonElement, folderItems: HTMLLIElement[]) {
        this.folderDiv = folderDiv;
        this.folderButton = folderButton;
        this.folderItems = folderItems;
    }

    public static fromContainer(folderDiv: HTMLDivElement) : HTMLFolder {
        const folderButton = folderDiv.querySelector(`.${Folder.CssClass}`) as HTMLButtonElement;
        const folderItems = Array.from(folderDiv.querySelectorAll("li")) as HTMLLIElement[];

        return new HTMLFolder(folderDiv, folderButton, folderItems);
    }

    public resetVisibility(): void {
        this.folderDiv.classList.remove("hidden");
        this.folderButton.classList.remove("hidden");
        this.folderItems.forEach(item => item.classList.remove("hidden"));
    }
}