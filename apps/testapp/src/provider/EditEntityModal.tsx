import NiceModal, { NiceModalHocProps, useModal } from "@ebay/nice-modal-react";
import { useAdbContext, useTypeIRIFromEntity } from "@graviola/edb-state-hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useCRUDWithQueryClient,
} from "@graviola/edb-state-hooks";
import { Button, Stack } from "@mui/material";
import { JSONSchema7 } from "json-schema";
import { PrimaryFieldResults } from "@graviola/edb-core-types";
import { cleanJSONLD } from "@graviola/jsonld-utils";
import { MuiEditDialog } from "@graviola/edb-basic-components";
import {
  applyToEachField,
  extractFieldIfString,
} from "@graviola/edb-data-mapping";
import { EditEntityModalProps } from "@graviola/semantic-jsonform-types";
import { JsonFormsRendererRegistryEntry, JsonSchema } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import isEqual from "lodash-es/isEqual";
import { bringDefinitionToTop } from "@graviola/json-schema-utils";

export const EditEntityModal: (renderers: JsonFormsRendererRegistryEntry[]) => React.FC<EditEntityModalProps & NiceModalHocProps> = (renderers) => NiceModal.create(
  ({
    typeIRI,
    entityIRI,
    data: defaultData,
    disableLoad,
  }: EditEntityModalProps) => {
    const {
      jsonLDConfig,
      typeIRIToTypeName,
      queryBuildOptions: { primaryFieldExtracts },
      components: { SemanticJsonForm },
      createEntityIRI,
      schema
    } = useAdbContext();
    const modal = useModal();
    const classIRI = useTypeIRIFromEntity(entityIRI, typeIRI, disableLoad);
    const typeName = useMemo(
      () => typeIRIToTypeName(classIRI),
      [classIRI, typeIRIToTypeName],
    );
    //const loadedSchema = useAppSelector(rootState => rootState.jsonFormsEdit.definitions[typeName] as JSONSchema7);
    const loadedSchema = bringDefinitionToTop(schema, typeName)
    const { loadEntity, saveMutation } = useCRUDWithQueryClient({
      entityIRI,
      typeIRI: classIRI,
      schema: loadedSchema,
      queryOptions: {
        enabled: !disableLoad,
        refetchOnWindowFocus: true,
      },
      loadQueryKey: "show"
    });
    const [firstTimeSaved, setFirstTimeSaved] = useState(false);
    const [isStale, setIsStale] = useState(false);

    const [ formData, setFormData ] = useState(defaultData);


    const handleSaveSuccess = useCallback(() => {
      setFirstTimeSaved(true);
      setIsStale(false);
    }, [setFirstTimeSaved, setIsStale]);

    const handleSave = useCallback(
      async (saveSuccess?: () => void) => {
        console.log("save")
        saveMutation
          .mutateAsync(formData)
          .then(async () => {
            handleSaveSuccess();
            typeof saveSuccess === "function" && saveSuccess();
          })
          .catch((e) => {
            console.error("Error while saving " + e.message);
          });
      },
      [saveMutation, formData, handleSaveSuccess],
    );

    const handleAccept = useCallback(() => {
      const acceptCallback = async () => {
        let cleanedData = await cleanJSONLD(formData, loadedSchema, {
          jsonldContext: jsonLDConfig.jsonldContext,
          defaultPrefix: jsonLDConfig.defaultPrefix,
          keepContext: true,
        });
        modal.resolve({
          entityIRI,
          data: cleanedData,
        });
        modal.remove();
      };
      return handleSave(acceptCallback);
    }, [formData, loadedSchema, handleSave, modal, jsonLDConfig, createEntityIRI, typeName]);


    const handleFormDataChange = useCallback(
      async ({data, errors}: {data: any, errors: any[]}) => {
        // Skip update if data is deeply equal to current formData
        // to prevent unnecessary state updates and re-renders
        if (isEqual(data, formData)) {
          return;
        }
        setFormData(data);
        console.log("formData", formData)
        setIsStale(true);
      },
      [setIsStale, setFormData, formData],
    );

    return (
      <MuiEditDialog
        open={modal.visible}
        onClose={() => modal.remove()}
        onSave={handleSave}
        title={defaultData.label || typeName}
        editMode={true}
        actions={
          <Stack>
            <Button onClick={handleAccept}>
              {isStale || !firstTimeSaved ? "save and accept" : "accept"}
            </Button>
            <Button onClick={() => modal.remove()}>cancel</Button>
          </Stack>
        }
      >
      <JsonForms
        data={formData}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={handleFormDataChange}
        schema={loadedSchema as JsonSchema}
      />
      </MuiEditDialog>
    );
  },
);

