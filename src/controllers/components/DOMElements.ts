import { Folder } from "../../models/Folder.js";
import { HTMLFolder } from "../../models/HtmlFolder.js";

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


    public GetAllHtmlFolder(): HTMLFolder[] {
        const allFoldersWithItems = this.foldersDiv.children as HTMLCollectionOf<HTMLDivElement>;

        const htmlFolders = Array.from(allFoldersWithItems).map((folderDiv) => {
            return HTMLFolder.fromContainer(folderDiv);
        });

        return htmlFolders;
    }

    public getElementById<T extends HTMLElement>(id: string): T {
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