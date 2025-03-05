import { List } from "@mui/material";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAdbContext,
  useDataStore,
  useGlobalCRUDOptions,
  useQueryClient,
} from "@graviola/edb-state-hooks";
import { ClassicResultListItem } from "@graviola/edb-basic-components";
import { Entity } from "@graviola/edb-core-types";
import { EntityDetailElement } from "../show";

export type DiscoverSearchTableProps = {
  searchString: string;
  typeName?: string;
  onAcceptItem?: (id: string | undefined, data: any) => void;
  selectedIndex?: number;
  limit?: number;
};

export const DiscoverSearchTable: FunctionComponent<
  DiscoverSearchTableProps
> = ({
  searchString,
  typeName = "Person",
  onAcceptItem,
  selectedIndex,
  limit,
}) => {
  const [resultTable, setResultTable] = useState<any | undefined>();
  const { schema, typeNameToTypeIRI, queryBuildOptions } = useAdbContext();
  const queryClient = useQueryClient();
  const { crudOptions } = useGlobalCRUDOptions();
  const typeIRI = useMemo(
    () => typeNameToTypeIRI(typeName),
    [typeName, typeNameToTypeIRI],
  );

  const { dataStore, ready } = useDataStore({
    schema,
    crudOptionsPartial: crudOptions,
    typeNameToTypeIRI,
    queryBuildOptions,
  });

  const fetchData = useCallback(async () => {
    if (
      !searchString ||
      searchString.length < 1 ||
      !crudOptions ||
      !typeIRI ||
      !ready
    )
      return;
    const result = await queryClient.fetchQuery<Entity[]>({
      queryKey: ["discover-search", typeName, searchString],
      queryFn: () =>
        dataStore?.findEntityByTypeName(typeName, searchString, limit),
    });
    setResultTable(
      result.map(({ label = "", entityIRI, description, image }) => {
        return {
          label,
          id: entityIRI,
          secondary: description,
          avatar: image,
        };
      }),
    );
  }, [searchString, typeIRI, ready, dataStore, queryClient]);

  const handleSelect = useCallback(
    (id: string | undefined) => {
      const data = id && resultTable?.find((entry) => entry.id === id);
      onAcceptItem && data && onAcceptItem(id, data);
    },
    [resultTable, onAcceptItem],
  );

  useEffect(() => {
    fetchData();
  }, [searchString, typeName, fetchData]);

  return (
    <List>
      {// @ts-ignore
      resultTable?.map(({ id, label, avatar, secondary }, idx) => {
        return (
          <ClassicResultListItem
            key={id}
            id={id}
            index={idx}
            onSelected={handleSelect}
            label={label}
            secondary={secondary}
            avatar={avatar}
            altAvatar={idx + 1}
            selected={selectedIndex === idx}
            popperChildren={
              <EntityDetailElement
                sx={{
                  maxWidth: "30em",
                  maxHeight: "80vh",
                  overflow: "auto",
                }}
                entityIRI={id}
                typeIRI={typeIRI}
                data={undefined}
                cardActionChildren={null}
                readonly
              />
            }
          />
        );
      })}
    </List>
  );
};
