import {
  ControlProps,
  RankedTester,
  rankWith,
  isStringControl,
  isDescriptionHidden,
  ControlElement,
} from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import {
  FormControl,
  TextField,
  IconButton,
  Popover,
  Box,
  FormHelperText,
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
import { useFocus } from "@jsonforms/material-renderers";

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

type PickerComponentName = keyof typeof PICKER_COMPONENTS;

type PickerProps<T extends PickerComponentName> =
  T extends keyof typeof PICKER_COMPONENTS
    ? ConstructorParameters<(typeof PICKER_COMPONENTS)[T]>[0]
    : never;

export type PickerComponentControlElement<
  T extends PickerComponentName = PickerComponentName,
> = ControlElement & {
  options?: {
    picker: {
      component: T;
      props?: PickerProps<T>;
    };
  };
};

interface PickerConfig<T extends PickerComponentName = PickerComponentName> {
  component: T;
  props?: PickerProps<T>;
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
    label,
    description,
    uischema,
    visible,
    enabled,
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
  const [focused, onFocus, onBlur] = useFocus();

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

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription,
  );

  const firstFormHelperText = showDescription
    ? description
    : !isValid
      ? errors
      : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;

  if (!visible) {
    return null;
  }

  return (
    <FormControl
      fullWidth={!appliedUiSchemaOptions.trim}
      id={id}
      sx={(theme) => ({
        marginBottom: theme.spacing(2),
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
          label={label}
          disabled={!enabled}
          onChange={(e) => handleChange_(e.target.value)}
          value={data}
          error={!isValid}
          fullWidth={true}
          onFocus={onFocus}
          onBlur={onBlur}
          InputLabelProps={{
            shrink: Boolean(data),
          }}
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
        {/* @ts-ignore */}
        <PickerComponent
          color={data}
          onChange={handleColorChange}
          {...pickerConfig.props}
        />
      </Popover>
      <FormHelperText error={!isValid && !showDescription}>
        {firstFormHelperText}
      </FormHelperText>
      <FormHelperText error={!isValid}>{secondFormHelperText}</FormHelperText>
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
