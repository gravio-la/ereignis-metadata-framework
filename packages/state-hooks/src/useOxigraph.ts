import { AsyncOxigraph } from "@graviola/async-oxigraph";
import init, { Store } from "oxigraph/web";
import { create } from "zustand";
import { useAdbContext } from "./provider";
import { useEffect } from "react";

const initAsyncOxigraph = async function (publicBasePath: string) {
  const ao = AsyncOxigraph.getInstance(publicBasePath + "/worker.js");
  await ao.init(publicBasePath + "/web_bg.wasm"); // Default is same folder as worker.js
  return ao;
};

const initSyncOxigraph = async function (publicBasePath: string) {
  await init(publicBasePath + "/web_bg.wasm"); // Default is same folder as worker.js
  return new Store();
};

type OxigraphStore = {
  oxigraph: { ao: AsyncOxigraph | Store } | undefined;
  init: (baseIRI: string, sync?: boolean) => void;
  initialized: boolean;
};

export const useOxigraphZustand = create<OxigraphStore>((set, get) => {
  return {
    oxigraph: undefined,
    initialized: false,
    init: async (publicBasePath: string) => {
      if (get().initialized) return;
      set({ initialized: true });
      const ao = await initAsyncOxigraph(publicBasePath);
      set({ oxigraph: { ao } });
    },
  };
});

export const useOxigraph: () => Omit<OxigraphStore, "init"> = () => {
  const {
    env: { publicBasePath },
  } = useAdbContext();
  const { init, ...state } = useOxigraphZustand();

  useEffect(() => {
    init(publicBasePath);
  }, [init, publicBasePath]);

  return {
    ...state,
  };
};
