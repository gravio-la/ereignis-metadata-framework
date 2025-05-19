import { IRIToStringFn } from "@graviola/edb-core-types";
import { JsonFormsRendererRegistryEntry } from "@jsonforms/core";
import { primaryFields } from "@slub/exhibition-schema";

import {
  primaryTextFieldControlTester,
  PrimaryTextFieldRenderer,
} from "../renderer";

export const primaryFieldsRegistry: (
  typeIRI: string,
  typeIRItoTypeName: IRIToStringFn,
) => JsonFormsRendererRegistryEntry[] = (typeIRI, typeIRIToTypeName) =>
  primaryFields[typeIRIToTypeName(typeIRI)]?.label
    ? [
        {
          tester: primaryTextFieldControlTester(typeIRIToTypeName(typeIRI)),
          renderer: PrimaryTextFieldRenderer,
        },
      ]
    : [];
