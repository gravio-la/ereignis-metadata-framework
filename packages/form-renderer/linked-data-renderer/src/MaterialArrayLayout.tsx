import { Pulse } from "@graviola/edb-basic-components";
import { irisToData, makeFormsPath } from "@graviola/edb-core-utils";
import {
  applyToEachField,
  extractFieldIfString,
} from "@graviola/edb-data-mapping";
import {
  useAdbContext,
  useCRUDWithQueryClient,
  useFormDataStore,
} from "@graviola/edb-state-hooks";
import { validate } from "@graviola/edb-ui-utils";
import { bringDefinitionToTop } from "@graviola/json-schema-utils";
import {
  ArrayLayoutProps,
  composePaths,
  computeLabel,
  createDefaultValue,
  JsonSchema,
  JsonSchema7,
  Resolve,
} from "@jsonforms/core";
import { useJsonForms } from "@jsonforms/react";
import CheckIcon from "@mui/icons-material/Check";
import { Box, Grid, IconButton, List, Paper, Tooltip } from "@mui/material";
import { ErrorObject } from "ajv";
import { JSONSchema7 } from "json-schema";
import { JSONSchema } from "json-schema-to-ts";
import { orderBy, uniqBy } from "lodash-es";
import merge from "lodash-es/merge";
import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ArrayLayoutToolbar } from "./ArrayToolbar";
import { SemanticFormsInline } from "./SemanticFormsInline";
import { SemanticFormsModal } from "./SemanticFormsModal";
import { SimpleExpandPanelRenderer } from "./SimpleExpandPanelRenderer";

const uiSchemaOptionsSchema = {
  type: "object",
  properties: {
    labelAsHeadline: {
      type: "boolean",
    },
    hideRequiredAsterisk: {
      type: "boolean",
    },
    isReifiedStatement: {
      type: "boolean",
    },
    orderBy: {
      type: "string",
    },
    autoFocusOnValid: {
      type: "boolean",
    },
    additionalKnowledgeSources: {
      type: "array",
      items: {
        type: "string",
      },
    },
    elementDetailItemPath: {
      type: "string",
    },
    elementLabelTemplate: {
      type: "string",
    },
    elementLabelProp: {
      type: "string",
    },
    imagePath: {
      type: "string",
    },
  },
} as const satisfies JSONSchema;

