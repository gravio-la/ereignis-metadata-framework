import { Box, List, Paper, Typography } from "@mui/material";
import { Meta, StoryObj } from "@storybook/react";
import { Feature } from "geojson";
import React, { useState } from "react";
import { GeoJSONStoreFeatures } from "terra-draw";

import { FeatureListItem } from "./FeatureListItem";
import { TerradrawMapComponent } from "./TerradrawMapComponent";

const meta: Meta<typeof TerradrawMapComponent> = {
  component: TerradrawMapComponent,
  title: "Components/TerradrawMapComponent",
};

export default meta;
type Story = StoryObj<typeof TerradrawMapComponent>;

type ID = string | number;

const TerradrawMapWithControls = () => {
  const [allFeatures, setAllFeatures] = useState<Record<
    string,
    GeoJSONStoreFeatures
  > | null>(null);
  const [editFeature, setEditFeature] = useState<ID[]>([]);
  const [lastSelected, setLastSelected] = useState<any | null>(null);
  const [lastDeleted, setLastDeleted] = useState<any | null>(null);

  const toggleEditFeature = (feature: GeoJSONStoreFeatures) => {
    setEditFeature((prev) =>
      prev.includes(feature.id)
        ? prev.filter((f) => f !== feature.id)
        : [...prev, feature.id],
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6">Created Feature</Typography>
          <List>
            {Object.values(allFeatures || {}).map((feature) => (
              <FeatureListItem
                key={feature.id}
                feature={feature}
                onRemove={() => {
                  setEditFeature((prev) =>
                    prev.filter((f) => f !== feature.id),
                  );
                  setAllFeatures((prev) => {
                    const newFeatures = { ...prev };
                    delete newFeatures[feature.id];
                    return newFeatures;
                  });
                }}
                onSelect={() => {}}
                onEdit={() => toggleEditFeature(feature)}
                selected={editFeature.includes(feature.id)}
                edit={editFeature.includes(feature.id)}
              />
            ))}
          </List>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6">Last Selected Feature</Typography>
          <pre style={{ maxHeight: "200px", overflow: "auto" }}>
            {JSON.stringify(lastSelected, null, 2)}
          </pre>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6">Last Deleted Feature</Typography>
          <pre style={{ maxHeight: "200px", overflow: "auto" }}>
            {JSON.stringify(lastDeleted, null, 2)}
          </pre>
        </Paper>
      </Box>
      <Box sx={{ height: "500px" }}>
        <TerradrawMapComponent
          initialCenter={[13.404954, 52.520008]} // Berlin coordinates
          initialZoom={12}
          features={Object.values(allFeatures || {})}
          editFeatures={editFeature.map((id) => allFeatures?.[id])}
          onFeaturesCreated={(features) => {
            setEditFeature([]);
            return setAllFeatures((prev) => {
              return {
                ...(prev || {}),
                ...Object.fromEntries(features.map((f) => [f.id, f])),
              };
            });
          }}
          onFeatureSelected={() => setLastSelected(null)}
          onFeatureDeleted={setLastDeleted}
        />
      </Box>
    </Box>
  );
};

export const Default: Story = {
  render: () => <TerradrawMapWithControls />,
};

export const WithInitialLocation: Story = {
  render: () => (
    <Box sx={{ height: "500px" }}>
      <TerradrawMapComponent
        initialCenter={[-74.006, 40.7128]} // New York coordinates
        initialZoom={10}
      />
    </Box>
  ),
};

export const WithDifferentLocation: Story = {
  render: () => (
    <Box sx={{ height: "500px" }}>
      <TerradrawMapComponent
        initialCenter={[139.7525, 35.6846]} // Tokyo coordinates
        initialZoom={12}
      />
    </Box>
  ),
};
