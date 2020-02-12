import React, { SFC } from "react";
import { css, cx } from "emotion";
import randomcolor from "randomcolor";

import { connectRex, useRexContext } from "../../src/rex";
import { IGlobalStore } from "models/global";
import { doIncData } from "controllers/data";
import { randomBg } from "util/color";

interface IProps {
  passed: string;
}

let HooksChild: SFC<IProps> = (props) => {
  let contextData = useRexContext((store: IGlobalStore) => {
    return {
      data: store.data,
      homeData: store.homeData,
    };
  });

  return (
    <div className={styleContainer} style={randomBg()}>
      <div>this is page inside</div>
      <div>passed value: {props.passed}</div>

      <a onClick={doIncData}>Add data</a>
      <pre>{JSON.stringify(contextData, null, 2)}</pre>
    </div>
  );
};

const styleContainer = css`
  border: 1px solid #ddd;
  margin: 20px;
  padding: 20px;
`;

export default HooksChild;
