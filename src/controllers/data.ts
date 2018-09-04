import { globalStore } from "store";

export function doIncData() {
  globalStore.update((store) => {
    store.data += 1;
  });
}

export function doIncBranch() {
  globalStore.update((store) => {
    store.branchData += 1;
  });
}

export function doIncHome() {
  globalStore.update((store) => {
    store.homeData += 1;
  });
}
