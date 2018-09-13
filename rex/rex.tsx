import * as React from "react";
import produce from "immer";
import * as shallowequal from "shallowequal";

function devPoint(...args) {
  // console.log(...args)
}
let RexContext = React.createContext(null);

interface IRexProviderProps {
  value: any;
}

export class RexProvider extends React.Component<IRexProviderProps, any> {
  render() {
    return <RexContext.Provider value={this.props.value}>{this.props.children}</RexContext.Provider>;
  }
}
interface IRexStore<T> {
  getState: () => T;
  subscribe: (f: (store: T) => void) => void;
  unsubscribe: (f: (store: T) => void) => void;
  update: (f: (store: T) => void) => void;
}

export function createStore<T>(initalState: T) {
  let store = {
    currentState: initalState,
    listeners: [],
  };

  return {
    getState: () => store.currentState,
    subscribe: (f) => {
      store = produce(store, (draft) => {
        draft.listeners.push(f);
      });
    },
    unsubscribe: (f) => {
      store = produce(store, (draft) => {
        draft.listeners = draft.listeners.filter((x) => x != f);
      });
    },
    update: (f) => {
      let newStore = produce(store.currentState as any, f);
      store = produce(store, (draft) => {
        draft.currentState = newStore;
      });
      store.listeners.forEach((cb) => {
        cb(store.currentState);
      });
    },
  } as IRexStore<T>;
}

interface IRexDataLayerProps {
  store: IRexStore<any>;
  parentProps: any;
  Child: any;
  selector: (s: any, ownProps: any) => any;
}
interface IRexDataLayerState {
  props: any;
}

class RexDataLayer extends React.Component<IRexDataLayerProps, IRexDataLayerState> {
  constructor(props) {
    super(props);

    this.state = {
      props: this.computeProps(),
    };
  }

  computeProps() {
    return produce(this.props.selector(this.props.store.getState(), this.props.parentProps), (x) => {});
  }

  immerState(f: (s: any) => void, cb?) {
    this.setState(produce<IRexDataLayerState>(f), cb);
  }

  render() {
    devPoint("render Rex wrapper");
    let Child = this.props.Child;
    return <Child {...this.state.props} {...this.props.parentProps} />;
  }

  shouldComponentUpdate(nextProps: IRexDataLayerProps, nextState: IRexDataLayerState) {
    if (!shallowequal(nextProps.parentProps, this.props.parentProps)) {
      return true;
    }
    if (!shallowequal(nextState.props, this.state.props)) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.props.store.subscribe(this.onStoreChange);
  }

  componentWillMount() {
    this.props.store.unsubscribe(this.onStoreChange);
  }

  onStoreChange = (newStore) => {
    this.immerState((state) => {
      state.props = this.computeProps();
    });
  };
}

export function connectRex<T>(selector: (s: T, ownProps?: any) => any): any {
  return (Target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    return class RexContainer extends React.Component {
      render() {
        devPoint("render interal");
        return (
          <RexContext.Consumer>
            {(value: any) => {
              let store = value as IRexStore<T>;
              devPoint("consumer called");

              return <RexDataLayer store={store} parentProps={this.props} Child={Target} selector={selector} />;
            }}
          </RexContext.Consumer>
        );
      }
    };
  };
}
