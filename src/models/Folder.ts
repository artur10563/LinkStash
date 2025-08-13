export type FolderGuid = string;

export class Folder {
    public static readonly CssClass: string = "folder";

    public readonly Id: FolderGuid;
    public Name: string;
    public FolderItems: FolderItem[];

    constructor(folderName: string) {
        this.Id = uuidv4();
        this.Name = folderName;
        this.FolderItems = [];
    }

    public addFolderItem(folderItem: FolderItem): void {
        this.FolderItems.push(folderItem);
    }

    
    public removeFolderItemByLink(link: string): boolean {
        const item = this.FolderItems.find(item => item.Link === link);
        if (item) {
            this.FolderItems = this.FolderItems.filter(item => item.Link !== link);
            return true;
        }
        return false;
    }

    public findFolderItemByLink(link: string): FolderItem | undefined {
        return this.FolderItems.find(item => item.Link === link);
    }
}

export class FolderItem {
    public static readonly CssClass: string = "folderItem";

    public Description: string;
    public Link: string;
    public ParentId: FolderGuid;

    constructor(description: string, link: string, parentId: FolderGuid) {
        this.Description = description;
        this.Link = link;
        this.ParentId = parentId;
    }
}

function uuidv4(): FolderGuid {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
