import { AutocompleteSuggestion } from "@graviola/edb-core-types";
import { useQuery } from "@graviola/edb-state-hooks";
import { ClearSharp } from "@mui/icons-material";
import {
  CircularProgress,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { FunctionComponent, useCallback, useId, useMemo } from "react";

export type PreloadedOptionSelect = {
  title: string;
  load: (value?: string) => Promise<AutocompleteSuggestion[]>;
  value?: AutocompleteSuggestion | null;
  typeIRI: string;
  onChange?: (
    e: React.SyntheticEvent,
    value: AutocompleteSuggestion | null,
  ) => void;
  disabled?: boolean;
};

export const PreloadedOptionSelect: FunctionComponent<
  PreloadedOptionSelect
> = ({ load, title, value, typeIRI, onChange, disabled }) => {
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["type", typeIRI, "suggestions"],
    queryFn: () => {
      return load();
    },
    enabled: !disabled,
    refetchOnWindowFocus: true,
  });

  const handleOnChange = useCallback(
    (e: SelectChangeEvent<string>): void => {
      const value = e.target.value;
      if (value === null) {
        onChange?.(e as React.SyntheticEvent, null);
        return;
      }
      const selected = suggestions?.find(
        (suggestion) => suggestion.value === value,
      );
      if (selected) {
        onChange?.(e as React.SyntheticEvent, selected);
      }
    },
    [onChange, suggestions],
  );

  const selectID = useId();
  const { t } = useTranslation();
  const v = useMemo(() => value?.value ?? null, [value]);

  return (
    <>
      <InputLabel id={selectID}>{title}</InputLabel>
      <Select
        labelId={selectID}
        endAdornment={isLoading ? <CircularProgress size={"2em"} /> : undefined}
        value={v || ""}
        label={title}
        disabled={disabled}
        onChange={handleOnChange}
        inputProps={{
          disabled: disabled,
        }}
      >
        {(suggestions || []).map((suggestion) => (
          <MenuItem key={suggestion.value} value={suggestion.value}>
            {suggestion.label}
          </MenuItem>
        ))}
        <MenuItem
          disabled={!v}
          key="empty"
          value={null}
          sx={{ fontStyle: "italic" }}
        >
          <ListItemIcon>
            <ClearSharp fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {!v ? t("no selection") : t("remove selection")}
          </ListItemText>
        </MenuItem>
      </Select>
    </>
  );
};
