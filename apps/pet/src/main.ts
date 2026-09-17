import { app, BrowserWindow, ipcMain, screen } from "electron";
import * as fs from "fs";
import * as path from "path";
import { enumerateVisibleWindows } from "./windows";

const SCALE = 4;
const FRAME_SIZE = 16;
const WINDOW_SIZE = FRAME_SIZE * SCALE;
const WINDOWS_POLL_MS = 1500;

interface Manifest {
  animations: Record<string, string[]>;
  scale: number;
  windowSize: number;
  workArea: { x: number; y: number; width: number; height: number };
}

function resolveAssetsDir(): string {
  const fromEnv = process.env.PET_ASSETS;
  if (fromEnv && fs.existsSync(fromEnv)) {
    return fromEnv;
  }
  return path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "runtime",
    "pet-assets",
    "Black-Cat-Shimeji",
    "assets"
  );
}

function buildManifest(assetsDir: string): Record<string, string[]> {
  const animations: Record<string, string[]> = {};
  if (!fs.existsSync(assetsDir)) {
    return animations;
  }
  for (const entry of fs.readdirSync(assetsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const dir = path.join(assetsDir, entry.name);
    const frames = fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith(".png"))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (frames.length > 0) {
      animations[entry.name] = frames.map((f) => path.join(dir, f));
    }
  }
  return animations;
}

let win: BrowserWindow | null = null;
let watcher: NodeJS.Timeout | null = null;

function createWindow(): void {
  const workArea = screen.getPrimaryDisplay().workArea;
  win = new BrowserWindow({
    width: WINDOW_SIZE,
    height: WINDOW_SIZE,
    transparent: true,
    frame: false,
    resizable: false,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.setAlwaysOnTop(true, "screen-saver");
  win.setIgnoreMouseEvents(true, { forward: true });
  win.setPosition(
    workArea.x + workArea.width - WINDOW_SIZE - 40,
    workArea.y + workArea.height - WINDOW_SIZE
  );
  void win.loadFile(path.join(__dirname, "..", "index.html"));
  win.on("closed", () => {
    win = null;
  });
}

ipcMain.handle("pet:getManifest", (): Manifest => {
  const assetsDir = resolveAssetsDir();
  const workArea = screen.getPrimaryDisplay().workArea;
  return {
    animations: buildManifest(assetsDir),
    scale: SCALE,
    windowSize: WINDOW_SIZE,
    workArea: { x: workArea.x, y: workArea.y, width: workArea.width, height: workArea.height },
  };
});

ipcMain.handle("pet:setPosition", (_event, x: number, y: number) => {
  if (win) {
    win.setPosition(Math.round(x), Math.round(y));
  }
});

ipcMain.handle("pet:setInteractive", (_event, on: boolean) => {
  if (win) {
    win.setIgnoreMouseEvents(!on, { forward: true });
  }
});

function startWindowWatcher(): void {
  if (watcher) return;
  const selfPid = process.pid;
  watcher = setInterval(() => {
    void (async () => {
      if (!win || win.isDestroyed()) return;
      try {
        const scale = screen.getPrimaryDisplay().scaleFactor;
        const rects = await enumerateVisibleWindows(selfPid);
        const scaled = rects.map((r) => ({
          x: r.x / scale,
          y: r.y / scale,
          width: r.width / scale,
          height: r.height / scale,
        }));
        win?.webContents.send("windows:update", scaled);
      } catch (err) {
        console.error("[main] watcher error", err);
      }
    })();
  }, WINDOWS_POLL_MS);
}

app.whenReady().then(() => {
  createWindow();
  startWindowWatcher();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (watcher) {
    clearInterval(watcher);
    watcher = null;
  }
  app.quit();
});
