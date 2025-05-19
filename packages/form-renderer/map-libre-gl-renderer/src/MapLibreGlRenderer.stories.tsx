import { materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import {
  MapLibreGlRenderer,
  MapLibreGlRendererTester,
} from "./MapLibreGlRenderer";

const meta: Meta<typeof MapLibreGlRenderer> = {
  component: MapLibreGlRenderer,
  title: "Components/renderer/MapLibreGlRenderer",
};

const schema = {
  type: "object",
  properties: {
    testProperty: { type: "string", format: "GIS:Point" },
  },
};

const uischema = {
  type: "VerticalLayout",
  elements: [{ type: "Control", scope: "#/properties/testProperty" }],
};

const renderers = [
  ...materialRenderers,
  {
    renderer: MapLibreGlRenderer,
    tester: MapLibreGlRendererTester,
  },
];

const JsonFormsForMapLibreGlRenderer = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const handleChange = ({ data, error }: { data: any; error: any }) => {
    setData(data);
    setError(error);
  };
  return (
    <>
      <JsonForms
        schema={schema}
        uischema={uischema}
        renderers={renderers}
        data={data}
        onChange={handleChange}
      />
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </>
  );
};

export default meta;
type Story = StoryObj<typeof MapLibreGlRenderer>;

export const Default: Story = {
  render: () => <JsonFormsForMapLibreGlRenderer />,
};
