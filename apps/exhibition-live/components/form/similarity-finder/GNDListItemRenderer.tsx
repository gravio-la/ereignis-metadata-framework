import {
  ClassicEntityCard,
  ClassicResultListItem,
} from "@graviola/edb-basic-components";
import { BasicThingInformation } from "@graviola/edb-core-types";
import {
  useQuery,
  useQueryClient,
  useSimilarityFinderState,
} from "@graviola/edb-state-hooks";
import { Check } from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { useTranslation } from "next-i18next";
import * as React from "react";
import { useCallback, useEffect } from "react";

import { LobidAllPropTable } from "../lobid/LobidAllPropTable";
import { WikidataAllPropTable } from "../wikidata/WikidataAllPropTable";
import { fetchBasicInformationFromGND } from "./fetchBasicInformationFromGND";
import { ListItemRendererProps } from "./types";

export const GNDListItemRenderer = ({
  data: initialData,
  idx,
  typeIRI,
  selected,
  onSelect,
  onAccept,
}: ListItemRendererProps) => {
  const { t } = useTranslation();
  const { id } = initialData;
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["entityDetail", id],
    queryFn: async () => fetchBasicInformationFromGND(id, initialData),
    initialData,
    enabled: selected,
  });

  const { resetElementIndex } = useSimilarityFinderState();

  const handleAccept = useCallback(async () => {
    const finalData = await queryClient.fetchQuery({
      queryKey: ["entityDetail", id],
      queryFn: async () => fetchBasicInformationFromGND(id, initialData),
    });
    resetElementIndex();
    onAccept && onAccept(id, finalData);
  }, [onAccept, id, queryClient, initialData, resetElementIndex]);

  const { acceptWishPending, setAcceptWishPending } =
    useSimilarityFinderState();
  useEffect(() => {
    if (selected && handleAccept && acceptWishPending) {
      setAcceptWishPending(false);
      handleAccept();
    }
  }, [handleAccept, selected, acceptWishPending, setAcceptWishPending]);

  const { label, avatar, secondary, category } = data;
  return (
    <ClassicResultListItem
      key={id}
      id={id}
      index={idx}
      onSelected={onSelect}
      label={label}
      secondary={secondary}
      avatar={avatar}
      altAvatar={String(idx)}
      selected={selected}
      onEnter={handleAccept}
      category={category}
      listItemProps={{
        secondaryAction: (
          <Stack direction="row" spacing={1}>
            <IconButton onClick={handleAccept}>
              <Check />
            </IconButton>
          </Stack>
        ),
      }}
      popperChildren={
        <ClassicEntityCard
          sx={{
            maxWidth: "30em",
            maxHeight: "80vh",
            overflow: "auto",
          }}
          id={id}
          data={data}
          cardActionChildren={
            <Button
              size="small"
              color="primary"
              variant="contained"
              className="accept-button"
              onClick={handleAccept}
            >
              {t("accept entity")}
            </Button>
          }
          detailView={
            <>
              <LobidAllPropTable allProps={data.allProps} disableContextMenu />
              {(data.allProps?.sameAs || [])
                .filter(({ id }) =>
                  id.startsWith("http://www.wikidata.org/entity/"),
                )
                .map(({ id }) => (
                  <WikidataAllPropTable key={id} thingIRI={id} />
                ))}
            </>
          }
        />
      }
    />
  );
};
