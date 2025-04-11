import { PrimaryField } from "@graviola/edb-core-types";

export type FlatResult = {
  [key: string]: {
    value: string;
    type: string;
    datatype?: string;
  };
};

export const extractPrimaryFieldsFromFlatResult = (
  flatResult: FlatResult,
  primaryFields: PrimaryField,
): PrimaryField & { entityIRI: string; typeIRI: string } => {
  const result: PrimaryField & { entityIRI: string; typeIRI: string } = {
    label: "",
    description: "",
    entityIRI: flatResult.entity.value,
    typeIRI: flatResult.type_single.value,
  };

  // Extract label
  if (primaryFields.label) {
    const labelKey = `${primaryFields.label}_single`;
    if (flatResult[labelKey]?.value) {
      result.label = flatResult[labelKey].value;
    }
  }

  // Extract description
  if (primaryFields.description) {
    const descriptionKey = `${primaryFields.description}_single`;
    if (flatResult[descriptionKey]?.value) {
      result.description = flatResult[descriptionKey].value;
    }
  }

  // Extract image if present in primaryFields
  if (primaryFields.image) {
    const imageKey = `${primaryFields.image}_single`;
    if (flatResult[imageKey]?.value) {
      result.image = flatResult[imageKey].value;
    }
  }

  return result;
};
