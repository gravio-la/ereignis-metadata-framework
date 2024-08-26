import { KnowledgeBaseDescription } from "../types";
import { Img } from "../../../basic";
import {
  findWithinWikidataUsingREST,
  WikidataRESTResult,
} from "@slub/edb-ui-utils";
import { filterUndefOrNull } from "@slub/edb-core-utils";
import { ClassicResultListItem } from "@slub/edb-basic-components";
import { IconButton, Stack } from "@mui/material";
import { Check } from "@mui/icons-material";
import { WikidataAllPropTable } from "@slub/edb-advanced-components";
import { wikidataTypeMap } from "@slub/exhibition-schema";

export const Wikidata: KnowledgeBaseDescription = {
  id: "wikidata",
  label: "Wikidata",
  authorityIRI: "http://www.wikidata.org",
  description: "Wikidata",
  icon: (
    <Img
      alt={"wikidata logo"}
      width={24}
      height={24}
      src={"Icons/wikidata-logo-opaque.png"}
    />
  ),
  find: async (searchString, typeIRI, typeName, findOptions) => {
    const wikidataClass = wikidataTypeMap[typeName];
    if (!wikidataClass) {
      console.warn(`no wikidata class for ${typeName}`);
      return [];
    }
    return filterUndefOrNull(
      await findWithinWikidataUsingREST(
        searchString,
        wikidataClass,
        findOptions?.limit,
      ),
    );
  },
  listItemRenderer: (entry, idx, typeIRI, selected, onSelect, onAccept) => {
    const data = entry as WikidataRESTResult["pages"][0];
    const wikidataEntityIRI = `http://www.wikidata.org/entity/${data.key}`;
    return (
      <ClassicResultListItem
        key={data.key}
        id={wikidataEntityIRI}
        index={idx}
        onSelected={(id, index) => onSelect(id, index)}
        label={data.title}
        secondary={data.description}
        avatar={data.thumbnail?.url}
        altAvatar={String(idx + 1)}
        selected={selected}
        onEnter={() => onAccept(String(data.id), data)}
        listItemProps={{
          secondaryAction: (
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => onAccept(wikidataEntityIRI, data)}>
                <Check />
              </IconButton>
            </Stack>
          ),
        }}
        popperChildren={<WikidataAllPropTable thingIRI={wikidataEntityIRI} />}
      />
    );
  },
};
