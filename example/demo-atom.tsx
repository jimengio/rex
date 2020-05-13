import React, { FC } from "react";
import { css } from "emotion";
import { useAtom } from "../src/use-atom";

let DemoAtom: FC<{ className?: string }> = React.memo((props) => {
  let dataAtom = useAtom({ a: 1 });

  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={props.className}>
      <pre>{JSON.stringify(dataAtom.deref(), null, 2)}</pre>
      <div>
        <button
          onClick={() => {
            dataAtom.resetWith({ a: 0 });
          }}
        >
          Reset
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            dataAtom.swapWith((data) => {
              data.a += 1;
            });
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
});

export default DemoAtom;
