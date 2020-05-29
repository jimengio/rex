import { useState, useRef } from "react";
import { produce } from "immer";

/** "Clojure Atom"-like data management for React Hooks */
export let useAtom = <T>(data: T) => {
  // state only for triggering changes, data actually hold in dataRef
  let [state, setState] = useState(data);
  let dataRef = useRef(data);

  return {
    deref: () => dataRef.current,
    /** alias for .deref(), a getter */
    get current() {
      return dataRef.current;
    },
    resetWith: (newData: T) => {
      dataRef.current = newData;
      setState(newData);
    },
    /** updates with Immer, returns a frozen result */
    swapWith: (f: (d: T) => T | void) => {
      let newData = produce(dataRef.current, f) as T;
      dataRef.current = newData;
      setState(newData);
    },
  };
};
