const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld("api", {
  openFileDialog: () => ipcRenderer.invoke("dialog:openFile"),
  fetchLayerImages: (dir) => ipcRenderer.invoke("images:fetch", dir),
  convertImageToBase64: (path) => ipcRenderer.invoke("images:convert", path),
});

contextBridge.exposeInMainWorld("legacy", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["fromMain"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});

/**
 * Debounce a function
 * @param {*} func
 * @param {*} wait
 * @returns
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this; // Preserve 'this' context
    clearTimeout(timeout); // Clear any existing timeout
    timeout = setTimeout(() => {
      timeout = null; // Reset timeout for future calls
      func.apply(context, args); // Execute the function with its arguments
    }, wait);
  };
}
