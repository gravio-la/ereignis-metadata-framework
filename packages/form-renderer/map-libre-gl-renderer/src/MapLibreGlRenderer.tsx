import {
  ControlProps,
  isStringControl,
  RankedTester,
  rankWith,
} from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { Box, FormControl, TextField } from "@mui/material";
import merge from "lodash-es/merge";
import { Map } from "maplibre-gl";
import { useTranslation } from "next-i18next";
import React, { useCallback, useState } from "react";

import { MapLibreComponent } from "./MapLibreComponent";

const parsePoint = (pointStr: string): [number, number] | null => {
  const match = pointStr.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/);
  if (match) {
    return [parseFloat(match[1]), parseFloat(match[2])];
  }
  return null;
};

const formatPoint = (coordinates: [number, number]): string => {
  return `POINT(${coordinates[0]} ${coordinates[1]})`;
};

const MapLibreGlRendererComponent = (props: ControlProps) => {
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
  const [map, setMap] = useState<Map | null>(null);
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const [selectedPoint, setSelectedPoint] = useState<[number, number] | null>(
    data ? parsePoint(data) : null,
  );

  const handlePointPicked = useCallback(
    (point: [number, number]) => {
      setSelectedPoint(point);
      handleChange(path, formatPoint(point));
    },
    [path, handleChange],
  );

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      handleChange(path, newValue);
      const parsedPoint = parsePoint(newValue);
      if (parsedPoint) {
        setSelectedPoint(parsedPoint);
        if (map) {
          map.setCenter(parsedPoint);
        }
      }
    },
    [path, handleChange, map],
  );

  const handleMapCreated = useCallback((map: Map) => {
    setMap(map);
  }, []);

  return (
    <FormControl
      fullWidth={!appliedUiSchemaOptions.trim}
      id={id}
      sx={(theme) => ({
        marginBottom: theme.spacing(2),
        visibility: visible ? "visible" : "hidden",
      })}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label={schema.title || t("Location")}
          value={data || ""}
          onChange={handleTextChange}
          error={!isValid}
          helperText={errors}
          fullWidth
          placeholder="POINT(longitude latitude)"
        />
        <MapLibreComponent
          onMapCreated={handleMapCreated}
          onPointPicked={handlePointPicked}
          selectedPoint={selectedPoint}
          initialZoom={3}
        />
      </Box>
    </FormControl>
  );
};

export const MapLibreGlRenderer = withJsonFormsControlProps(
  MapLibreGlRendererComponent,
);

export const MapLibreGlRendererTester: RankedTester = rankWith(
  10,
  isStringControl,
);
