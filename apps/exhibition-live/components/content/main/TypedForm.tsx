import { Alert, Box, Button, Grid } from "@mui/material";
import { JSONSchema7 } from "json-schema";
import React, { useCallback, useMemo } from "react";

import {
  useAdbContext,
  useFormEditor,
  useGlobalSearch,
  useLocalSettings,
  useModifiedRouter,
  useRightDrawerState,
  useSettings,
} from "@graviola/edb-state-hooks";
import { encodeIRI } from "@graviola/edb-core-utils";
import NewSemanticJsonForm from "../../form/SemanticJsonFormOperational";
import { useFormDataStore, useExtendedSchema } from "@graviola/edb-state-hooks";
import { useCRUDWithQueryClient } from "@graviola/edb-state-hooks";
import { EntityDetailElement } from "@graviola/edb-advanced-components";
import { materialCategorizationStepperLayoutWithPortal } from "@graviola/edb-layout-renderer";

type Props = {
  children: React.ReactChild;
  data: any;
  classIRI: string;
  entityIRI: string;
};
const WithPreviewForm = ({ classIRI, entityIRI, data, children }: Props) => {
  const isLandscape = false;
  const { previewEnabled } = useFormEditor();
  const { features } = useSettings();
  const { width: rightDrawerWidth, open: rightDrawerOpen } =
    useRightDrawerState();
  const rightBoxWidth = useMemo(
    () => (rightDrawerOpen ? rightDrawerWidth + 10 : 0),
    [rightDrawerOpen, rightDrawerWidth],
  );

  return (
    <>
      <Grid
        container
        direction={isLandscape ? "column" : "row"}
        wrap="nowrap"
        sx={{ height: "100%" }}
      >
        <Grid item flex={1}>
          {children}
        </Grid>
        {features?.enablePreview && previewEnabled && (
          <Grid item flex={1}>
            <EntityDetailElement
              typeIRI={classIRI}
              entityIRI={entityIRI}
              data={data}
              cardActionChildren={null}
              readonly
            />
          </Grid>
        )}
        <Grid
          item
          sx={{
            width: rightBoxWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: rightBoxWidth,
              // boxSizing: 'border-box',
            },
          }}
        />
      </Grid>
    </>
  );
};

export type MainFormProps = {
  typeName: string;
  entityIRI?: string;
  classIRI: string;
};
const TypedForm = ({ typeName, entityIRI, classIRI }: MainFormProps) => {
  const {
    typeIRIToTypeName,
    jsonLDConfig: { defaultPrefix, jsonldContext },
    uischemata,
  } = useAdbContext();
  //const { formData: data, setFormData: setData } = useFormData();
  const { formData: data, setFormData: setData } = useFormDataStore({
    entityIRI,
    typeIRI: classIRI,
  });

  const { search: searchText } = useGlobalSearch();
  const router = useModifiedRouter();

  const handleChange = useCallback(
    (entityData: any) => {
      if (!entityData) return;
      const { "@id": entityIRI, "@type": typeIRI } = entityData;
      if (!entityIRI || !typeIRI) {
        return;
      }
      const typeName = typeIRIToTypeName(typeIRI);
      router.push(`/create/${typeName}?encID=${encodeIRI(entityIRI)}`);
    },
    [router, typeIRIToTypeName],
  );
  const loadedSchema = useExtendedSchema({ typeName });

  const { width: rightDrawerWidth, open: rightDrawerOpen } =
    useRightDrawerState();
  const rightBoxWidth = useMemo(
    () => (rightDrawerOpen ? rightDrawerWidth + 10 : 0),
    [rightDrawerOpen, rightDrawerWidth],
  );

  //const { stepperRef, actionRef } = useFormRefsContext();
  const handleChangeData = useCallback(
    (_data: any) => {
      if (typeof _data === "function") {
        const newData = _data(data);
        setData(newData);
      } else setData(_data);
    },
    [setData, data],
  );
  const mainFormRenderers = useMemo(() => {
    return [
      // @ts-ignore
      materialCategorizationStepperLayoutWithPortal(),
    ];
  }, []);

  const uischema = useMemo(() => uischemata?.[typeName], [typeName]);

  const { activeEndpoint } = useSettings();
  const { openSettings } = useLocalSettings();

  if (!activeEndpoint) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Alert
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={openSettings}>
              Open Settings
            </Button>
          }
        >
          No active endpoint configured. Please configure an endpoint in
          settings.
        </Alert>
      </Box>
    );
  }

  const jsonFormsPropsFinal = useMemo(
    () => ({
      uischema,
      renderers: mainFormRenderers,
      config: {
        useCRUDHook: useCRUDWithQueryClient,
      },
    }),
    [uischema, mainFormRenderers],
  );

  return (
    <WithPreviewForm data={data} classIRI={classIRI} entityIRI={entityIRI}>
      {loadedSchema && (
        <Box sx={{ p: 2, display: "flex" }}>
          <NewSemanticJsonForm
            defaultEditMode={true}
            data={data}
            entityIRI={entityIRI}
            onChange={handleChangeData}
            searchText={searchText}
            shouldLoadInitially
            typeIRI={classIRI}
            onEntityDataChange={handleChange}
            defaultPrefix={defaultPrefix}
            jsonldContext={jsonldContext}
            schema={loadedSchema as JSONSchema7}
            jsonFormsProps={jsonFormsPropsFinal}
            enableSidebar={false}
            disableSimilarityFinder={true}
            wrapWithinCard={true}
          />
        </Box>
      )}
    </WithPreviewForm>
  );
};

export default TypedForm;
