## Rex

Store abstraction based on immer and Context APIs.

### Rationale

In our app, we think Redux is too general and we want a more specific solution for our own case:

- we want all data wrapped by immer, and in a simpler syntax.
- better support for TypeScript.
- since we are manipulating data in a mutating syntax, actions looks redundant so we discourage using it, instead we use mutation functions directly.

Rex prefers MVC pattern from early React apps. There might be performance issues since `useContext` API is used and we need further investigation.

### Usage

![](https://img.shields.io/npm/v/@jimengio/rex.svg)

```bash
npm install @jimengio/rex
```

Read runnable app example at https://github.com/minimal-xyz/minimal-rex/tree/master/src .

Basically, a Rex app is an MVC app:

##### Model

```ts
import { createStore } from "@jimengio/rex";

export interface IGlobalStore {
  schemaVersion: string;
  data: number;
  branchData: number;
  homeData: number;
  obj: {
    a: number;
  };
}

export let initialStore: IGlobalStore = {
  schemaVersion: "0.1",
  data: 2,
  branchData: 2,
  homeData: 2,
  obj: { a: 2 },
};

export let globalStore = createStore<IGlobalStore>(initialStore);
```

##### Controller

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

##### View

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

To read data in child components, use function `useRexContext`.

> Notice that it rerenders on every change, so there might be performance issues when data is large.

```tsx
let HooksChild: SFC<IProps> = (props) => {
  let contextData = useRexContext((store: IGlobalStore) => {
    return { data: store.data };
  });

  return <pre>{JSON.stringify(contextData, null, 2)}</pre>;
};
```

For class-based components, use `connectRex`:

```tsx
import { connectRex } from "@jimengio/rex";

@connectRex((store: IGlobalStore, ownProps: IProps) => ({ data: store.data }))
export default class Inside extends React.PureComponent<IProps, IState> {
  render() {
    return <div />;
  }
}
```

### Debug

Rex added a log even in release mode for debugging, add run this to turn on:

```js
window.REX_DEV_LOG = true;
```

### Workflow

https://github.com/jimengio/ts-workflow

### License

MIT
