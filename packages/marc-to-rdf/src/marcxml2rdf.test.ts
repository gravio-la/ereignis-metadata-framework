import { describe, expect, test, jest } from "@jest/globals";
import df from "@rdfjs/data-model";
import namespace from "@rdfjs/namespace";
import datasetFactory from "@rdfjs/dataset";
import { rdf } from "@tpluscode/rdf-ns-builders";
import { mapDatafieldToQuads, kxp, kxpPrefixes } from "./marcxml2rdf";
import { BlankNode } from "@rdfjs/types";
import {
  MarcExchangeJson,
  marcExchangeJson2Datafields,
} from "./marcExchangeJson2Datafields";

const fixtureMARC_JSON: MarcExchangeJson = {
  "001": "744674964",
  "003": ["DE-627"],
  "005": ["20230624000530.0"],
  "007": ["tu"],
  "008": ["130419s2011    gw |||||      00| ||ger c"],
  "015": [
    { __: [{ a: "10,N48" }, { "2": "dnb" }] },
    { __: [{ a: "11,A34" }, { "2": "dnb" }] },
  ],
  "016": [{ "7_": [{ a: "1008520454" }, { "2": "DE-101" }] }],
  "020": [
    {
      __: [
        { a: "9783548373836" },
        { c: "EUR 8.99" },
        { "9": "978-3-548-37383-6" },
      ],
    },
    { __: [{ a: "3548373836" }, { "9": "3-548-37383-6" }] },
  ],
  "035": [
    { __: [{ a: "(DE-627)744674964" }] },
    { __: [{ a: "(DE-576)9744674962" }] },
    { __: [{ a: "(DE-599)GBV744674964" }] },
    { __: [{ a: "(OCoLC)759082164" }] },
    { __: [{ a: "(OCoLC)748696836" }] },
    { __: [{ a: "(OCoLC)748696836" }] },
    { __: [{ a: "(DE-604)3032762" }] },
    { __: [{ a: "(DE-478)952542713" }] },
  ],
  "040": [
    { __: [{ a: "DE-627" }, { b: "ger" }, { c: "DE-627" }, { e: "rda" }] },
  ],
  "041": [{ __: [{ a: "ger" }] }],
  "044": [{ __: [{ c: "XA-DE-BE" }] }],
  "082": [{ "04": [{ a: "830" }, { a: "B" }] }],
  "084": [
    { __: [{ a: "Zdc" }, { "2": "asb" }] },
    { __: [{ a: "SDQ 1" }, { "2": "ssd" }] },
    { __: [{ a: "Th 535" }, { "2": "sfb" }] },
    { __: [{ a: "R 38" }, { "2": "kab" }] },
    {
      __: [
        { a: "GO 80000" },
        { q: "DE-14/sred" },
        { "2": "rvk" },
        { "0": "(DE-625)rvk/43268:" },
      ],
    },
  ],
  "100": [
    {
      "1_": [
        { a: "Kling, Marc-Uwe" },
        { d: "1982-" },
        { e: "VerfasserIn" },
        { "0": "(DE-588)13796398X" },
        { "0": "(DE-627)598177280" },
        { "0": "(DE-576)305278886" },
        { "4": "aut" },
      ],
    },
  ],
  "245": [
    {
      "14": [
        { a: "Das Känguru-Manifest" },
        { b: "der Känguru-Chroniken zweiter Teil" },
        { c: "Marc-Uwe Kling" },
      ],
    },
  ],
  "250": [{ __: [{ a: "Originalausgabe" }] }],
  "264": [{ _1: [{ a: "Berlin" }, { b: "Ullstein" }, { c: "2011" }] }],
  "300": [{ __: [{ a: "302 Seiten" }, { c: "19 cm" }] }],
  "336": [{ __: [{ a: "Text" }, { b: "txt" }, { "2": "rdacontent" }] }],
  "337": [
    {
      __: [
        { a: "ohne Hilfsmittel zu benutzen" },
        { b: "n" },
        { "2": "rdamedia" },
      ],
    },
  ],
  "338": [{ __: [{ a: "Band" }, { b: "nc" }, { "2": "rdacarrier" }] }],
  "490": [{ "0_": [{ a: "Ullstein" }, { v: "37383" }] }],
  "500": [
    { __: [{ a: "Hier auch später erschienene, unveränderte Nachdrucke" }] },
  ],
  "583": [
    {
      "1_": [
        { a: "Archivierung prüfen" },
        { c: "20221111" },
        { f: "DE-640" },
        { z: "1" },
        { "2": "pdager" },
      ],
    },
  ],
  "856": [
    {
      "42": [
        {
          u: "http://deposit.d-nb.de/cgi-bin/dokserv?id=3614241&prov=M&dokvar=1&dokext=htm",
        },
        { x: "Verlag" },
        { "3": "Verlagsangaben" },
      ],
    },
    {
      "42": [
        { u: "http://cover.ekz.de/9783548373836.jpg" },
        { x: "Verlag" },
        { "3": "Objektabbildung" },
      ],
    },
    {
      "42": [
        {
          u: "http://deposit.d-nb.de/cgi-bin/dokserv?id=3614241&prov=M&dok_var=1&dok_ext=htm",
        },
        { m: "X:MVB" },
        { q: "text/html" },
        { "3": "Inhaltstext" },
      ],
    },
  ],
  "889": [
    { __: [{ w: "(DE-576)360585272" }] },
    { __: [{ w: "(DE-627)1615786775" }] },
  ],
  "924": [{ "0_": [{ a: "3879772061" }, { b: "DE-14" }, { d: "BSZ" }] }],
  "935": [{ __: [{ i: "mdedup" }] }],
  "936": [
    {
      rv: [
        { a: "GO 80000" },
        { b: "Sonstige" },
        { k: "Germanistik. Niederlandistik. Skandinavistik" },
        { k: "Deutsche Literatur" },
        { k: "Moderne III: 1991 ff." },
        { k: "Literaturgeschichte" },
        { k: "Autoren des 21. Jahrhunderts (geb. ab 1975)" },
        { k: "Sonstige" },
        { "0": "(DE-627)1411444825" },
        { "0": "(DE-625)rvk/43268:" },
        { "0": "(DE-576)341444820" },
      ],
    },
  ],
  "951": [{ __: [{ a: "BO" }] }],
  _FORMAT: "MarcXchange",
  _LEADER: "02210cam a2200577   4500",
  _TYPE: "Bibliographic",
};
const datafields = marcExchangeJson2Datafields(fixtureMARC_JSON);

