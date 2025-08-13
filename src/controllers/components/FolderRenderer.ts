import { Folder, FolderItem } from "../../models/Folder.js";
import { DOMElements } from "./DOMElements.js";

export class FolderRendered {
    constructor(protected DOMELements: DOMElements) {
    }


    renderFolder(folder: Folder) {
        const folderContainerDiv = document.createElement("div");
        folderContainerDiv.setAttribute("data-id", folder.Id);
        folderContainerDiv.innerHTML = `
            <button type="button" class="${Folder.CssClass}">${folder.Name}
                <button class="icon btn-folder-delete">
                     <i class="icon fa fa-trash fa-lg"
                    style="color: #cc2519;"></i>
                </button>
            </button>
            
            <div class="folder-content">
              <div class="inputGroup">
                <input type="text" class="itemDescriptionInput" placeholder="Description">
                <input type="text" class="itemLinkInput" placeholder="Link">
                <button class="newItemBtn">Save</button>
              </div>
              <ul>
              </ul>
            </div>
        `;

        this.DOMELements.foldersDiv.appendChild(folderContainerDiv);

        const ul = folderContainerDiv.querySelector("ul");
        folder.FolderItems.forEach((item) => this.appendFolderItemToUL(item, ul!));
    }

    appendFolderItemToUL(folderItem: FolderItem, ul: HTMLUListElement): void {
        const li = document.createElement("li");
        li.classList.add(FolderItem.CssClass);
        li.innerHTML = `
            <a class="folderLink" href="${folderItem.Link}" target="_blank">
                <div class="folderItemContent">
                    <div class="description">${folderItem.Description}</div>
                    <div class="link">Link: ${folderItem.Link}</div>
                </div>
            </a>
            <button class="icon btn-delete">
                <i class="icon btn-delete fa fa-trash fa-lg" style="color: #cc2519;"></i>
            </button>
        `;
        ul.appendChild(li);
    }

}