import { AsyncOxigraph } from "@graviola/async-oxigraph";
import { useAdbContext } from "@graviola/edb-state-hooks";
import type { Store } from "oxigraph/web";
import { useEffect } from "react";
import { create } from "zustand";

export const initAsyncOxigraph = async function (publicBasePath: string) {
  const ao = AsyncOxigraph.getInstance(publicBasePath + "/worker.js");
  await ao.init(publicBasePath + "/web_bg.wasm"); // Default is same folder as worker.js
  return ao;
};

export const initSyncOxigraph = async function (publicBasePath: string) {
  return import("oxigraph/web").then(async ({ default: init, Store }) => {
    await init(publicBasePath + "/web_bg.wasm"); // Default is same folder as worker.js
    return new Store();
  });
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
