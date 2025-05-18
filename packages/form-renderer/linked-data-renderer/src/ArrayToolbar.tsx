import NiceModal from "@ebay/nice-modal-react";
import { DiscoverAutocompleteInput } from "@graviola/edb-advanced-components";
import { SearchbarWithFloatingButton } from "@graviola/edb-basic-components";
import { AutocompleteSuggestion } from "@graviola/edb-core-types";
import {
  PrimaryField,
  PrimaryFieldDeclaration,
} from "@graviola/edb-core-types";
import {
  useAdbContext,
  useGlobalSearchWithHelper,
  useKeyEventForSimilarityFinder,
  useModalRegistry,
  useRightDrawerState,
} from "@graviola/edb-state-hooks";
import { KnowledgeSources } from "@graviola/semantic-jsonform-types";
import { JsonSchema7 } from "@jsonforms/core";
import { Box, FormControl, TextField, Typography } from "@mui/material";
import { JSONSchema7 } from "json-schema";
import { useTranslation } from "next-i18next";
import * as React from "react";
import { useCallback, useMemo } from "react";

export interface ArrayLayoutToolbarProps {
  label: string;
  errors: string;
  path: string;

  enabled?: boolean;

  labelAsHeadline?: boolean;

  addItem(path: string, data: any): () => void;

  createDefault(): any;

  typeIRI?: string;
  onCreate?: () => void;
  isReifiedStatement?: boolean;
  additionalKnowledgeSources?: string[];
}

const getDefaultLabelKey = (
  typeName: string,
  primaryFields: PrimaryFieldDeclaration,
) => {
  const fieldDefinitions = primaryFields[typeName] as PrimaryField | undefined;
  return fieldDefinitions?.label;
};
export const ArrayLayoutToolbar = ({
  label,
  labelAsHeadline,
  errors,
  addItem,
  enabled,
  path,
  schema,
  onCreate,
  isReifiedStatement,
  formsPath,
  additionalKnowledgeSources,
  typeIRI: _typeIRI,
  dropdown,
}: ArrayLayoutToolbarProps & {
  schema?: JsonSchema7;
  formsPath?: string;
  dropdown?: boolean;
}) => {
  const {
    createEntityIRI,
    queryBuildOptions: { primaryFields },
    typeIRIToTypeName,
    components: { SimilarityFinder, EditEntityModal },
  } = useAdbContext();
  const typeIRI = useMemo(
    () => _typeIRI ?? schema?.properties?.["@type"]?.const,
    [schema, _typeIRI],
  );
  const typeName = useMemo(
    () => typeIRIToTypeName(typeIRI),
    [typeIRI, typeIRIToTypeName],
  );
  const handleSelectedChange = React.useCallback(
    (v: AutocompleteSuggestion) => {
      if (!v || !v.value) return;
      addItem(path, {
        "@id": v.value,
        "@type": typeIRI,
        __label: v.label,
      })();
    },
    [addItem, path],
  );

  const handleExistingEntityAccepted = useCallback(
    (iri: string, data: any) => {
      addItem(path, data)();
      handleSelectedChange({ value: undefined, label: "" });
      inputRef.current?.focus();
    },
    [addItem, path, handleSelectedChange],
  );

  const handleMappedDataAccepted = useCallback(
    (newData: any) => {
      addItem(path, newData)();
      inputRef.current?.focus();
    },
    [addItem, path],
  );

  const { open: sidebarOpen } = useRightDrawerState();

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const {
    path: globalPath,
    searchString,
    handleSearchStringChange,
    handleMappedData,
    handleFocus,
    isActive,
  } = useGlobalSearchWithHelper(
    typeName,
    typeIRI,
    schema as JSONSchema7,
    formsPath,
    handleMappedDataAccepted,
  );

  const handleKeyUp = useKeyEventForSimilarityFinder();
  const { keepMounted } = useRightDrawerState();

  const [disabled, setDisabled] = React.useState(false);
  const { registerModal } = useModalRegistry(NiceModal);
  const showEditDialog = useCallback(() => {
    const fieldDefinitions = primaryFields[typeName] as
      | PrimaryField
      | undefined;
    const defaultLabelKey = fieldDefinitions?.label || "title";
    const entityIRI = createEntityIRI(typeName);
    const modalID = `edit-${typeIRI}-${entityIRI}`;
    registerModal(modalID, EditEntityModal);
    setDisabled(true);
    NiceModal.show(modalID, {
      entityIRI,
      typeIRI,
      data: {
        "@id": entityIRI,
        "@type": typeIRI,
        [defaultLabelKey]: searchString,
      },
      disableLoad: true,
    })
      .then(
        ({ entityIRI, data }: { entityIRI: string; data: any }) => {
          addItem(path, {
            ...data,
            "@id": entityIRI,
            "@type": typeIRI,
          })();
        },
        () => {},
      )
      .finally(() => {
        setDisabled(false);
      });
  }, [
    registerModal,
    typeIRI,
    typeName,
    createEntityIRI,
    EditEntityModal,
    primaryFields,
    searchString,
    setDisabled,
  ]);
  return (
    <Box>
      {(isReifiedStatement || labelAsHeadline) && (
        <Box>
          <Typography variant={"h4"}>{label}</Typography>
        </Box>
      )}
      <Box>
        {!dropdown && (keepMounted || sidebarOpen) && !isReifiedStatement ? (
          <TextField
            fullWidth
            disabled={!enabled}
            label={labelAsHeadline ? typeName : label}
            onChange={(ev) => handleSearchStringChange(ev.target.value)}
            value={searchString || ""}
            sx={(theme) => ({
              marginTop: theme.spacing(1),
              marginBottom: theme.spacing(1),
            })}
            inputProps={{
              ref: inputRef,
              onFocus: handleFocus,
              onKeyUp: handleKeyUp,
            }}
          />
        ) : (
          !isReifiedStatement && (
            <FormControl
              fullWidth
              sx={{
                marginTop: (theme) => theme.spacing(2),
                marginBottom: (theme) => theme.spacing(1),
              }}
            >
              <DiscoverAutocompleteInput
                onCreateNew={showEditDialog}
                loadOnStart={true}
                readonly={!enabled}
                typeIRI={typeIRI}
                typeName={typeName || ""}
                title={label || ""}
                disabled={disabled}
                onSelectionChange={handleSelectedChange}
                onSearchValueChange={handleSearchStringChange}
                searchString={searchString || ""}
                inputProps={{
                  onFocus: handleFocus,
                }}
              />
            </FormControl>
          )
        )}
        {globalPath === formsPath && !dropdown && (
          <SearchbarWithFloatingButton>
            <SimilarityFinder
              finderId={`${formsPath}_${path}`}
              search={searchString}
              data={{}}
              classIRI={typeIRI}
              jsonSchema={schema as JSONSchema7}
              onExistingEntityAccepted={handleExistingEntityAccepted}
              onMappedDataAccepted={handleMappedData}
              additionalKnowledgeSources={
                additionalKnowledgeSources as KnowledgeSources[]
              }
            />
          </SearchbarWithFloatingButton>
        )}
      </Box>
    </Box>
  );
};
