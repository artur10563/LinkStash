import { Folder, FolderGuid, FolderItem } from "../models/Folder.js";

export class FolderService {
    private folders: Folder[] = [];

    public addFolder(folderName: string): Folder {
        const newFolder = new Folder(folderName);
        this.folders.push(newFolder);
        return newFolder;
    }

    public removeFolder(folderId: FolderGuid): boolean {
        const folderIndex = this.folders.findIndex(folder => folder.Id === folderId);
        if (folderIndex !== -1) {
            this.folders.splice(folderIndex, 1);
            return true;
        }
        return false;
    }

    removeFolderById(folderId: FolderGuid): boolean {
        const folder = this.findFolderById(folderId);
        if (folder) {
            this.folders = this.folders.filter(f => f.Id !== folderId);
            return true;
        }
        return false;
    }

    public getFolders(): Folder[] {
        return this.folders;
    }

    public findFolderById(folderId: FolderGuid): Folder | undefined {
        return this.folders.find(folder => folder.Id === folderId);
    }

    public addItemToFolder(folderId: FolderGuid, item: FolderItem): void {
        const folder = this.findFolderById(folderId);
        if (folder) {
            folder.FolderItems.push(item);
        }
    }

    public async addFolderToStorage(folder: Folder): Promise<void> {
        this.folders.push(folder);
        await chrome.storage.local.set({ folders: this.folders });
    }


    public async loadFoldersFromStorage(): Promise<Folder[]> {
        const result = await chrome.storage.local.get(["folders"]);
        const plainObjects = result.folders || [];

        this.folders = plainObjects.map((obj: any) => {
            const folder = Object.create(Folder.prototype);
            Object.assign(folder, obj);
            return folder as Folder;
        });

        return this.folders;
    }

    public async saveFoldersToStorage(): Promise<void> {
        await chrome.storage.local.set({ folders: this.folders });
    }

}