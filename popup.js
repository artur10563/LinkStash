import { Folder, FolderItem } from "./Folder.js";

document.addEventListener("DOMContentLoaded", function () {
  const folderInput = document.getElementById("folderInput");
  const addButton = document.getElementById("newFolderBtn");
  const foldersDiv = document.getElementById("folders");

  loadFoldersFromStorage();

  // Event listeners. REPLACE WITH SWITCH???
  addButton.addEventListener("click", handleAddFolderButtonClick);
  foldersDiv.addEventListener("click", handleCollapse);
  foldersDiv.addEventListener("click", handleNewItemButtonClick);
  foldersDiv.addEventListener("click", handleDeleteFolderItem);
  foldersDiv.addEventListener("click", handleDeleteFolder);

  // Functions
  function handleAddFolderButtonClick() {
    const folderName = folderInput.value.trim();
    if (isValidFolderName(folderName)) {
      const folder = new Folder(folderName);
      createFolderHTML(folder);
      addFolderToStorage(folder);
      folderInput.value = "";
    } else {
      alert("Folder name length must be 3-50 characters");
    }
  }

  function handleCollapse(event) {
    if (event.target.classList.contains("folder")) {
      toggleFolder(event.target);
    }
  }

  function handleNewItemButtonClick(event) {
    if (event.target.classList.contains("newItemBtn")) {
      createNewFolderItem(event.target);
    }
  }

  function toggleFolder(button) {
    button.classList.toggle("active");
    const content = button.nextElementSibling;
    content.style.display =
      content.style.display === "block" ? "none" : "block";
  }

  function createNewFolderItem(button) {
    const parentFolder = button.closest("[data-id]");
    const folderId = parentFolder.getAttribute("data-id");
    const inputGroup = button.closest(".inputGroup");
    const descriptionInput = inputGroup.querySelector(".itemDescriptionInput");
    const linkInput = inputGroup.querySelector(".itemLinkInput");
    const ul = parentFolder.querySelector("ul");

    const link = linkInput.value.trim();
    const description = descriptionInput.value.trim();

    if (isValidInput(description, link)) {
      const newFolderItem = new FolderItem(description, link, folderId);

      chrome.storage.local.get(["folders"], function (result) {
        const folders = result.folders || [];
        const folderToUpdate = folders.find((folder) => folder.Id === folderId);

        if (folderToUpdate) {
          folderToUpdate.FolderItems.push(newFolderItem);
          chrome.storage.local.set({ folders }, function () {
            appendFolderItemToUI(newFolderItem, ul);
            linkInput.value = "";
            descriptionInput.value = "";
          });
        } else {
          console.error("Folder not found with ID:", folderId);
        }
      });
    } else {
      console.error("Description and link are required");
    }
  }

  function appendFolderItemToUI(folderItem, ul) {
    const li = document.createElement("li");
    li.classList.add("folderItem");
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

  function createFolderHTML(folder) {
    const folderContainerDiv = document.createElement("div");
    folderContainerDiv.setAttribute("data-id", folder.Id);
    folderContainerDiv.innerHTML = `
        <button type="button" class="folder">${folder.Name}
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

    foldersDiv.appendChild(folderContainerDiv);

    const ul = folderContainerDiv.querySelector("ul");
    folder.FolderItems.forEach((item) => appendFolderItemToUI(item, ul));
  }

  function addFolderToStorage(folder) {
    chrome.storage.local.get(["folders"], function (result) {
      const folders = result.folders || [];
      folders.push(folder);
      chrome.storage.local.set({ folders }, function () {});
    });
  }

  function loadFoldersFromStorage() {
    chrome.storage.local.get(["folders"], function (result) {
      const folders = result.folders || [];
      folders.forEach(createFolderHTML);
    });
  }

  // Helper functions
  function isValidFolderName(name) {
    return name.length >= 3 && name.length <= 50;
  }

  function isValidInput(description, link) {
    return description.length > 0 && link.length > 0;
  }
});

function handleDeleteFolder(event) {
  if (
    event.target.classList.contains("btn-folder-delete") ||
    event.target.parentElement.classList.contains("btn-folder-delete")
  ) {
    const folderDiv = event.target.closest("[data-id]");
    const folderId = folderDiv.dataset.id;

    removeFolderFromStorage(folderId, (isDeleted) => {
      if (isDeleted) {
        folderDiv.remove();
      } else console.log("Can`t delete this folder");
    });
  }
}

function handleDeleteFolderItem(event) {
  if (event.target.classList.contains("btn-delete")) {
    const li = event.target.closest("li");
    const folderDiv = event.target.closest("[data-id]");
    const folderId = folderDiv.dataset.id;

    var linkElement = li.querySelector(".folderLink");
    const link = linkElement.getAttribute("href");

    if (folderId && link) {
      removeFolderItemFromStorage(folderId, link, (isDeleted) => {
        if (isDeleted) {
          li.remove();
        } else console.log("Can't delete this item");
      });
    }
  }
}

//Link is not unique identifier, too lazy to fix tho :)
function removeFolderItemFromStorage(folderId, link, callback) {
  chrome.storage.local.get(["folders"], function (result) {
    const folders = result.folders || [];

    const folder = folders.find((folder) => folder.Id == folderId);

    const item = folder.FolderItems.find((item) => item.Link == link);
    if (item) {
      const index = folder.FolderItems.indexOf(item);

      if (index > -1) {
        folder.FolderItems.splice(index, 1);

        chrome.storage.local.set({ folders }, function () {
          callback(true);
        });
        return;
      }
    }
    callback(false);
  });
}

function removeFolderFromStorage(folderId, callback) {
  chrome.storage.local.get(["folders"], function (result) {
    const folders = result.folders || [];
    const folder = folders.find((folder) => folder.Id == folderId);

    if (folder) {
      const index = folders.indexOf(folder);
      if (index > -1) {
        folders.splice(index, 1);
        chrome.storage.local.set({ folders }, function () {
          callback(true);
        });
        return;
      }
    }
    callback(false);
  });
}
