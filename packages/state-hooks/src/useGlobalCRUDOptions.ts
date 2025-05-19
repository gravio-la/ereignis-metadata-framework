import { CRUDFunctions } from "@graviola/edb-core-types";
import { useCrudProvider } from "./provider";

type UseGlobalCRUDOptions = () => {
  crudOptions?: CRUDFunctions;
};

export const useGlobalCRUDOptions: UseGlobalCRUDOptions = () => {
  const { crudOptions } = useCrudProvider();
  return {
    crudOptions,
  };
};
