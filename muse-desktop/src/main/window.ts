import { BrowserWindow } from "electron";
import { APP_URL } from "../shared/constants";

export function createMainWindow() {
  const win = new BrowserWindow({ width: 1280, height: 800, backgroundColor: "#101114", webPreferences: { preload: "" } });
  void win.loadURL(APP_URL);
  return win;
}
