import {
  DeclarativeMapping,
  DeclarativeMappings,
} from "@slub/edb-data-mapping";
import { sladb } from "./lobidMappings";

export const wikidataLocationMapping: DeclarativeMappings = [
  {
    source: {
      path: "$.labels.de.value",
    },
    target: {
      path: "title",
    },
    mapping: {
      strategy: {
        id: "takeFirst",
      },
    },
  },
  {
    source: {
      path: "$.descriptions.de.value",
    },
    target: {
      path: "description",
    },
    mapping: {
      strategy: {
        id: "takeFirst",
      },
    },
  },
  {
    source: {
      path: "$.claims.P18[*].mainsnak.datavalue.value",
    },
    target: {
      path: "image",
    },
    mapping: {
      strategy: {
        id: "withDotTemplate",
        options: {
          single: true,
          template:
            "http://commons.wikimedia.org/wiki/Special:FilePath/{{value}}",
        },
      },
    },
  },
  {
    source: {
      path: "$.claims.P131[*].mainsnak.datavalue.value.id",
    },
    target: {
      path: "parent",
    },
    mapping: {
      strategy: {
        id: "createEntityWithAuthoritativeLink",
        options: {
          single: true,
          typeIRI: sladb("Location").value,
          typeName: "Location",
          mainProperty: {
            offset: 0,
          },
          authorityFields: [
            {
              offset: 0,
              authorityLinkPrefix: "http://www.wikidata.org/entity/",
              authorityIRI: "http://www.wikidata.org",
            },
          ],
        },
      },
    },
  },
  {
    source: {
      path: "$.claims.P1448[*].mainsnak.datavalue.value.text",
    },
    target: {
      path: "titleVariants",
    },
    mapping: {
      strategy: {
        id: "concatenate",
        options: {
          separator: ", ",
        },
      },
    },
  },
];

export const wikidataExhibitionSeriesMapping: DeclarativeMappings = [
  {
    source: {
      path: "$.labels.de.value",
    },
    target: {
      path: "title",
    },
    mapping: {
      strategy: {
        id: "takeFirst",
      },
    },
  },
  {
    source: {
      path: "$.descriptions.de.value",
    },
    target: {
      path: "description",
    },
    mapping: {
      strategy: {
        id: "takeFirst",
      },
    },
  },
  {
    source: {
      path: "$.claims.P18[*].mainsnak.datavalue.value",
    },
    target: {
      path: "image",
    },
    mapping: {
      strategy: {
        id: "withDotTemplate",
        options: {
          single: true,
          template:
            "http://commons.wikimedia.org/wiki/Special:FilePath/{{value}}",
        },
      },
    },
  },
  {
    source: {
      path: "$.claims.P131[*].mainsnak.datavalue.value.id",
    },
    target: {
      path: "location",
    },
    mapping: {
      strategy: {
        id: "createEntityWithAuthoritativeLink",
        options: {
          single: true,
          typeIRI: sladb("Location").value,
          typeName: "Location",
          mainProperty: {
            offset: 0,
          },
          authorityFields: [
            {
              offset: 0,
              authorityLinkPrefix: "http://www.wikidata.org/entity/",
              authorityIRI: "http://www.wikidata.org",
            },
          ],
        },
      },
    },
  },
  {
    source: {
      path: "$.claims.P31[*].mainsnak.datavalue.value.id",
    },
    target: {
      path: "seriesType",
    },
    mapping: {
      strategy: {
        id: "createEntityWithAuthoritativeLink",
        options: {
          single: true,
          typeIRI: sladb("SeriesType").value,
          typeName: "SeriesType",
          mainProperty: {
            offset: 0,
          },
          authorityFields: [
            {
              offset: 0,
              authorityLinkPrefix: "http://www.wikidata.org/entity/",
              authorityIRI: "http://www.wikidata.org",
            },
          ],
        },
      },
    },
  },
  {
    source: {
      path: "$.claims.P361[*].mainsnak.datavalue.value.id",
    },
    target: {
      path: "parent",
    },
    mapping: {
      strategy: {
        id: "createEntityWithAuthoritativeLink",
        options: {
          single: true,
          typeIRI: sladb("ExhibitionSeries").value,
          typeName: "ExhibitionSeries",
          mainProperty: {
            offset: 0,
          },
          authorityFields: [
            {
              offset: 0,
              authorityLinkPrefix: "http://www.wikidata.org/entity/",
              authorityIRI: "http://www.wikidata.org",
            },
          ],
        },
      },
    },
  },
  {
    source: {
      path: "$.claims.P921[*].mainsnak.datavalue.value.id",
    },
    target: {
      path: "tags",
    },
    mapping: {
      strategy: {
        id: "createEntityWithAuthoritativeLink",
        options: {
          typeIRI: sladb("Tag").value,
          typeName: "Tag",
          mainProperty: {
            offset: 0,
          },
          authorityFields: [
            {
              offset: 0,
              authorityLinkPrefix: "http://www.wikidata.org/entity/",
              authorityIRI: "http://www.wikidata.org",
            },
          ],
        },
      },
    },
  },
];

