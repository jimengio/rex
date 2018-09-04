import React from "react";
import { css } from "emotion";
import { doIncData } from "controllers/data";
import Inside from "./inside";

export default class Home extends React.Component {
  render() {
    return (
      <div>
        Home Page
        <a
          onClick={() => {
            window.location.hash = "#/content";
          }}
          className={styleButton}
        >
          Open content
        </a>
        <a onClick={doIncData}>larger</a>
        <Inside passed={"home data"} />
      </div>
    );
  }
}

const styleButton = css`
  margin: 8px;
  cursor: pointer;
  color: blue;
`;
