import { contextBridge, ipcRenderer } from "electron";

interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

contextBridge.exposeInMainWorld("petApi", {
  getManifest: () => ipcRenderer.invoke("pet:getManifest"),
  setPosition: (x: number, y: number) => ipcRenderer.invoke("pet:setPosition", x, y),
  setInteractive: (on: boolean) => ipcRenderer.invoke("pet:setInteractive", on),
  onWindowsUpdate: (callback: (rects: WindowRect[]) => void) => {
    const listener = (_event: unknown, rects: WindowRect[]) => callback(rects);
    ipcRenderer.on("windows:update", listener);
    return () => {
      ipcRenderer.removeListener("windows:update", listener);
    };
  },
});
