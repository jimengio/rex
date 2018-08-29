import React from "react";
import produce from "immer";

let RexContext = React.createContext("rex");

export class RexProvider extends React.Component<any, any> {
  render() {
    return <RexContext.Provider value={this.props.store}>{this.props.children}</RexContext.Provider>;
  }
}

export function createStore(initalState) {
  let store = {
    initialState: initalState,
    currentState: initalState,
    listeners: [],
  };

  return {
    getState: () => store.currentState,
    listen: (f) => {
      store = produce(store, (draft) => {
        draft.listeners.push(f);
      });
    },
    remove: (f) => {
      store = produce(store, (draft) => {
        draft.listeners = draft.listeners.filter((x) => x != f);
      });
    },
    update: (f) => {
      store = produce(store, (draft) => {
        draft.currentState = f(draft.currentState);
      });
    },
  };
}

export function mapStateToProps(selector) {
  return (ChildComponent) => {
    return (
      <RexContext.Consumer>
        {(store: any) => {
          return class RexWrapper extends React.PureComponent<any, any> {
            constructor(props) {
              super(props);

              this.state = {
                props: produce(selector(store.getState())),
              };
            }

            immerState(f: (s: any) => void, cb?) {
              this.setState(produce<any>(f), cb);
            }

            render() {
              let newProps = selector(store);
              return <ChildComponent {...this.state.props} />;
            }

            componentDidMount() {
              store.listen(this.onStoreChange);
            }

            componentWillMount() {
              store.removeListener(this.onStoreChange);
            }

            onStoreChange = (newStore) => {
              this.immerState((state) => {
                state.props = selector(store.getState());
              });
            };
          };
        }}
      </RexContext.Consumer>
    );
  };
}
