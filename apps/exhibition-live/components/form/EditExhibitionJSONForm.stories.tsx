import { QueryClient, QueryClientProvider } from "@graviola/edb-state-hooks";
import { useExtendedSchema } from "@graviola/edb-state-hooks";
import { SemanticJsonForm } from "@graviola/semantic-json-form";
import { JSONSchema7 } from "json-schema";
import { useMemo, useState } from "react";

import {
  defaultJsonldContext,
  defaultPrefix,
  sladb,
  slent,
} from "../config/formConfigs";
import { uischemata } from "../config/uischemata";

const queryClient = new QueryClient();

const classIRI = sladb.Exhibition.value;
const exampleData = {
  "@id": slent["4d7bfa16-83fe-3997-b710-68942aab7abb"].value,
  "@type": classIRI,
  title: "Otto Dix Ausstellung",
};

const SemanticJsonFormOneShot = () => {
  const [data, setData] = useState<any>(exampleData);
  const typeName = "Exhibition";
  const loadedSchema = useExtendedSchema({ typeName });
  const uischema = useMemo(() => uischemata?.[typeName], [typeName]);

  return (
    <SemanticJsonForm
      data={data}
      onChange={setData}
      entityIRI={data["@id"]}
      typeIRI={classIRI}
      defaultPrefix={defaultPrefix}
      searchText={""}
      shouldLoadInitially
      jsonldContext={defaultJsonldContext}
      schema={loadedSchema as JSONSchema7}
      jsonFormsProps={{
        uischema,
      }}
    />
  );
};
export const SemanticJsonFormExhibition = () => {
  const [data, setData] = useState<any>(exampleData);
  /*
  button("generate random entry", () => {
    // @ts-ignore
    setData(JSONSchemaFaker.generate(exhibitionSchema));
  });
*/
  return (
    <QueryClientProvider client={queryClient}>
      <SemanticJsonFormOneShot />
    </QueryClientProvider>
  );
};
export default {
  title: "ui/form/EditExhibitionJSONForm",
  component: SemanticJsonFormExhibition,
};
