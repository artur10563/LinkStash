export class Folder {
  constructor(folderName) {
    this.Id = uuidv4();
    this.Name = folderName;
    this.FolderItems = [];
  }
}

export class FolderItem {
  constructor(description, link, parentId) {
    this.Description = description;
    this.Link = link;
    this.ParentId = parentId;
  }
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
