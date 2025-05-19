import { useCallback } from "react";
import { useAdbContext } from "./provider";
import type { ModRouter } from "@graviola/semantic-jsonform-types";

type Options = {
  locale: string;
};
export const useModifiedRouter: (options?: Options) => ModRouter = (
  options,
) => {
  const { useRouterHook } = useAdbContext();
  const router = useRouterHook();

  const { locale = "de" } = options || {};

  const push = useCallback<ModRouter["push"]>(
    async (url, as) => {
      let skipLocaleHandling = false;
      if (url.toString().indexOf("http") === 0) skipLocaleHandling = true;
      if (locale && !skipLocaleHandling) {
        return await router.push(`/${locale}${url.toString()}`, as);
      }
      return false;
    },
    [locale, router],
  );
  return {
    ...router,
    push,
  };
};
