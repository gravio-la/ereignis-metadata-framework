import {
  AllPropTable,
  AllPropTableProps,
} from "@graviola/edb-advanced-components";
import {
  findEntityWithinLobidByIRI,
  gndBaseIRI,
} from "@graviola/edb-authorities";
import { useQuery } from "@graviola/edb-state-hooks";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React, { FunctionComponent, useMemo } from "react";

import { WikidataAllPropTable } from "../wikidata/WikidataAllPropTable";

export type LobidAllPropTableProps = AllPropTableProps & {
  disableLoad?: boolean;
};

type Props = LobidAllPropTableProps;

export const LobidAllPropTable: FunctionComponent<Props> = ({
  allProps,
  disableContextMenu,
  disabledProperties,
  disableLoad,
}) => {
  const gndIRI = useMemo(() => {
    const gndIRI_ = allProps?.idAuthority?.id;
    if (typeof gndIRI_ !== "string") return undefined;
    return gndIRI_.startsWith(gndBaseIRI) ? gndIRI_ : undefined;
  }, [allProps]);
  const { data: rawEntry } = useQuery({
    queryKey: ["lobid", gndIRI],
    queryFn: () => findEntityWithinLobidByIRI(gndIRI),
    enabled: !!gndIRI && !disableLoad,
  });

  return (
    <>
      <AllPropTable
        allProps={allProps}
        disableContextMenu={disableContextMenu}
        disabledProperties={disabledProperties}
      />
      {rawEntry && (
        <>
          <Accordion>
            <AccordionSummary>
              <Typography>GND Eintrag</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <LobidAllPropTable allProps={rawEntry} disableContextMenu />
            </AccordionDetails>
          </Accordion>
          {((rawEntry as any)?.sameAs || [])
            .filter(({ id }) =>
              id.startsWith("http://www.wikidata.org/entity/"),
            )
            .map(({ id }) => (
              <Accordion key={id}>
                <AccordionSummary>
                  <Typography>Wikidata Einträge</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <WikidataAllPropTable key={id} thingIRI={id} />
                </AccordionDetails>
              </Accordion>
            ))}
        </>
      )}
    </>
  );
};
