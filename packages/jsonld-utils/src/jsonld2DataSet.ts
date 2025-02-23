import datasetFactory from "@rdfjs/dataset";
import { DatasetCore, Quad } from "@rdfjs/types";
import jsonld from "jsonld";

export const jsonld2DataSet: (
  jsonld: any,
) => Promise<DatasetCore<Quad>> = async (input: any) => {
  let ds = datasetFactory.dataset();
  try {
    const quads = (await jsonld.toRDF(input)) as Quad[];
    ds = datasetFactory.dataset(quads);
  } catch (e) {
    throw new Error("unable to parse the data", { cause: e });
  }
  return ds;
};
