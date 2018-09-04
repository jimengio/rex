export interface IGlobalStore {
  schemaVersion: string;
  data: number;
}

export let initialStore: IGlobalStore = {
  schemaVersion: "0.1",
  data: 2,
};
