import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import { MapLibreComponent } from "./MapLibreComponent";

const meta: Meta<typeof MapLibreComponent> = {
  component: MapLibreComponent,
  title: "Components/MapLibreComponent",
};

export default meta;
type Story = StoryObj<typeof MapLibreComponent>;

const MapLibreComponentWithControls = () => {
  const [selectedPoint, setSelectedPoint] = useState<[number, number] | null>(
    null,
  );

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapLibreComponent
        initialCenter={[13.404954, 52.520008]} // Berlin coordinates
        initialZoom={12}
        onPointPicked={setSelectedPoint}
        selectedPoint={selectedPoint}
      />
      {selectedPoint && (
        <div style={{ marginTop: "1rem" }}>
          Selected Point: {selectedPoint[0].toFixed(6)},{" "}
          {selectedPoint[1].toFixed(6)}
        </div>
      )}
    </div>
  );
};

export const Default: Story = {
  render: () => <MapLibreComponentWithControls />,
};

export const WithInitialPoint: Story = {
  render: () => (
    <div style={{ height: "500px", width: "100%" }}>
      <MapLibreComponent
        initialCenter={[13.404954, 52.520008]} // Berlin coordinates
        initialZoom={12}
        selectedPoint={[13.404954, 52.520008]}
      />
    </div>
  ),
};

export const DifferentLocation: Story = {
  render: () => (
    <div style={{ height: "500px", width: "100%" }}>
      <MapLibreComponent
        initialCenter={[-74.006, 40.7128]} // New York coordinates
        initialZoom={10}
      />
    </div>
  ),
};