export const wikidataExhibitionMapping: DeclarativeMappings = [
  {
    source: {
      path: "$.labels.de.value",
    },
    target: {
      path: "title",
    },
    mapping: {
      strategy: {
        id: "takeFirst",
      },
    },
  },
  {
    source: {
      path: "$.descriptions.de.value",
    },
    target: {
      path: "description",
    },
    mapping: {
      strategy: {
        id: "takeFirst",
      },
    },
  },
  {
    source: {
      path: "$.claims.P18[*].mainsnak.datavalue.value",
    },
    target: {
      path: "image",
    },
    mapping: {
      strategy: {
        id: "withDotTemplate",
        options: {
          single: true,
          template:
            "http://commons.wikimedia.org/wiki/Special:FilePath/{{value}}",
        },
      },
    },
  },
  {
    source: {
      path: "$.claims.P276[*].mainsnak.datavalue.value.id",
    },
    target: {
      path: "locations",
    },
    mapping: {
      strategy: {
        id: "createEntityWithAuthoritativeLink",
        options: {
          typeIRI: sladb("Location").value,
          typeName: "Location",
          mainProperty: {
            offset: 0,
          },
          authorityFields: [
            {
              offset: 0,
              authorityLinkPrefix: "http://www.wikidata.org/entity/",
              authorityIRI: "http://www.wikidata.org",
            },
          ],
        },
      },
    },
  },
  {
    source: {
      path: "$.claims.P580[*].mainsnak.datavalue.value.time",
    },
    target: {
      path: "startDate.dateValue",
    },
    mapping: {
      strategy: {
        id: "dateStringToSpecialInt",
      },
    },
  },
  {
    source: {
      path: "$.claims.P582[*].mainsnak.datavalue.value.time",
    },
    target: {
      path: "endDate.dateValue",
    },
    mapping: {
      strategy: {
        id: "dateStringToSpecialInt",
      },
    },
  },
  {
    source: {
      path: "$.claims.P1545[*].mainsnak.datavalue.value",
    },
    target: {
      path: "seriesOrdinal",
    },
    mapping: {
      strategy: {
        id: "takeFirst",
      },
    },
  },
  {
    source: {
      path: "$.claims.P361[*].mainsnak.datavalue.value.id",
    },
    target: {
      path: "parent",
    },
    mapping: {
      strategy: {
        id: "createEntityWithAuthoritativeLink",
        options: {
          single: true,
          typeIRI: sladb("ExhibitionSeries").value,
          typeName: "ExhibitionSeries",
          mainProperty: {
            offset: 0,
          },
          authorityFields: [
            {
              offset: 0,
              authorityLinkPrefix: "http://www.wikidata.org/entity/",
              authorityIRI: "http://www.wikidata.org",
            },
          ],
        },
      },
    },
  },
  {
    source: {
      path: "$.claims.P856[*].mainsnak.datavalue.value",
    },
    target: {
      path: "website",
    },
    mapping: {
      strategy: {
        id: "takeFirst",
      },
    },
  },
];

export const wikidataMappings: DeclarativeMapping = {
  Location: wikidataLocationMapping,
  ExhibitionSeries: wikidataExhibitionSeriesMapping,
  Exhibition: wikidataExhibitionMapping,
};

export const wikidataTypeMap = {
  Person: "Q5",
  Corporation: "Q43229",
  Place: "Q2221906",
  Location: "Q2221906",
};
