import ReactDOM, { unstable_renderSubtreeIntoContainer } from "react-dom";
import React from "react";

import Container from "./pages/container";
import { globalStore } from "store";
import { RexProvider } from "rex";

const renderApp = () => {
  ReactDOM.render(
    <RexProvider value={globalStore}>
      <Container store={globalStore.getState()} />
    </RexProvider>,
    document.querySelector(".app")
  );
};

window.onload = () => {
  renderApp();
  globalStore.subscribe(renderApp);
};

declare var module: any;

if (module.hot) {
  module.hot.accept([], () => {
    renderApp();
  });
}
