import * as React from "react";
import produce from "immer";
import shallowequal from "shallowequal";

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

interface IRexWrapperProps {
  store: IRexStore<any>;
  origin: any;
  Child: any;
  selector: (s: any) => any;
}
interface IRexWrapperState {
  props: any;
}

class RexWrapper extends React.Component<IRexWrapperProps, IRexWrapperState> {
  constructor(props) {
    super(props);

    this.state = {
      props: produce(this.props.selector(this.props.store.getState()), (x) => {}),
    };
  }

  immerState(f: (s: any) => void, cb?) {
    this.setState(produce<any>(f), cb);
  }

  render() {
    console.log("render Rex wrapper");
    let newProps = this.props.selector(this.props.store.getState());
    let Child = this.props.Child;
    return <Child {...this.state.props} {...this.props.origin} />;
  }

  shouldComponentUpdate(nextProps: IRexWrapperProps, nextState: IRexWrapperState) {
    if (!shallowequal(nextProps.origin, this.props.origin)) {
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
      state.props = this.props.selector(this.props.store.getState());
    });
  };
}

export function mapStateToProps<T>(selector: (s: T) => any): any {
  return (Target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    return class Interal extends Target {
      render() {
        console.log("render interal");
        return (
          <RexContext.Consumer>
            {(value: any) => {
              let store = value as IRexStore<T>;
              console.log("consumer called");

              return <RexWrapper store={store} origin={this.props} Child={Target} selector={selector} />;
            }}
          </RexContext.Consumer>
        );
      }
    };
  };
}
