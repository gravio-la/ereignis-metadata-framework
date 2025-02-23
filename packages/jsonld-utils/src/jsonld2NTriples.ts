import { dataset2NTriples } from "./dataset2NTriples";
import { jsonld2DataSet } from "./jsonld2DataSet";

export const jsonld2NTriples = async (jsonld: any) => {
  return await dataset2NTriples(await jsonld2DataSet(jsonld));
};
