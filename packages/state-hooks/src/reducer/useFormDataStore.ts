import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectFormData } from "./formSelectors";
import { AppDispatch, RootState } from "./formStore";

type UseFormDataStoreType = {
  entityIRI: string;
  typeIRI: string;
  createNewEntityIRI?: () => string;
  onEntityIRIChange?: (newEntityIRI: string) => void;
  autoCreateNewEntityIRI?: boolean;
};

export const useFormDataStore = ({
  entityIRI,
  onEntityIRIChange,
  autoCreateNewEntityIRI,
  createNewEntityIRI,
  typeIRI,
}: UseFormDataStoreType) => {
  const formDataOrUndefined = useSelector<RootState>((state) =>
    selectFormData(state, entityIRI),
  ) as any;
  const formData = useMemo(
    () => formDataOrUndefined || {},
    [formDataOrUndefined],
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (
      !autoCreateNewEntityIRI ||
      !createNewEntityIRI ||
      typeof onEntityIRIChange !== "function"
    )
      return;
    onEntityIRIChange(createNewEntityIRI());
  }, [typeIRI, autoCreateNewEntityIRI, createNewEntityIRI, onEntityIRIChange]);

  const setFormData = useCallback(
    (data: any | ((_data: any) => any)) => {
      if (typeof data === "function") {
        console.warn(
          "deprecated, calling setFormData as a function has no effect since 1.2.0",
        );
        return;
      }
      dispatch({
        type: "formData/updateFormData",
        payload: { propertyPath: entityIRI, updater: data },
      });
    },
    [dispatch, entityIRI],
  );

  return { formData, setFormData };
};
