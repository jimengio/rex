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
