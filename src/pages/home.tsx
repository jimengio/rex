import React, { useEffect } from "react";
import { css } from "emotion";
import { doIncData, doIncBranch, doIncHome } from "controllers/data";
import Inside from "./inside";
import BranchData from "./branch-data";
import randomcolor from "randomcolor";
import { randomBg } from "util/color";
import HooksChild from "./hooks-child";

interface IProps {
  data: number;
}

export default class Home extends React.PureComponent<IProps, any> {
  render() {
    console.log("rendering home");

    return (
      <div>
        <div className={styleHome} style={randomBg()}>
          Home Page, data:
          {this.props.data}
          <div>ok</div>
          <a onClick={doIncHome}>Add home</a>
        </div>
        <Inside passed={"home data"} />
        <BranchData passed={"home data"} />
        <HooksChild passed={"data from home"} />
      </div>
    );
  }
}

const styleButton = css`
  margin: 8px;
  cursor: pointer;
  color: blue;
`;

const styleSpace = css`
  display: inline-block;
  width: 50px;
`;

const styleHome = css`
  padding: 8px;
`;
