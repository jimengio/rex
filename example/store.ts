import { createStore } from "../src/rex";
import { initialStore, IGlobalStore } from "models/global";

export let globalStore = createStore<IGlobalStore>(initialStore);
