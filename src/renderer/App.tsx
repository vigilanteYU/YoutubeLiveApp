import React from "react";
import ReactDOM from "react-dom";

import {} from "electron-redux";

import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import createAppReducer from "@common/AppState/Reducers/AppStateReducer";
import RendererProcessMiddleware from "@root/src/common/AppState/Middlewares/RendererProcessMiddleware";
import IndexContainer from "./Container/IndexContainer";

const locationHref = location.href;
const beforeLivePage = localStorage.getItem("beforeLivePage");

const firstView: string = beforeLivePage != null ? beforeLivePage : decodeURIComponent(locationHref.slice(locationHref.indexOf("n=") + 2));

const myCreateStore = compose(applyMiddleware(RendererProcessMiddleware()))(createStore);
const store = myCreateStore(createAppReducer({ url: firstView }));

const app = (
  <Provider store={store}>
    <IndexContainer />
  </Provider>
);

ReactDOM.render(app, document.getElementById("app"));