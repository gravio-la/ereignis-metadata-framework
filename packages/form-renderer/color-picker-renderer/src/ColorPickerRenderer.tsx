import {
  ControlProps,
  RankedTester,
  rankWith,
  isStringControl,
} from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import {
  FormControl,
  TextField,
  IconButton,
  Popover,
  Box,
  Typography,
} from "@mui/material";
import merge from "lodash-es/merge";
import React, { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";
import { SketchPicker } from "react-color";
import { COLOR_FORMATS } from "./ajvColorFormats";
import { type ColorFormat, formatColor } from "./formatColor";

const ColorPickerRendererComponent = (props: ControlProps) => {
  const {
    id,
    errors,
    schema,
    uischema,
    visible,
    enabled,
    required,
    label,
    config,
    data,
    handleChange,
    path,
  } = props;
  const isValid = errors.length === 0;
  const { t } = useTranslation();
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // Determine the color format from schema
  const colorFormat =
    schema.format && Object.keys(COLOR_FORMATS).includes(schema.format)
      ? (schema.format as ColorFormat)
      : "hex";

  const handleChange_ = useCallback(
    (v?: string) => {
      handleChange(path, v);
    },
    [path, handleChange],
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (color: any) => {
    const formattedColor = formatColor(color, colorFormat);
    handleChange_(formattedColor);
  };

  const open = Boolean(anchorEl);

  return (
    <FormControl
      fullWidth={!appliedUiSchemaOptions.trim}
      id={id}
      sx={(theme) => ({
        marginBottom: theme.spacing(2),
        visibility: visible ? "visible" : "hidden",
      })}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={handleClick}
          sx={{
            width: 40,
            height: 40,
            border: "1px solid rgba(0, 0, 0, 0.23)",
            borderRadius: 1,
            padding: 0,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: data || "#ffffff",
            }}
          />
        </IconButton>
        <TextField
          label={label}
          onChange={(e) => handleChange_(e.target.value)}
          value={data}
          fullWidth={true}
          disabled={!enabled}
        />
      </Box>
      <Popover
        open={open && enabled}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <SketchPicker color={data} onChange={handleColorChange} />
      </Popover>
    </FormControl>
  );
};

export const ColorPickerRenderer = withJsonFormsControlProps(
  ColorPickerRendererComponent,
);

export const ColorPickerRendererTester: RankedTester = rankWith(
  10,
  isStringControl,
);
