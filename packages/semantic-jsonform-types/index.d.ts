import type { JsonLdContext } from "jsonld-context-parser";
import type { JSONSchema7 } from "json-schema";
import type { ErrorObject } from "ajv";
import type { JsonFormsInitStateProps } from "@jsonforms/react";
import type { ReactNode } from "react";
import type {
  IRIToStringFn,
  NormDataMapping,
  SparqlBuildOptions,
  StringToIRIFn,
} from "@graviola/edb-core-types";
import type { JSONLDConfig } from "@graviola/edb-global-types";
import type {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonFormsUISchemaRegistryEntry,
} from "@jsonforms/core";

export type ChangeCause = "user" | "mapping" | "reload";

export type SemanticJsonFormProps = {
  entityIRI?: string | undefined;
  data: any;
  onChange: (data: any) => void;
  shouldLoadInitially?: boolean;
  typeIRI: string;
  schema: JSONSchema7;
  jsonldContext: JsonLdContext;
  debugEnabled?: boolean;
  jsonFormsProps?: Partial<JsonFormsInitStateProps>;
  onEntityChange?: (entityIRI: string | undefined) => void;
  onEntityDataChange?: (entityData: any) => void;
  defaultPrefix: string;
  hideToolbar?: boolean;
  forceEditMode?: boolean;
  defaultEditMode?: boolean;
  searchText?: string;
  toolbarChildren?: ReactNode;
  disableSimilarityFinder?: boolean;
  enableSidebar?: boolean;
  wrapWithinCard?: boolean;
};

export type SemanticJsonFormNoOpsProps = {
  typeIRI: string;
  data: any;
  onChange?: (data: any, reason: ChangeCause) => void;
  onError?: (errors: ErrorObject[]) => void;
  schema: JSONSchema7;
  jsonFormsProps?: Partial<JsonFormsInitStateProps>;
  onEntityChange?: (entityIRI: string | undefined) => void;
  onEntityDataChange?: (entityData: any) => void;
  toolbar?: ReactNode;
  forceEditMode?: boolean;
  defaultEditMode?: boolean;
  searchText?: string;
  disableSimilarityFinder?: boolean;
  enableSidebar?: boolean;
  wrapWithinCard?: boolean;
  formsPath?: string;
};

export type KnowledgeSources = "kb" | "gnd" | "wikidata" | "k10plus" | "ai";

export type SimilarityFinderProps<
  FindResultType = any,
  FullEntityType = any,
  SourceType extends string = string,
> = {
  finderId: string;
  data: any;
  classIRI: string;
  jsonSchema: JSONSchema7;
  onEntityIRIChange?: (entityIRI: string | undefined) => void;
  onMappedDataAccepted?: (data: any) => void;
  onExistingEntityAccepted?: (entityIRI: string, data: any) => void;
  onSelectedEntityChange?: (id: string, authorityIRI: string) => void;
  searchOnDataPath?: string;
  search?: string;
  hideFooter?: boolean;
  knowledgeSources?: SourceType[];
  additionalKnowledgeSources?: SourceType[];
};

export type GlobalSemanticConfig = {
  typeNameToTypeIRI: StringToIRIFn;
  typeIRIToTypeName: IRIToStringFn;
  createEntityIRI: (typeName: string, id?: string) => string;
  propertyNameToIRI: StringToIRIFn;
  propertyIRIToPropertyName: IRIToStringFn;
  jsonLDConfig: JSONLDConfig;
  queryBuildOptions: SparqlBuildOptions;
};

export type GlobalAppConfig<DeclarativeMappingType> = GlobalSemanticConfig & {
  normDataMapping: {
    [authorityIRI: string]: NormDataMapping<DeclarativeMappingType>;
  };
  schema: JSONSchema7;
  makeStubSchema?: (schema: JSONSchema7) => JSONSchema7;
  uiSchemaDefaultRegistry?: JsonFormsUISchemaRegistryEntry[];
  rendererRegistry?: JsonFormsRendererRegistryEntry[];
  primaryFieldRendererRegistry?: (
    typeIRI: string,
  ) => JsonFormsRendererRegistryEntry[];
  cellRendererRegistry?: JsonFormsCellRendererRegistryEntry[];
  uischemata?: Record<string, any>;
};

export type EditEntityModalProps = {
  typeIRI: string | undefined;
  entityIRI: string;
  data: any;
  disableLoad?: boolean;
};

export type EntityDetailModalProps = EditEntityModalProps & {
  readonly?: boolean;
  disableInlineEditing?: boolean;
};

type Url = URL | string;

type ParsedUrlQuery = Record<string, string | string[] | undefined>;

export type ModRouter = {
  query: ParsedUrlQuery;
  asPath: string;
  replace: (url: Url, as?: Url) => Promise<void | boolean>;
  push: (url: Url, as?: Url) => Promise<void | boolean>;
  pathname: string;
  searchParams: URLSearchParams;
  setSearchParams?: (searchParams: URLSearchParams) => void;
};

export type SelectedEntity<SourceType extends string = string> = {
  id: string;
  source: SourceType;
};
export type FindOptions = {
  limit?: number;
  page?: number;
  offset?: number;
  pageSize?: number;
};

export type ListItemRendererProps<
  FindResultType = any,
  FullEntityType = any,
> = {
  data: FullEntityType;
  idx: number;
  typeIRI: string;
  selected: boolean;
  onSelect?: (id: string, index: number) => void;
  onAccept?: (id: string, data: FullEntityType) => void;
};

export type FinderKnowledgeBaseDescription<
  FindResultType = any,
  FullEntityType = any,
  SourceType extends string = string,
> = {
  id: SourceType;
  authorityIRI?: string;
  label: string;
  description: string;
  icon: string | React.ReactNode;
  find: (
    searchString: string,
    typeIRI: string,
    typeName: string,
    findOptions?: FindOptions,
  ) => Promise<FindResultType[]>;
  getEntity?: (id: string, typeIRI?: string) => Promise<FullEntityType>;
  detailRenderer?: (id: string) => React.ReactNode;
  listItemRenderer?: (
    entry: FindResultType,
    idx: number,
    typeIRI: string,
    selected: boolean,
    onSelect?: (id: string, index: number) => void,
    onAccept?: (id: string, entry: FindResultType) => void,
  ) => React.ReactNode;
};
