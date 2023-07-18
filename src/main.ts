import { App } from "./client/App.ts";

const app = App.instance;

document.body.appendChild(app.view as HTMLCanvasElement);
