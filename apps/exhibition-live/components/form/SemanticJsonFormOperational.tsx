import "react-json-view-lite/dist/index.css";

import NiceModal from "@ebay/nice-modal-react";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAdbContext,
  useCRUDWithQueryClient,
} from "@graviola/edb-state-hooks";
import { useSnackbar } from "notistack";
import { SemanticJsonFormToolbar } from "./SemanticJsonFormToolbar";
import { useSettings } from "@graviola/edb-state-hooks";
import { useQueryKeyResolver } from "@graviola/edb-state-hooks";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { create } from "zustand";
import { useTranslation } from "next-i18next";
import { cleanJSONLD } from "@graviola/jsonld-utils";
import { FormDebuggingTools } from "@graviola/edb-debug-utils";
import { GenericModal } from "@graviola/edb-basic-components";
import {
  ChangeCause,
  SemanticJsonFormProps,
} from "@graviola/semantic-jsonform-types";
import type { LoadResult } from "@graviola/sparql-schema";

type SemanticJsonFormStateType = {
  isSaving: boolean;
  isLoading: boolean;
  isEditing: boolean;
  setData: (data: any, cause: ChangeCause) => void;
  data: any;
};

const useSemanticJsonFormState = create<SemanticJsonFormStateType>(
  (set, get) => ({
    isSaving: false,
    isEditing: false,
    isLoading: false,
    data: {},
    setData: (data: any, cause: ChangeCause) => {
      if (cause === "user" && !get().isSaving) {
        set({ data });
      }
      if (cause === "mapping") {
        set({ data });
      }
      if (cause === "reload" && !get().isLoading && !get().isEditing) {
        set({ data });
      }
    },
  }),
);
const SemanticJsonFormOperational: FunctionComponent<SemanticJsonFormProps> = ({
  entityIRI,
  data,
  onChange,
  shouldLoadInitially,
  typeIRI,
  schema,
  jsonldContext,
  jsonFormsProps,
  hideToolbar,
  forceEditMode,
  defaultEditMode,
  toolbarChildren,
  defaultPrefix,
  ...rest
}) => {
  const { t } = useTranslation();
  const [managedEditMode, setEditMode] = useState(defaultEditMode || false);
  const editMode = useMemo(
    () =>
      (typeof forceEditMode !== "boolean" && managedEditMode) || forceEditMode,
    [managedEditMode, forceEditMode],
  );
  const { enqueueSnackbar } = useSnackbar();

  const {
    components: { EntityDetailModal, SemanticJsonForm },
  } = useAdbContext();

  const { saveMutation, removeMutation, loadEntity } = useCRUDWithQueryClient({
    entityIRI,
    typeIRI,
    schema,
    queryOptions: { enabled: false },
    loadQueryKey: "rootLoad",
  });

  const { updateSourceToTargets, removeSource } = useQueryKeyResolver();
  const [isSaving, setIsSaving] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const isLoading = useMemo(
    () => saveMutation.isLoading || isSaving || isReloading,
    [saveMutation.isLoading, isSaving, isReloading],
  );

  const refetch = useCallback(
    () =>
      loadEntity(entityIRI, typeIRI).then((loadResult: LoadResult | null) => {
        if (loadResult !== null && loadResult?.document) {
          const data = loadResult.document;
          updateSourceToTargets(entityIRI, loadResult.subjects);
          onChange(data);
          return data;
        }
      }),
    [loadEntity, entityIRI, typeIRI, schema, onChange, updateSourceToTargets],
  );

  useEffect(() => {
    return () => {
      removeSource(entityIRI);
    };
  }, [entityIRI, removeSource]);

  const [initialFetchKey, setInitialFetchKey] = useState<string | null>(null);
  const fetchKey = useMemo(
    () => `${entityIRI}-${typeIRI}`,
    [entityIRI, typeIRI],
  );
  const [initiallyLoaded, setInitiallyLoaded] = useState(false);
  useEffect(() => {
    if (!entityIRI || !typeIRI) return;
    if (initialFetchKey === fetchKey) return;
    setInitiallyLoaded(false);
    setInitialFetchKey(fetchKey);
    refetch().finally(() => {
      setInitiallyLoaded(true);
    });
  }, [
    entityIRI,
    typeIRI,
    refetch,
    fetchKey,
    initialFetchKey,
    setInitialFetchKey,
  ]);

  const handleReset = useCallback(() => {
    NiceModal.show(GenericModal, {
      type: "reset",
    }).then(() => {
      onChange({});
    });
  }, [onChange]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    saveMutation
      .mutateAsync(data)
      .then(async () => {
        //TODO should we clear and refetch? or just refetch?
        onChange({});
        setTimeout(() => {
          refetch().finally(() => {
            setTimeout(() => {
              enqueueSnackbar("Saved", { variant: "success" });
              setIsSaving(false);
            }, 10);
          });
        }, 10);
      })
      .catch((e) => {
        setIsSaving(false);
        enqueueSnackbar("Error while saving " + e.message, {
          variant: "error",
        });
      });
  }, [setIsSaving, enqueueSnackbar, saveMutation, refetch, data, onChange]);

  const handleRemove = useCallback(async () => {
    NiceModal.show(GenericModal, {
      type: "delete",
    }).then(() => {
      removeMutation.mutate();
    });
  }, [removeMutation]);

  const handleReload = useCallback(async () => {
    NiceModal.show(GenericModal, {
      type: "reload",
    }).then(() => {
      setIsReloading(true);
      onChange({});
      refetch().finally(() => {
        setTimeout(() => {
          enqueueSnackbar(t("reloaded"), { variant: "success" });
          setIsReloading(false);
        }, 1000);
      });
    });
  }, [refetch, onChange, setIsReloading, enqueueSnackbar, t]);

  const handleToggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, [setEditMode]);

  //the cleaned data is the form data ran through the json schema based parser and the json to JSONLD converter
  const [cleanedData, setCleanedData] = useState({});
  const {
    features: { enableDebug },
  } = useSettings();
  useEffect(() => {
    if (!data || !enableDebug) return;
    try {
      cleanJSONLD(data, schema, {
        jsonldContext,
        defaultPrefix,
        keepContext: true,
      }).then((cleanedData) => {
        setCleanedData(cleanedData);
      });
    } catch (e) {
      setCleanedData({
        error: "Error while cleaning JSON-LD ",
        message: e.message,
      });
    }
  }, [enableDebug, data, schema, jsonldContext, defaultPrefix]);

  const handleShowEntry = useCallback(() => {
    NiceModal.show(EntityDetailModal, {
      typeIRI,
      entityIRI: entityIRI,
      readonly: true,
    });
  }, [typeIRI, entityIRI, EntityDetailModal]);

  const handleOnChange = useCallback(
    (data: any, reason: ChangeCause) => {
      if (reason === "user" && editMode && !isLoading) {
        onChange(data);
      } else if (reason === "mapping" && !isLoading) {
        onChange(data);
      } else if (reason === "reload" && isReloading) {
        onChange(data);
      }
    },
    [onChange, editMode, isLoading, isReloading],
  );

  const jsonFormsPropsFinal = useMemo(
    () => ({
      readonly: !editMode || !initiallyLoaded,
      ...(jsonFormsProps || {}),
    }),
    [editMode, initiallyLoaded, jsonFormsProps],
  );

  return (
    <Box sx={{ minHeight: "100%", width: "100%" }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SemanticJsonForm
        typeIRI={typeIRI}
        data={data}
        onChange={handleOnChange}
        schema={schema}
        formsPath="root"
        jsonFormsProps={jsonFormsPropsFinal}
        toolbar={
          !hideToolbar && (
            <SemanticJsonFormToolbar
              editMode={editMode}
              onEditModeToggle={handleToggleEditMode}
              onReset={handleReset}
              onSave={handleSave}
              onRemove={handleRemove}
              onReload={handleReload}
              onShow={handleShowEntry}
            >
              {toolbarChildren}
            </SemanticJsonFormToolbar>
          )
        }
        {...rest}
      />
      <FormDebuggingTools
        jsonData={{
          formData: data,
          cleanedData,
        }}
      />
    </Box>
  );
};

export default SemanticJsonFormOperational;
