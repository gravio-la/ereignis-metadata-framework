import NiceModal from "@ebay/nice-modal-react";
import {
  applyToEachField,
  extractFieldIfString,
} from "@graviola/edb-data-mapping";
import { useAdbContext } from "@graviola/edb-state-hooks";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { FunctionComponent, useCallback, useMemo } from "react";

interface OwnProps {
  index: number;
  data: any;
  disableLoad?: boolean;
  readonly?: boolean;
}

type Props = OwnProps;

export const TypedListItem: FunctionComponent<Props> = ({
  index,
  data,
  disableLoad,
  readonly,
}) => {
  const {
    typeIRIToTypeName,
    queryBuildOptions: { primaryFieldExtracts },
    components: { EntityDetailModal },
  } = useAdbContext();
  const typeIRI = data["@type"] as string;
  const entityIRI = data["@id"] as string;
  const typeName = useMemo(
    () => typeIRIToTypeName(typeIRI),
    [typeIRI, typeIRIToTypeName],
  );
  const primaryFieldDesc = useMemo(
    () => primaryFieldExtracts[typeName],
    [primaryFieldExtracts, typeName],
  );

  const { label, description, image } = useMemo(
    () => applyToEachField(data, primaryFieldDesc, extractFieldIfString),
    [data, primaryFieldDesc],
  );

  const showDetailModal = useCallback(() => {
    NiceModal.show(EntityDetailModal, {
      typeIRI,
      entityIRI,
      data,
      disableLoad,
      disableInlineEditing: true,
      readonly,
    });
  }, [typeIRI, entityIRI, data, disableLoad, EntityDetailModal, readonly]);

  return (
    <ListItem>
      <ListItemButton onClick={showDetailModal}>
        <ListItemAvatar>
          <Avatar aria-label="Index" src={image}>
            {index + 1}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={label} secondary={description} />
      </ListItemButton>
    </ListItem>
  );
};
