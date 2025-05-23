import { useState, MouseEvent, useCallback } from "react";
import { Chip, Tooltip } from "@mui/material";
import NiceModal from "@ebay/nice-modal-react";
import { useAdbContext } from "@graviola/edb-state-hooks";

export type OverflowChipProps = {
  label: React.ReactNode;
  secondary?: React.ReactNode;
  entityIRI?: string;
};

export const OverflowChip = ({
  label,
  entityIRI,
  secondary,
}: OverflowChipProps) => {
  const [tooltipEnabled, setTooltipEnabled] = useState(false);
  const {
    components: { EntityDetailModal },
  } = useAdbContext();

  const showDetailModal = useCallback(
    (e: MouseEvent) => {
      if (!entityIRI) return;
      e.preventDefault();
      NiceModal.show(EntityDetailModal, { entityIRI, data: {} });
    },
    [entityIRI, EntityDetailModal],
  );

  const handleShouldShow = useCallback(
    (e: MouseEvent<Element>) => {
      setTooltipEnabled(true);
    },
    [setTooltipEnabled],
  );

  return (
    <Tooltip
      title={secondary || label}
      open={tooltipEnabled}
      onClose={() => setTooltipEnabled(false)}
    >
      <Chip
        size={"small"}
        onMouseEnter={handleShouldShow}
        sx={{ maxWidth: "8em" }}
        label={label}
        onClick={showDetailModal}
      />
    </Tooltip>
  );
};
