import { Folder } from "../../models/Folder.js";

export class DOMElements {


    public readonly foldersDiv: HTMLDivElement;
    public readonly folderInput: HTMLInputElement;
    public readonly addFolderButton: HTMLButtonElement
    public readonly searchInput: HTMLInputElement;

    constructor() {
        this.foldersDiv = this.getElementById<HTMLDivElement>("folders");
        this.folderInput = this.getElementById<HTMLInputElement>("folderInput");
        this.addFolderButton = this.getElementById<HTMLButtonElement>("newFolderBtn");
        this.searchInput = this.getElementById<HTMLInputElement>("searchInput");
    }



    getElementById<T extends HTMLElement>(id: string): T {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with id "${id}" not found`);
        }
        return element as T;
    }

    get $allFolders(): NodeListOf<HTMLButtonElement> {
        return this.foldersDiv.querySelectorAll(`.${Folder.CssClass}`);
    }
}