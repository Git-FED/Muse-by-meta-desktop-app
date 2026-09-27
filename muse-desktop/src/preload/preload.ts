// Keep this bridge minimal and audited. Do not expose Node APIs to the renderer.
import { contextBridge } from "electron";
contextBridge.exposeInMainWorld("muse", { version: "0.1.0" });
