import { Datafield } from "./marcResponseTypes";

export type MarcExchangeJson = Record<
  string,
  | string
  | (string | Record<string, string | (string | Record<string, string>)[]>)[]
>;

/**
 * Convert a MARC exchange JSON object to a list of datafields
 * THis function should not be used in production as it has been created to obtain fixtures for testing
 *
 * @param json - The MARC exchange JSON object
 * @returns A list of datafields
 */
export const marcExchangeJson2Datafields: (
  json: MarcExchangeJson,
) => Datafield[] = (json) => {
  const datafields: any[] = [];

  Object.entries(json).forEach(([tag, value]) => {
    // Skip non-datafield entries (those starting with _)
    if (tag.startsWith("_")) return;

    // Handle control fields (001-009)
    if (/^00[1-9]$/.test(tag)) {
      // Control fields are handled differently, but we'll skip them
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((field) => {
        if (typeof field === "string") {
          return;
        }
        Object.entries(field).forEach(([indicators, subfields]) => {
          // Parse indicators (e.g., "1_" -> ind1="1", ind2="_")
          const ind1 = indicators.charAt(0) || " ";
          const ind2 = indicators.charAt(1) || " ";

          // Create datafield object
          const datafield: Datafield = {
            "@_tag": tag,
            "@_ind1": ind1,
            "@_ind2": ind2,
            subfield: [],
          };

          if (Array.isArray(subfields)) {
            subfields.forEach((subfield) => {
              Object.entries(subfield).forEach(([code, text]) => {
                if (!Array.isArray(datafield.subfield)) {
                  datafield.subfield = [];
                }
                datafield.subfield.push({
                  "@_code": code,
                  "#text": text,
                });
              });
            });
          }

          datafields.push(datafield);
        });
      });
    }
  });

  return datafields;
};
