import { AsyncOxigraph } from "@graviola/async-oxigraph";
import type { Store } from "oxigraph/web";

export const isAsyncOxigraph = (
  ao: AsyncOxigraph | Store,
): ao is AsyncOxigraph => {
  return typeof ao === "object" && "close" in ao;
};
