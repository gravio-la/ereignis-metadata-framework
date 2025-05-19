import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Feature } from "geojson";

interface FeatureListItemProps {
  feature: Feature;
  onRemove: (feature: Feature) => void;
  onSelect: (feature: Feature) => void;
  onEdit: (feature: Feature) => void;
  selected: boolean;
  edit: boolean;
}

export const FeatureListItem = ({
  feature,
  onRemove,
  onSelect,
  onEdit,
  selected,
  edit,
}: FeatureListItemProps) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(feature);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(feature);
  };

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <IconButton edge="end" onClick={handleRemove}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemButton
        selected={selected}
        onClick={() => onSelect(feature)}
        sx={{ pr: 1 }}
      >
        <IconButton edge="start" onClick={handleEdit} sx={{ mr: 1 }}>
          <EditIcon />
        </IconButton>
        <ListItemText primary={feature.id} secondary={feature.geometry.type} />
      </ListItemButton>
    </ListItem>
  );
};