const dc = namespace("http://purl.org/dc/terms/");
const rda = namespace("http://rdvocab.info/Elements/");
const fabio = namespace("http://purl.org/spar/fabio/");
const bibo = namespace("http://purl.org/ontology/bibo/");
const deich = namespace("http://data.deichman.no/");
const foaf = namespace("http://xmlns.com/foaf/0.1/");
const radatana = namespace("http://def.bibsys.no/xmlns/radatana/1.0#");
const lvont = namespace("http://lexvo.org/ontology#");

describe("MARC to RDF conversion", () => {
  test("converts MARC JSON to RDF quads", () => {
    const dataset = datasetFactory.dataset();
    const recordId = fixtureMARC_JSON["001"];
    const subjectNode = df.namedNode(
      `http://kxp.k10plus.de/ontology/record/${recordId}`,
    );

    dataset.add(df.quad(subjectNode, rdf.type, kxp("Record")));

    // Mock console.warn to check for warnings
    const originalWarn = console.warn;
    console.warn = jest.fn();
    // Process each datafield
    datafields.forEach((datafield) => {
      const quads = mapDatafieldToQuads(subjectNode, datafield);
      quads.forEach((quad) => {
        dataset.add(quad);
      });
    });

    // Check if warning was logged for multiple subfield code 'a'
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("More than one subfield found for code a"),
    );

    // Restore original console.warn
    console.warn = originalWarn;

    // Test record type
    expect(dataset.has(df.quad(subjectNode, rdf.type, kxp("Record")))).toBe(
      true,
    );

    // Test title
    expect(
      dataset.has(
        df.quad(subjectNode, dc("title"), df.literal("Das Känguru-Manifest")),
      ),
    ).toBe(true);

    // Test subtitle
    expect(
      dataset.has(
        df.quad(
          subjectNode,
          fabio("hasSubtitle"),
          df.literal("der Känguru-Chroniken zweiter Teil"),
        ),
      ),
    ).toBe(true);

    // Test statement of responsibility
    expect(
      dataset.has(
        df.quad(
          subjectNode,
          rda("statementOfResponsibility"),
          df.literal("Marc-Uwe Kling"),
        ),
      ),
    ).toBe(true);

    // Test edition
    expect(
      dataset.has(
        df.quad(subjectNode, bibo("edition"), df.literal("Originalausgabe")),
      ),
    ).toBe(true);

    // Test physical description
    expect(
      dataset.has(
        df.quad(subjectNode, bibo("numPages"), df.literal("302 Seiten")),
      ),
    ).toBe(true);

    expect(
      dataset.has(
        df.quad(subjectNode, deich("physicalDescription"), df.literal("19 cm")),
      ),
    ).toBe(true);

    // Test ISBN
    expect(
      dataset.has(
        df.quad(subjectNode, bibo("isbn"), df.literal("9783548373836")),
      ),
    ).toBe(true);

    expect(
      dataset.has(df.quad(subjectNode, bibo("isbn"), df.literal("3548373836"))),
    ).toBe(true);

    // Test price info
    expect(
      dataset.has(
        df.quad(subjectNode, deich("priceInfo"), df.literal("EUR 8.99")),
      ),
    ).toBe(true);

    // Test language
    expect(
      dataset.has(df.quad(subjectNode, dc("language"), df.literal("ger"))),
    ).toBe(true);

    // Test URLs
    expect(
      dataset.has(
        df.quad(
          subjectNode,
          fabio("hasURL"),
          df.literal(
            "http://deposit.d-nb.de/cgi-bin/dokserv?id=3614241&prov=M&dokvar=1&dokext=htm",
          ),
        ),
      ),
    ).toBe(true);

    expect(
      dataset.has(
        df.quad(
          subjectNode,
          fabio("hasURL"),
          df.literal("http://cover.ekz.de/9783548373836.jpg"),
        ),
      ),
    ).toBe(true);

    // Test creator relationship
    // First find the creator blank node
    const creatorQuads = [...dataset.match(subjectNode, dc("creator"), null)];

    expect(creatorQuads.length).toBeGreaterThan(0);

    if (creatorQuads.length > 0) {
      expect(creatorQuads[0].object.termType).toBe("BlankNode");
      const creatorNode = creatorQuads[0].object as BlankNode;

      // Test creator is a Person
      expect(dataset.has(df.quad(creatorNode, rdf.type, foaf("Person")))).toBe(
        true,
      );

      // Test creator name
      expect(
        dataset.has(
          df.quad(
            creatorNode,
            radatana("catalogueName"),
            df.literal("Kling, Marc-Uwe"),
          ),
        ),
      ).toBe(true);

      // Test creator lifespan
      expect(
        dataset.has(
          df.quad(creatorNode, deich("lifespan"), df.literal("1982-")),
        ),
      ).toBe(true);
    }

    // Test language relationship
    const languageQuads = [
      ...dataset.match(subjectNode, dc("language"), null),
    ].filter((q) => q.object.termType === "BlankNode");

    if (languageQuads.length > 0) {
      expect(languageQuads[0].object.termType).toBe("BlankNode");
      const languageNode = languageQuads[0].object as BlankNode;

      // Test language is a Language
      expect(
        dataset.has(df.quad(languageNode, rdf.type, lvont("Language"))),
      ).toBe(true);
    }
  });
});
