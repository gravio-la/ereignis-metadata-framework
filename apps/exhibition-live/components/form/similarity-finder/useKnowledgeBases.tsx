import {
  useAdbContext,
  useDataStore,
  useGlobalCRUDOptions,
} from "@slub/edb-state-hooks";
import { FindOptions, KnowledgeBaseDescription } from "./types";
import * as React from "react";
import { useMemo } from "react";
import { Check, Storage as KnowledgebaseIcon } from "@mui/icons-material";
import { applyToEachField, extractFieldIfString } from "@slub/edb-data-mapping";
import { PrimaryField } from "@slub/edb-core-types";
import { KBListItemRenderer } from "./KBListItemRenderer";
import { Img } from "../../basic";
import { lobidTypemap, wikidataTypeMap } from "@slub/exhibition-schema";
import { filterUndefOrNull } from "@slub/edb-core-utils";
import {
  findWithinWikidataUsingREST,
  WikidataRESTResult,
} from "@slub/edb-ui-utils";
import { ClassicResultListItem } from "@slub/edb-basic-components";
import { IconButton, Stack } from "@mui/material";
import { WikidataAllPropTable } from "@slub/edb-advanced-components";
import { findEntityWithinLobid } from "@slub/edb-authorities";
import { gndEntryFromSuggestion } from "../lobid/LobidSearchTable";
import { GNDListItemRenderer } from "./GNDListItemRenderer";
import { findEntityWithinK10Plus } from "@slub/edb-kxp-utils";
import { dcterms } from "@tpluscode/rdf-ns-builders";
import { findFirstInProps, RootNode } from "@slub/edb-graph-traversal";
import { fabio } from "@slub/edb-marc-to-rdf";

export const useKnowledgeBases = () => {
  const { schema, typeNameToTypeIRI, queryBuildOptions, jsonLDConfig } =
    useAdbContext();
  const { crudOptions } = useGlobalCRUDOptions();
  const { dataStore, ready } = useDataStore({
    schema,
    crudOptionsPartial: crudOptions,
    typeNameToTypeIRI,
    queryBuildOptions,
  });
  const kbs: KnowledgeBaseDescription[] = useMemo(
    () => [
      {
        id: "kb",
        label: "Lokale Datenbank",
        description: "Datenbank der Ausstellung",
        icon: <KnowledgebaseIcon />,
        find: async (
          searchString: string,
          typeIRI,
          typeName,
          findOptions?: FindOptions,
        ) => {
          const res = await dataStore.findDocuments(
            typeName,
            { search: searchString },
            findOptions?.limit,
          );
          return res.map((doc) => {
            const { label, image, description } = applyToEachField(
              doc,
              queryBuildOptions.primaryFields[typeName] as PrimaryField,
              extractFieldIfString,
            );
            return {
              label,
              id: doc["@id"],
              avatar: image,
              secondary: description,
            };
          });
        },
        listItemRenderer: (
          entry: any,
          idx: number,
          typeIRI: string,
          selected,
          onSelect,
          onAccept,
        ) => (
          <KBListItemRenderer
            data={entry}
            key={entry.id}
            idx={idx}
            typeIRI={typeIRI}
            selected={selected}
            onSelect={onSelect}
            onAccept={onAccept}
          />
        ),
      },
      {
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
        find: async (
          searchString: string,
          typeIRI,
          typeName,
          findOptions?: FindOptions,
        ) => {
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
        listItemRenderer: (
          entry: any,
          idx: number,
          typeIRI: string,
          selected,
          onSelect,
          onAccept,
        ) => {
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
                    <IconButton
                      onClick={() => onAccept(wikidataEntityIRI, data)}
                    >
                      <Check />
                    </IconButton>
                  </Stack>
                ),
              }}
              popperChildren={
                <WikidataAllPropTable thingIRI={wikidataEntityIRI} />
              }
            />
          );
        },
      },
      {
        id: "gnd",
        authorityIRI: "http://d-nb.info/gnd",
        label: "GND",
        description: "Gemeinsame Normdatei",
        icon: (
          <Img
            alt={"gnd logo"}
            width={24}
            height={24}
            src={"Icons/gnd-logo.png"}
          />
        ),
        find: async (
          searchString: string,
          typeIRI,
          typeName,
          findOptions?: FindOptions,
        ) => {
          return filterUndefOrNull(
            await findEntityWithinLobid(
              searchString,
              typeName,
              lobidTypemap,
              findOptions?.limit || 10,
              "json:suggest",
            ),
          )?.map((allProps: any) => gndEntryFromSuggestion(allProps));
        },
        listItemRenderer: (
          data: any,
          idx: number,
          typeIRI: string,
          selected,
          onSelect,
          onAccept,
        ) => (
          <GNDListItemRenderer
            data={data}
            key={`${data.id}${idx}`}
            idx={idx}
            typeIRI={typeIRI}
            selected={selected}
            onSelect={onSelect}
            onAccept={onAccept}
          />
        ),
      },
      {
        id: "k10plus",
        label: "K10plus",
        description: "K10plus",
        icon: (
          <Img
            alt={"gnd logo"}
            width={24}
            height={24}
            src={"Icons/k10plus-logo.png"}
          />
        ),
        find: async (
          searchString: string,
          typeIRI,
          typeName,
          findOptions?: FindOptions,
        ) => {
          const test = await findEntityWithinK10Plus(
            searchString,
            typeName,
            "http://sru.k10plus.de/gvk",
            findOptions?.limit || 10,
            "marcxml",
          );
          return test || [];
        },
        listItemRenderer: (
          entry: any,
          idx: number,
          typeIRI: string,
          selected,
          onSelect,
          onAccept,
        ) => {
          const data = entry as RootNode;
          return (
            <ClassicResultListItem
              key={data.id}
              id={String(data.id)}
              index={idx}
              onSelected={(id, index) => onSelect(id, index)}
              label={
                data.properties[dcterms.title.value]?.[0]?.value ||
                String(data.id)
              }
              secondary={findFirstInProps(
                data.properties,
                fabio.hasSubtitle,
                dcterms.description,
                dcterms.abstract,
              )}
              altAvatar={String(idx + 1)}
            />
          );
        },
      },
    ],
    [queryBuildOptions, jsonLDConfig, dataStore, ready],
  );
  return kbs;
};
