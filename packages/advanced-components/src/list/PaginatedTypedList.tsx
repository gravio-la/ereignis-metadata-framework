import { Box, List, Pagination } from "@mui/material";
import { FunctionComponent } from "react";
import { ListItemType } from "./listItemType";
import { SelectableListItem } from "./SelectableListItem";

interface PaginatedTypedListProps {
  data: ListItemType[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelect?: (id: string, selected: boolean) => void;
  onClickEntity?: (id: string) => void;
  selectedIds?: string[];
  actionTools?: React.ReactNode;
  readonly?: boolean;
}

export const PaginatedTypedList: FunctionComponent<PaginatedTypedListProps> = ({
  data,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onSelect,
  onClickEntity,
  selectedIds,
  actionTools,
  readonly,
}) => {
  return (
    <>
      <List sx={{ flexGrow: 1, overflow: "auto" }}>
        {data.map((item, index) => (
          <SelectableListItem
            key={item.entityIRI}
            id={item.entityIRI}
            index={(page - 1) * 10 + index}
            primary={item.label}
            secondary={item.description}
            avatar={item.image}
            selected={selectedIds?.includes(item.entityIRI)}
            onSelect={onSelect}
            onEdit={!readonly ? onEdit : undefined}
            onDelete={!readonly ? onDelete : undefined}
            onClickEntity={onClickEntity}
            actionTools={actionTools}
          />
        ))}
      </List>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => onPageChange(value)}
          color="primary"
        />
      </Box>
    </>
  );
};
