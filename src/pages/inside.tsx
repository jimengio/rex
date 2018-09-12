import React from "react";
import { css, cx } from "emotion";
import produce from "immer";
import randomcolor from "randomcolor";

import { connectRex } from "rex";
import { IGlobalStore } from "models/global";
import { doIncData } from "controllers/data";
import { randomBg } from "util/color";

interface IProps {
  passed: string;
  data?: number;
}

interface IState {}

@connectRex((store: IGlobalStore, ownProps: IProps) => {
  console.log("ownProps", ownProps);
  return { data: store.data };
})
export default class Inside extends React.PureComponent<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  immerState(f: (s: IState) => void) {
    this.setState(produce<IState>(f));
  }

  render() {
    console.log("rendering inside");

    return (
      <div className={styleContainer} style={randomBg()}>
        <div>this is page inside</div>

        <a onClick={doIncData}>Add data</a>
        <pre>{JSON.stringify(this.props, null, 2)}</pre>
      </div>
    );
  }
}

const styleContainer = css`
  border: 1px solid #ddd;
  margin: 20px;
  padding: 20px;
`;
