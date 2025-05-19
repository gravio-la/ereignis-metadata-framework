import { KBListItemRenderer } from "@graviola/edb-advanced-components";
import {
  PrimaryField,
  PrimaryFieldDeclaration,
} from "@graviola/edb-core-types";
import {
  applyToEachField,
  extractFieldIfString,
} from "@graviola/edb-data-mapping";
import { AbstractDatastore } from "@graviola/edb-global-types";
import { Storage as KnowledgebaseIcon } from "@mui/icons-material";

import { typeIRItoTypeName } from "../../../config";
import { KnowledgeBaseDescription } from "../types";

export const KBMainDatabase: (
  dataStore: AbstractDatastore,
  primaryFields: PrimaryFieldDeclaration,
) => KnowledgeBaseDescription = (dataStore, primaryFields) => ({
  id: "kb",
  label: "Lokale Datenbank",
  description: "Datenbank der Ausstellung",
  icon: <KnowledgebaseIcon />,
  find: async (searchString, typeIRI, typeName, findOptions) => {
    const res = await dataStore.findDocuments(
      typeName,
      { search: searchString },
      findOptions?.limit,
    );
    return res.map((doc) => {
      const { label, image, description } = applyToEachField(
        doc,
        primaryFields[typeName] as PrimaryField,
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
  getEntity(id, typeIRI) {
    return dataStore.loadDocument(typeIRItoTypeName(typeIRI), id);
  },
  listItemRenderer: (entry, idx, typeIRI, selected, onSelect, onAccept) => (
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
});
