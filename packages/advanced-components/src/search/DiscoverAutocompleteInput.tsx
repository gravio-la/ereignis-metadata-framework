import { AutocompleteSuggestion, PrimaryField } from "@graviola/edb-core-types";
import { useAdbContext, useDataStore, useGlobalCRUDOptions } from "@graviola/edb-state-hooks";
import { useQuery } from "@graviola/edb-state-hooks";
import { TextFieldProps, useControlled } from "@mui/material";
import parse from "html-react-parser";
import React, { FunctionComponent, useCallback } from "react";

import { DebouncedAutocomplete } from "../form";
import { applyToEachField, extractFieldIfString } from "@graviola/edb-data-mapping";

interface OwnProps {
  selected?: AutocompleteSuggestion | null;
  onSelectionChange?: (selection: AutocompleteSuggestion | null) => void;
  typeIRI?: string;
  title?: string;
  typeName?: string;
  readonly?: boolean;
  defaultSelected?: AutocompleteSuggestion | null;
  loadOnStart?: boolean;
  limit?: number;
  onDebouncedSearchChange?: (value: string | undefined) => void;
  condensed?: boolean;
  onEnterSearch?: (value: string | undefined) => void;
  inputProps?: TextFieldProps;
  onSearchValueChange?: (value: string | undefined) => void;
  searchString?: string;
  autocompleteDisabled?: boolean;
  disabled?: boolean;
}

export type DiscoverAutocompleteInputProps = OwnProps;

export const DiscoverAutocompleteInput: FunctionComponent<
  DiscoverAutocompleteInputProps
> = ({
  title = "",
  typeName,
  readonly,
  defaultSelected,
  selected,
  onEnterSearch,
  onSelectionChange,
  typeIRI,
  loadOnStart,
  limit,
  onDebouncedSearchChange,
  condensed,
  inputProps,
  onSearchValueChange,
  searchString: searchStringProp,
  autocompleteDisabled,
  disabled,
}) => {
    const {
      queryBuildOptions: { primaryFields, typeIRItoTypeName },
    } = useAdbContext();
    const { crudOptions } = useGlobalCRUDOptions();
    const { dataStore } = useDataStore();
    const [selectedValue, setSelectedUncontrolled] =
      useControlled<AutocompleteSuggestion | null>({
        name: "DiscoverAutocompleteInput-selected",
        controlled: selected,
        default: defaultSelected || null,
      });

    const [searchString, setSearchString] = useControlled<string | undefined>({
      name: "DiscoverAutocompleteInput-searchString",
      controlled: searchStringProp,
      default: "",
    });
    const handleChange = useCallback(
      (e: React.SyntheticEvent, item: AutocompleteSuggestion | null) => {
        e.stopPropagation();
        e.preventDefault();
        onSelectionChange?.(item);
        setSelectedUncontrolled(item);
        onSearchValueChange?.(null);
        setSearchString(null);
      },
      [
        onSelectionChange,
        setSelectedUncontrolled,
        onSearchValueChange,
        setSearchString,
      ],
    );

    const load = useCallback(
      async (searchString?: string) =>
        typeIRI
          ? (await dataStore.findDocumentsByLabel(searchString || null, typeIRI, limit))
            .map(({ label = "", entityIRI }) => {
              return {
                label,
                value: entityIRI,
              };
            })
          : [],
      [typeIRI, limit, dataStore],
    );

    const { data: basicFields } = useQuery({
      queryKey: ["loadEntity", selected?.value, typeName],
      queryFn: async () => {
        const value = selected?.value;
        if (value && typeIRI) {
          const typeName = typeIRItoTypeName(typeIRI);
          const data = await dataStore.loadDocument(typeName, value);
          const fieldDeclaration = primaryFields[typeName] as PrimaryField | undefined;
          return applyToEachField(data, fieldDeclaration, extractFieldIfString);
        }
        return null;
      },
      enabled: Boolean(
        crudOptions?.selectFetch &&
        typeof selected?.value === "string" &&
        (!selected?.label || selected?.label?.length === 0),
      ),
    });

    const handleEnter = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && searchString?.length > 0) {
          onEnterSearch?.(searchString);
        }
      },
      [onEnterSearch, searchString],
    );

    const handleSearchValueChange = useCallback(
      (value: string | undefined) => {
        onSearchValueChange?.(value);
        setSearchString(value);
      },
      [onSearchValueChange, setSearchString],
    );

    const handleGetOptionLabel = useCallback(
      (option: AutocompleteSuggestion) => {
        return option.label || basicFields?.label || option.value || "";
      },
      [basicFields],
    );

    return (
      <DebouncedAutocomplete
        disabled={disabled}
        title={title}
        readOnly={readonly}
        loadOnStart={true}
        ready={Boolean(typeIRI && crudOptions)}
        // @ts-ignore
        load={load}
        initialQueryKey={typeIRI}
        value={selectedValue || { label: searchString, value: null }}
        getOptionLabel={handleGetOptionLabel}
        placeholder={`Suche nach ${typeName} in der aktuellen Datenbank`}
        renderOption={(props, option: any) => (
          <li {...props} key={option.value}>
            {parse(
              `<span class="debounced_autocomplete_option_label">${option.label}</span>`,
            )}
          </li>
        )}
        // @ts-ignore
        onChange={handleChange}
        onDebouncedSearchChange={onDebouncedSearchChange}
        condensed={condensed}
        onKeyUp={handleEnter}
        onSearchValueChange={handleSearchValueChange}
        inputProps={inputProps}
        autocompleteDisabled={autocompleteDisabled}
      />
    );
  };
