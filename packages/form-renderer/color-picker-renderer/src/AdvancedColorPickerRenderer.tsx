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
} from "@mui/material";
import merge from "lodash-es/merge";
import React, { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";
import {
  AlphaPicker,
  BlockPicker,
  ChromePicker,
  CirclePicker,
  CompactPicker,
  GithubPicker,
  HuePicker,
  PhotoshopPicker,
  SketchPicker,
  SliderPicker,
  SwatchesPicker,
  TwitterPicker,
} from "react-color";
import { COLOR_FORMATS } from "./ajvColorFormats";
import { type ColorFormat, formatColor } from "./formatColor";

type PickerComponent =
  | typeof AlphaPicker
  | typeof BlockPicker
  | typeof ChromePicker
  | typeof CirclePicker
  | typeof CompactPicker
  | typeof GithubPicker
  | typeof HuePicker
  | typeof PhotoshopPicker
  | typeof SketchPicker
  | typeof SliderPicker
  | typeof SwatchesPicker
  | typeof TwitterPicker;

interface PickerConfig {
  component: string;
  props?: Record<string, any>;
}

const PICKER_COMPONENTS: Record<string, PickerComponent> = {
  alpha: AlphaPicker,
  block: BlockPicker,
  chrome: ChromePicker,
  circle: CirclePicker,
  compact: CompactPicker,
  github: GithubPicker,
  hue: HuePicker,
  photoshop: PhotoshopPicker,
  sketch: SketchPicker,
  slider: SliderPicker,
  swatches: SwatchesPicker,
  twitter: TwitterPicker,
};

const getPickerComponent = (config: PickerConfig): PickerComponent => {
  const component = PICKER_COMPONENTS[config.component.toLowerCase()];
  if (!component) {
    console.warn(
      `Unknown picker component: ${config.component}. Falling back to SketchPicker.`,
    );
    return SketchPicker;
  }
  return component;
};

const AdvancedColorPickerRendererComponent = (props: ControlProps) => {
  const {
    id,
    errors,
    schema,
    uischema,
    visible,
    required,
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

  // Get picker configuration from uischema options
  const pickerConfig: PickerConfig = appliedUiSchemaOptions.picker || {
    component: "sketch",
  };
  const PickerComponent = getPickerComponent(pickerConfig);

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
          label={schema.title}
          onChange={(e) => handleChange_(e.target.value)}
          value={data}
          fullWidth={true}
        />
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <PickerComponent
          color={data}
          onChange={handleColorChange}
          {...pickerConfig.props}
        />
      </Popover>
    </FormControl>
  );
};

export const AdvancedColorPickerRenderer = withJsonFormsControlProps(
  AdvancedColorPickerRendererComponent,
);

export const AdvancedColorPickerRendererTester: RankedTester = rankWith(
  10,
  isStringControl,
);
