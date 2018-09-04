import { globalStore } from "store";

export function doIncData() {
  globalStore.update((store) => {
    store.data += 1;
  });
}
