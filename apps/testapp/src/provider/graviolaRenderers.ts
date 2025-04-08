import { InlineCondensedSemanticFormsRenderer, InlineDropdownRenderer, materialArrayChipsLayoutTester, MaterialArrayOfLinkedItemChipsRenderer, MaterialArrayOfLinkedItemRenderer, materialLinkedObjectControlTester, MaterialLinkedObjectRenderer } from '@graviola/edb-linked-data-renderer';
import { and, isObjectArray, JsonFormsRendererRegistryEntry, rankWith, schemaMatches } from '@jsonforms/core';
import { inlineSemanticFormsRendererTester } from './inlineSemanticFormsRendererTester';
import { inlineDropdownRendererTester } from './inlineDropdownRendererTester';
import { JSONSchema7 } from 'json-schema';

export const materialArrayOfLinkedItemRendererTester = rankWith(
  5,
  and(
    isObjectArray,
    schemaMatches((schema) => {
      console.log(schema)
      if (
        !(
          schema.type === "array" &&
          typeof schema.items === "object" &&
          (schema.items as JSONSchema7).properties
        )
      ) {
        return Boolean((schema.items as JSONSchema7).$ref);
      }
      const props = (schema.items as JSONSchema7).properties;
      return Boolean(props?.["@id"] && props?.["@type"]);
    }),
  ),
)

export const graviolaRenderers: JsonFormsRendererRegistryEntry[] = [
  {
    tester: materialArrayOfLinkedItemRendererTester,
    renderer: MaterialArrayOfLinkedItemRenderer,
  },
  {
    tester: materialArrayChipsLayoutTester,
    renderer: MaterialArrayOfLinkedItemChipsRenderer,
  },
  {
    tester: inlineSemanticFormsRendererTester,
    renderer: InlineCondensedSemanticFormsRenderer,
  },
  {
    tester: inlineDropdownRendererTester,
    renderer: InlineDropdownRenderer,
  },
  {
    tester: materialLinkedObjectControlTester,
    renderer: MaterialLinkedObjectRenderer,
  },
  {
    tester: materialArrayOfLinkedItemRendererTester,
    renderer: MaterialArrayOfLinkedItemRenderer,
  },
  {
    tester: inlineSemanticFormsRendererTester,
    renderer: InlineCondensedSemanticFormsRenderer,
  },
  {
    tester: materialArrayChipsLayoutTester,
    renderer: MaterialArrayOfLinkedItemChipsRenderer,
  },
]