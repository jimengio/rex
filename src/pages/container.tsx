import React from "react";
import { css } from "emotion";

import Home from "./home";
import { IGlobalStore } from "models/global";

interface IProps {
  store: IGlobalStore;
}

export default (props: IProps) => {
  console.log("rendering container");

  return (
    <div className={styleContainer}>
      <div className={styleTitle}>Container</div>
      <pre>{JSON.stringify(props.store, null, 2)}</pre>
      <Home data={props.store.homeData} />
    </div>
  );
};

const styleContainer = css`
  font-family: "Helvetica";
`;

const styleTitle = css`
  margin-bottom: 16px;
`;