export const MaterialArrayLayout = (props: ArrayLayoutProps) => {
  const innerCreateDefaultValue = useCallback(
    () => createDefaultValue(props.schema, props.rootSchema),
    [props.schema, props.rootSchema],
  );
  const {
    data,
    path,
    schema,
    errors,
    addItem,
    label,
    required,
    rootSchema,
    config,
    removeItems,
    uischema,
    enabled,
  } = props;
  const { readonly, core } = useJsonForms();
  const realData = Resolve.data(core.data, path);
  const {
    createEntityIRI,
    typeIRIToTypeName,
    typeNameToTypeIRI,
    queryBuildOptions: { primaryFields, primaryFieldExtracts },
  } = useAdbContext();
  const { context } = useMemo(() =>  merge({}, config, props.uischema?.options), [config, props.uischema?.options])
  const typeIRI = useMemo(() => {
    const lastScopeSegement = path.split("/").pop();
    if(context?.typeIRI) return context.typeIRI
    let iri = schema.properties?.["@type"]?.const;
    try {
      if (!iri) {
        const type = rootSchema.properties?.[lastScopeSegement]?.items?.["$ref"];
        const lastSegment = type?.split("/").pop();
        iri = lastSegment ? typeNameToTypeIRI(lastSegment) : "";
      }
    } catch (e) {
      console.error(e);
    }
    return iri;
  }, [schema, rootSchema, path, typeNameToTypeIRI, context]);
  const typeName = useMemo(
    () => typeIRIToTypeName(typeIRI),
    [typeIRI, typeIRIToTypeName],
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { t } = useTranslation();

  const [entityIRI, setEntityIRI] = useState(createEntityIRI(typeName));
  const { formData, setFormData } = useFormDataStore({
    entityIRI,
    typeIRI,
    createNewEntityIRI: () => createEntityIRI(typeName),
    autoCreateNewEntityIRI: true,
  });

  const addButtonRef = useRef<HTMLButtonElement>(null);

  const handleInlineFormDataChange = useCallback(
    (data: any) => {
      setFormData(data);
    },
    [setFormData],
  );

  const handleCreateNew = useCallback(() => {
    setFormData(irisToData(createEntityIRI(typeName), typeIRI));
    setModalIsOpen(true);
  }, [setModalIsOpen, setFormData, typeIRI, typeName]);
  const subSchema = useMemo(
    () =>
      bringDefinitionToTop(rootSchema as JSONSchema7, typeName) as JsonSchema,
    [rootSchema, typeName],
  );
  const { saveMutation } = useCRUDWithQueryClient({
    entityIRI,
    typeIRI,
    schema: subSchema as JSONSchema7,
    queryOptions: { enabled: false },
  });

  const { enqueueSnackbar } = useSnackbar();
  const handleSaveAndAdd = useCallback(() => {
    const finalData = {
      ...formData,
    };
    saveMutation
      .mutateAsync(finalData)
      .then((res) => {
        enqueueSnackbar(t("successfully saved"), { variant: "success" });
        addItem(path, res)();
        setEntityIRI(createEntityIRI(typeName));
      })
      .catch((e) => {
        enqueueSnackbar(t("error while saving") + e.message, {
          variant: "error",
        });
      });
  }, [saveMutation, typeIRI, typeName, createEntityIRI, addItem, setFormData]);

  const handleAddNew = useCallback(() => {
    setModalIsOpen(false);
    //if(typeof saveMethod === 'function')  saveMethod();
    addItem(path, formData)();
    setFormData({});
  }, [setModalIsOpen, addItem, formData, setFormData, typeIRI]);

  const {
    isReifiedStatement,
    orderBy: orderByPropertyPath,
    autoFocusOnValid,
    additionalKnowledgeSources,
    elementDetailItemPath,
    elementLabelTemplate,
    elementLabelProp = "label",
    imagePath,
    labelAsHeadline,
    hideRequiredAsterisk,
  } = useMemo(() => {
    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    if (validate(uiSchemaOptionsSchema, appliedUiSchemaOptions)) {
      return appliedUiSchemaOptions;
    }
    return {};
  }, [config, uischema.options]);

  const [inlineErrors, setInlineErrors] = useState<ErrorObject[] | null>(null);
  const handleErrors = useCallback(
    (err: ErrorObject[]) => {
      setInlineErrors(err);
    },
    [setInlineErrors],
  );

  useEffect(() => {
    if (
      inlineErrors?.length === 0 &&
      addButtonRef.current &&
      autoFocusOnValid
    ) {
      addButtonRef.current.focus();
    }
  }, [inlineErrors, autoFocusOnValid]);

  const formsPath = useMemo(
    () => makeFormsPath(config?.formsPath, path),
    [config?.formsPath, path],
  );

  useEffect(() => {
    setFormData(irisToData(createEntityIRI(typeName), typeIRI));
  }, [formsPath, typeIRI, createEntityIRI, typeName, setFormData]);

  const orderedAndUniqueData = useMemo(() => {
    return orderBy(
      uniqBy(
        realData?.map((childData, index) => {
          const fieldDecl = primaryFieldExtracts[typeName];
          const id = context?.getID ? context.getID(childData) : childData?.["@id"]
          if (childData && fieldDecl) {
            let label =
              childData.label || childData.__label || id;
            const extractedInfo = applyToEachField(
              childData,
              fieldDecl,
              extractFieldIfString,
            );
            if (extractedInfo.label) {
              label = extractedInfo.label;
            }
          }
          return {
            id,
            childData,
            index,
            label,
          };
        }),
        "id",
      ),
      ["label", "asc"],
    );
  }, [realData, orderByPropertyPath, primaryFieldExtracts, typeIRI, typeName, context?.getID]);

  const handleAddItem = useCallback((path: string, data: any) => {
    let _data = data
    if(context?.mapData) {
      _data = context.mapData(data)
    }
    return addItem(path, _data);
  }, [addItem, context?.mapData]);

  const [tooltipEnabled, setTooltipEnabled] = useState(false);

  return (
    <div>
      <ArrayLayoutToolbar
        enabled={enabled}
        labelAsHeadline={labelAsHeadline}
        label={computeLabel(
          label,
          Boolean(required),
          Boolean(hideRequiredAsterisk),
        )}
        errors={errors}
        path={path}
        schema={schema as JsonSchema7 | undefined}
        addItem={handleAddItem}
        onCreate={handleCreateNew}
        createDefault={innerCreateDefaultValue}
        readonly={readonly}
        isReifiedStatement={isReifiedStatement}
        formsPath={makeFormsPath(config?.formsPath, path)}
        additionalKnowledgeSources={additionalKnowledgeSources}
        typeIRI={typeIRI}
      />
      {modalIsOpen && (
        <SemanticFormsModal
          schema={subSchema}
          entityIRI={formData["@id"]}
          formData={formData}
          typeIRI={typeIRI}
          label={label}
          open={modalIsOpen}
          askClose={handleAddNew}
          askCancel={() => setModalIsOpen(false)}
          onChange={(entityIRI) =>
            entityIRI && setFormData({ "@id": entityIRI })
          }
          onFormDataChange={(data) => setFormData(data)}
          formsPath={makeFormsPath(config?.formsPath, path)}
        />
      )}
      {isReifiedStatement && (
        <Paper elevation={1} sx={{ p: 2, marginTop: 2, marginBottom: 1 }}>
          <Grid
            display={"flex"}
            container
            direction={"row"}
            alignItems={"center"}
          >
            <Grid item flex={"1"}>
              <SemanticFormsInline
                schema={subSchema}
                entityIRI={formData["@id"]}
                typeIRI={typeIRI}
                onError={handleErrors}
                formData={formData}
                onFormDataChange={handleInlineFormDataChange}
                semanticJsonFormsProps={{
                  disableSimilarityFinder: true,
                }}
                formsPath={formsPath}
              />
            </Grid>
            <Grid item>
              <Tooltip
                title={
                  inlineErrors && (
                    <>
                      <div>{t("some error")}</div>
                      <div>
                        {inlineErrors.map((e, i) => (
                          <div key={`${e.message}${i}`}>{e.message}</div>
                        ))}
                      </div>
                    </>
                  )
                }
                onClose={() => setTooltipEnabled(false)}
                open={tooltipEnabled && inlineErrors?.length > 0}
              >
                <Box onMouseEnter={() => setTooltipEnabled(true)}>
                  <IconButton
                    disabled={inlineErrors?.length > 0}
                    onClick={handleSaveAndAdd}
                    ref={addButtonRef}
                  >
                    <Pulse pulse={inlineErrors?.length === 0}>
                      <CheckIcon style={{ fontSize: 40 }} />
                    </Pulse>
                  </IconButton>
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>
      )}
      <List dense>
        {data > 0
          ? orderedAndUniqueData.map(
              ({ id: expandID, childData, index }: any, count) => {
                const childPath = composePaths(path, `${index}`);
                return (
                  <SimpleExpandPanelRenderer
                    onRemove={removeItems(path, [index])}
                    schema={schema}
                    onChange={() => {}}
                    rootSchema={rootSchema}
                    entityIRI={expandID}
                    typeIRI={typeIRI}
                    typeName={typeName}
                    data={childData}
                    key={expandID}
                    index={index}
                    count={count}
                    path={childPath}
                    imagePath={imagePath}
                    elementDetailItemPath={elementDetailItemPath}
                    childLabelTemplate={elementLabelTemplate}
                    elementLabelProp={elementLabelProp}
                    formsPath={formsPath}
                    primaryFields={primaryFields}
                    mapData={context?.mapData}
                  />
                );
              },
            )
          : null}
      </List>
    </div>
  );
};
