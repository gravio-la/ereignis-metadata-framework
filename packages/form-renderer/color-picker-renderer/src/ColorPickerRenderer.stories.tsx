import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { JsonForms } from "@jsonforms/react";
import { materialRenderers } from "@jsonforms/material-renderers";
import {
  ColorPickerRenderer,
  ColorPickerRendererTester,
} from "./ColorPickerRenderer";

const meta: Meta<typeof ColorPickerRenderer> = {
  component: ColorPickerRenderer,
  title: "Components/renderer/ColorPickerRenderer",
};

const schema = {
  type: "object",
  properties: {
    hexColor: { type: "string", format: "hex" },
    rgbColor: { type: "string", format: "rgb" },
    rgbaColor: { type: "string", format: "rgba" },
    hslColor: { type: "string", format: "hsl" },
    hslaColor: { type: "string", format: "hsla" },
  },
};

const uischema = {
  type: "VerticalLayout",
  elements: [
    { type: "Control", scope: "#/properties/hexColor" },
    { type: "Control", scope: "#/properties/rgbColor" },
    { type: "Control", scope: "#/properties/rgbaColor" },
    { type: "Control", scope: "#/properties/hslColor" },
    { type: "Control", scope: "#/properties/hslaColor" },
  ],
};

const renderers = [
  ...materialRenderers,
  {
    renderer: ColorPickerRenderer,
    tester: ColorPickerRendererTester,
  },
];

const JsonFormsForColorPickerRenderer = () => {
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
type Story = StoryObj<typeof ColorPickerRenderer>;

export const Default: Story = {
  render: () => <JsonFormsForColorPickerRenderer />,
};
