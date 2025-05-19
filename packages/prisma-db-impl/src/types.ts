import type { IRIToStringFn, StringToIRIFn } from "@graviola/edb-core-types";

export type PropertiesAndConnects = {
  id?: string;
  properties: Record<string, any>;
  connects: Record<string, { id: string } | { id: string }[]>;
};
export type CountValue = Record<string, number>;

export type BindingValue = string | number | boolean;

export type PrismaStoreOptions = {
  jsonldContext: any;
  defaultPrefix: string;
  typeNameToTypeIRI: StringToIRIFn;
  typeIRItoTypeName: IRIToStringFn;
  idToIRI?: StringToIRIFn;
  IRItoId?: IRIToStringFn;
  typeIsNotIRI?: boolean;
  allowUnknownNestedElementCreation?: boolean;
  isAllowedNestedElement?: (element: any) => boolean;
  debug?: boolean;
};
