import { createStore } from "rex";
import { initialStore, IGlobalStore } from "models/global";

export let globalStore = createStore<IGlobalStore>(initialStore);
