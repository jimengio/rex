## Rex

Store abstraction based on immer and Context APIs.

### Usage

![](https://img.shields.io/npm/v/@jimengio/rex.svg)

```bash
npm install @jimengio/rex
```

Model:

```ts
export interface IGlobalStore {
  schemaVersion: string;
  data: number;
  branchData: number;
  homeData: number;
  obj: {
    a: number;
  }
}

export let initialStore: IGlobalStore = {
  schemaVersion: "0.1",
  data: 2,
  branchData: 2,
  homeData: 2,
  obj: { a: 2 }
};
```

```ts
import { createStore } from "@jimengio/rex";

export let globalStore = createStore<IGlobalStore>(initialStore);
```

View:

```tsx
import { RexProvider } from "@jimengio/rex";

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

  globalStore.updateAt("obj", (obj) => {
    obj.a += 1;
  });
}
```

Selector:

```tsx
import { connectRex } from "@jimengio/rex";

@connectRex((store: IGlobalStore, ownProps: IProps) => ({ data: store.data }))
export default class Inside extends React.PureComponent<IProps, IState> {
  render() {
    return <div />;
  }
}
```

Or use hooks(Caution: it rerenders on every change) with `useRexContext`:

```tsx
let HooksChild: SFC<IProps> = (props) => {
  let contextData = useRexContext((store: IGlobalStore) => {
    return { data: store.data };
  });

  return (
    <pre>{JSON.stringify(contextData, null, 2)}</pre>
  );
};
```

### Workflow

https://github.com/jimengio/ts-workflow

### License

MIT
