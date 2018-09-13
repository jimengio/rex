## Rex

Store abstraction WIP...

### Usage

```bash
yarn add @jimengio/rex
```

Model:

```ts
export interface IGlobalStore {
  schemaVersion: string;
  data: number;
  branchData: number;
  homeData: number;
}

export let initialStore: IGlobalStore = {
  schemaVersion: "0.1",
  data: 2,
  branchData: 2,
  homeData: 2,
};
```

```ts
export let globalStore = createStore<IGlobalStore>(initialStore);
```

View:

```tsx
const renderApp = () => {
  ReactDOM.render(
    <RexProvider value={globalStore}>
      <Container store={globalStore.getState()} />
    </RexProvider>,
    document.querySelector(".app")
  );
};

window.onload = () => {
  renderApp();
  globalStore.subscribe(renderApp);
};
```

Controller:

```ts
export function doIncData() {
  globalStore.update((store) => {
    store.data += 1;
  });
}
```

Selector:

```tsx
@connectRex((store: IGlobalStore) => ({ data: store.data }))
export default class Inside extends React.PureComponent<IProps, IState> {
  render() {
    return <div />;
  }
}
```

### Workflow

https://github.com/jimengio/ts-workflow

### License

MIT
