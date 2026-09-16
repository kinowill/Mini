import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("petApi", {
  getManifest: () => ipcRenderer.invoke("pet:getManifest"),
  setPosition: (x: number, y: number) => ipcRenderer.invoke("pet:setPosition", x, y),
});
