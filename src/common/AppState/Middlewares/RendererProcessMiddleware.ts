import { Middleware, Action } from "redux";
import { ipcRenderer } from "electron";
import AppState from "../States/AppState";
import IPCEvent from "../../events/IPCEvent";
export default function RendererProcessMiddleware(): Middleware {
  return (store) => (next) => (action: Action) => {
    if (!ipcRenderer.eventNames().some((name) => name === IPCEvent.StateChanged.CHANNEL_NAME_FROM_RENDERER)) {
      ipcRenderer.addListener("stateChanged", (_, action: Action) => {
        next(action);
      });
    }
    next(action);
    const state = store.getState();
    ipcRenderer.send("stateChanged", { type: action.type, state });
  };
}

async function getInitialState() {
  return new Promise<AppState>((res, error) => {
    ipcRenderer.on(IPCEvent.InitialState.CHANNEL_NAME_FROM_MAIN, (_, payload: AppState) => {
      res(payload);
    });

    ipcRenderer.send("INITIAL_STATE.REQUEST");
  });
}
