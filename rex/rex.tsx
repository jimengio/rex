import * as React from "react";
import produce from "immer";
import * as shallowequal from "shallowequal";

let logKey = "REX_DEV_LOG";

if (typeof window !== "undefined") {
  window[logKey] = false;
}

let devLog = (...args: any[]) => {
  if (window && window[logKey]) {
    console.log(...args);
  }
};

let devTrace = (...args: any[]) => {
  if (window && window[logKey]) {
    console.trace(...args);
  }
};

function devPoint(...args: any[]) {
  // console.log(...args)
}

// Rex Store Implementation

export interface IRexStore<T> {
  getState: () => T;
  subscribe: (f: (store: T) => void) => { unsubscribe: () => void };
  update: (f: (store: T) => void) => void;
  updateAt: <K extends keyof T>(k: K, f: (x: T[K]) => void) => void;
}

export function createStore<T>(initalState: T) {
  let rexContainer = {
    currentState: initalState,
    listeners: [],
  };

  let emitChange = () => {
    devLog("Emit data", rexContainer.currentState);
    rexContainer.listeners.forEach((cb) => {
      cb(rexContainer.currentState);
    });
  };

  return {
    getState: () => rexContainer.currentState,
    subscribe: (f) => {
      // bypass warning of "setState on unmounted component" with unshift
      rexContainer.listeners.unshift(f);

      return {
        unsubscribe: () => {
          rexContainer.listeners = rexContainer.listeners.filter((x) => x != f);
        },
      };
    },
    update: (f) => {
      devTrace("Update with f", f);
      rexContainer.currentState = produce(rexContainer.currentState as any, f);
      emitChange();
    },
    updateAt: function<K extends keyof T>(k: K, f: (x: T[K]) => void) {
      devTrace("update partial with f", f);
      rexContainer.currentState = produce(rexContainer.currentState as any, (store) => {
        f(store[k]);
      });
      emitChange();
    },
  } as IRexStore<T>;
}

// Context

let RexContext = React.createContext(null);

// Context Provider

interface IRexProviderProps {
  value: IRexStore<any>;
}

export let RexProvider: React.SFC<IRexProviderProps> = (props) => {
  let [storeValue, setStoreValue] = React.useState(props.value.getState);

  React.useEffect(() => {
    let result = props.value.subscribe(() => {
      setStoreValue(props.value.getState());
    });
    return () => {
      result.unsubscribe();
    };
  }, []);

  return <RexContext.Provider value={storeValue}>{props.children}</RexContext.Provider>;
};

// Context Consumer and Child rendering

interface IRexDataLayerProps {
  parentProps: any;
  computedProps: any;
  Child: any;
}

class RexDataLayer extends React.Component<IRexDataLayerProps, any> {
  render() {
    let Child = this.props.Child;
    return <Child {...this.props.computedProps} {...this.props.parentProps} />;
  }

  // only usage of this component is to prevent unnecessary changes
  shouldComponentUpdate(nextProps: IRexDataLayerProps, nextState: any) {
    if (!shallowequal(nextProps.parentProps, this.props.parentProps)) return true;
    if (!shallowequal(nextProps.computedProps, this.props.computedProps)) return true;
    return false;
  }
}

export function connectRex<T>(selector: (s: T, ownProps?: any) => any): any {
  return (Target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let RexContainer: React.SFC<any> = (props) => {
      let storeValue: T = React.useContext(RexContext);
      return <RexDataLayer parentProps={props} Child={Target} computedProps={selector(storeValue, props)} />;
    };
    return RexContainer;
  };
}

// Hooks APIs

export function useRexContext<T>(selector: (s: T) => any): any {
  // [Caution on performance] components use useContext will be called on every change
  let contextValue: T = React.useContext(RexContext);

  return selector(contextValue);
}
