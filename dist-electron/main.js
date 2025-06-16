import { app as o, BrowserWindow as a, ipcMain as l } from "electron";
import { dirname as c, join as i } from "path";
import { fileURLToPath as m } from "url";
import p from "electron-store";
const w = m(import.meta.url), r = c(w), d = new p(), s = async () => {
  const e = new a({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: i(r, "preload.js")
    }
  });
  if (process.env.VITE_DEV_SERVER_URL || process.env.NODE_ENV === "development") {
    const n = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
    await e.loadURL(n), e.webContents.openDevTools();
  } else
    await e.loadFile(i(r, "../dist/index.html"));
};
o.whenReady().then(() => {
  s(), o.on("activate", () => {
    a.getAllWindows().length === 0 && s();
  });
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
l.handle("store-get", (e, t) => d.get(t));
l.handle("store-set", (e, t, n) => {
  d.set(t, n);
});
