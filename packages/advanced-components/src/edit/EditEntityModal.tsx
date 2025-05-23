import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useAdbContext, useTypeIRIFromEntity } from "@graviola/edb-state-hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useCRUDWithQueryClient,
  useExtendedSchema,
} from "@graviola/edb-state-hooks";
import { useTranslation } from "next-i18next";
import { Button, Stack } from "@mui/material";
import type { JSONSchema7 } from "json-schema";
import { useFormDataStore } from "@graviola/edb-state-hooks";
import type { PrimaryFieldResults } from "@graviola/edb-core-types";
import { cleanJSONLD } from "@graviola/jsonld-utils";
import { MuiEditDialog } from "@graviola/edb-basic-components";
import {
  applyToEachField,
  extractFieldIfString,
} from "@graviola/edb-data-mapping";
import type { EditEntityModalProps } from "@graviola/semantic-jsonform-types";

export const EditEntityModal = NiceModal.create(
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
      uischemata,
      components: { SemanticJsonForm },
      useSnackbar,
    } = useAdbContext();
    const modal = useModal();
    const classIRI = useTypeIRIFromEntity(entityIRI, typeIRI, disableLoad);
    const typeName = useMemo(
      () => typeIRIToTypeName(classIRI),
      [classIRI, typeIRIToTypeName],
    );
    const loadedSchema = useExtendedSchema({ typeName });
    const { loadQuery, saveMutation } = useCRUDWithQueryClient({
      entityIRI,
      typeIRI: classIRI,
      schema: loadedSchema,
      queryOptions: {
        enabled: !disableLoad,
        refetchOnWindowFocus: true,
        initialData: defaultData ? { document: defaultData } : undefined,
      },
      loadQueryKey: "show",
    });
    const { t } = useTranslation();
    const [firstTimeSaved, setFirstTimeSaved] = useState(false);
    const [isStale, setIsStale] = useState(false);
    const data = loadQuery.data?.document || defaultData;
    const cardInfo = useMemo<PrimaryFieldResults<string>>(() => {
      const fieldDecl = primaryFieldExtracts[typeName];
      if (data && fieldDecl)
        return applyToEachField(data, fieldDecl, extractFieldIfString);
      return {
        label: null,
        description: null,
        image: null,
      };
    }, [typeName, data, primaryFieldExtracts]);

    const { formData, setFormData } = useFormDataStore({
      entityIRI,
      typeIRI,
    });

    useEffect(() => {
      setFormData(data);
    }, [data, setFormData]);
    const uischema = useMemo(() => uischemata?.[typeName], [typeName]);
    const { enqueueSnackbar } = useSnackbar();

    const handleSaveSuccess = useCallback(() => {
      setFirstTimeSaved(true);
      setIsStale(false);
    }, [setFirstTimeSaved, setIsStale]);

    const handleSave = useCallback(
      async (saveSuccess?: () => void) => {
        saveMutation
          .mutateAsync(formData)
          .then(async (skipLoading?: boolean) => {
            enqueueSnackbar("Saved", { variant: "success" });
            !skipLoading && (await loadQuery.refetch());
            handleSaveSuccess();
            typeof saveSuccess === "function" && saveSuccess();
          })
          .catch((e) => {
            enqueueSnackbar("Error while saving " + e.message, {
              variant: "error",
            });
          });
      },
      [enqueueSnackbar, saveMutation, loadQuery, formData, handleSaveSuccess],
    );

    const handleAccept = useCallback(() => {
      const acceptCallback = async () => {
        let cleanedData = await cleanJSONLD(formData, loadedSchema, {
          jsonldContext: jsonLDConfig.jsonldContext,
          defaultPrefix: jsonLDConfig.defaultPrefix,
          keepContext: false,
        });
        modal.resolve({
          entityIRI: formData["@id"],
          data: cleanedData,
        });
        modal.remove();
      };
      return handleSave(acceptCallback);
    }, [formData, loadedSchema, handleSave, modal, jsonLDConfig]);

    const handleFormDataChange = useCallback(
      async (data: any) => {
        setFormData(data);
        setIsStale(true);
      },
      [setIsStale, setFormData],
    );

    const handleClose = useCallback(() => {
      modal.reject();
      modal.remove();
    }, [modal]);

    return (
      <MuiEditDialog
        open={modal.visible}
        onClose={handleClose}
        onSave={handleSave}
        title={cardInfo.label}
        editMode={true}
        actions={
          <Stack direction="row" spacing={2}>
            <Button onClick={handleClose} color="error">
              {t("cancel")}
            </Button>
            <Button onClick={handleAccept} variant="contained">
              {isStale || !firstTimeSaved ? t("save and accept") : t("accept")}
            </Button>
          </Stack>
        }
      >
        <SemanticJsonForm
          data={formData}
          onChange={handleFormDataChange}
          typeIRI={typeIRI}
          defaultEditMode={true}
          searchText={""}
          schema={loadedSchema as JSONSchema7}
          formsPath={"root"}
          jsonFormsProps={{
            uischema,
          }}
          enableSidebar={false}
          disableSimilarityFinder={true}
          wrapWithinCard={false}
        />
      </MuiEditDialog>
    );
  },
);
