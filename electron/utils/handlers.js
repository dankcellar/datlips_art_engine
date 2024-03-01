const fs = require("fs");
const path = require("path");
const { ipcMain, dialog } = require("electron/main");

const { buildSetup, startCreating } = require("../../utils/generate_metadata");

module.exports = () => {
  ipcMain.handle("dialog:openFile", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog();
    if (!canceled) {
      return filePaths[0];
    }
  });

  ipcMain.handle("images:fetch", (event, ...args) => {
    const [dir = "layers"] = args; // Destructure with default value
    console.log(`Requesting image paths from folder: ${dir}`);
    const imagePaths = readImagePaths(dir);
    return imagePaths;
  });

  ipcMain.handle("images:convert", (event, ...args) => {
    const [path = ""] = args; // Destructure with default value
    console.log(`Converting image path: ${path}`);
    const base64 = convertImageToBase64(path);
    return base64;
  });

  ipcMain.handle("engine:generate", async (event, ...args) => {
    const [data = ""] = args; // Destructure with default value
    try {
      buildSetup();
      await startCreating();
    } catch (error) {
      console.error(error);
    }
    return data;
  });
};

function readImagePaths(folderPath) {
  const imagePaths = [];
  if (!fs.existsSync(folderPath)) {
    console.error(`Folder not found: ${folderPath}`);
    return imagePaths; // Return empty array if folder doesn't exist
  }

  function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        traverseDirectory(filePath); // Recurse into subdirectory
      } else if (
        [".jpg", ".jpeg", ".png", ".gif", ".bmp"].includes(
          path.extname(filePath).toLowerCase()
        )
      ) {
        imagePaths.push(filePath);
      } else {
        console.log(`Ignoring non-image file: ${filePath}`);
      }
    }
  }

  traverseDirectory(folderPath); // Start recursion
  return imagePaths;
}

function convertImageToBase64(path) {
  const data = fs.readFileSync(path);
  return data.toString("base64");
}
