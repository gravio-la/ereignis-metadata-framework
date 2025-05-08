import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { JsonForms } from "@jsonforms/react";
import { materialRenderers } from "@jsonforms/material-renderers";
import {
  AdvancedColorPickerRenderer,
  AdvancedColorPickerRendererTester,
} from "./AdvancedColorPickerRenderer";

const meta: Meta<typeof AdvancedColorPickerRenderer> = {
  component: AdvancedColorPickerRenderer,
  title: "Components/renderer/AdvancedColorPickerRenderer",
};

const schema = {
  type: "object",
  properties: {
    // Different color formats
    hexColor: { type: "string", format: "hex" },
    rgbColor: { type: "string", format: "rgb" },
    rgbaColor: { type: "string", format: "rgba" },
    hslColor: { type: "string", format: "hsl" },
    hslaColor: { type: "string", format: "hsla" },
    // Different picker configurations
    alphaPicker: { type: "string", format: "hex" },
    blockPicker: { type: "string", format: "hex" },
    chromePicker: { type: "string", format: "hex" },
    circlePicker: { type: "string", format: "hex" },
    compactPicker: { type: "string", format: "hex" },
    githubPicker: { type: "string", format: "hex" },
    huePicker: { type: "string", format: "hex" },
    photoshopPicker: { type: "string", format: "hex" },
    sketchPicker: { type: "string", format: "hex" },
    sliderPicker: { type: "string", format: "hex" },
    swatchesPicker: { type: "string", format: "hex" },
    twitterPicker: { type: "string", format: "hex" },
  },
};

const uischema = {
  type: "VerticalLayout",
  elements: [
    // Color format examples
    {
      type: "Control",
      scope: "#/properties/hexColor",
      label: "Hex Color",
    },
    {
      type: "Control",
      scope: "#/properties/rgbColor",
      label: "RGB Color",
    },
    {
      type: "Control",
      scope: "#/properties/rgbaColor",
      label: "RGBA Color",
    },
    {
      type: "Control",
      scope: "#/properties/hslColor",
      label: "HSL Color",
    },
    {
      type: "Control",
      scope: "#/properties/hslaColor",
      label: "HSLA Color",
    },
    // Picker configuration examples
    {
      type: "Control",
      scope: "#/properties/alphaPicker",
      label: "Alpha Picker",
      options: {
        picker: {
          component: "alpha",
          props: {
            width: "316px",
            height: "16px",
            direction: "horizontal",
          },
        },
      },
    },
    {
      type: "Control",
      scope: "#/properties/blockPicker",
      label: "Block Picker",
      options: {
        picker: {
          component: "block",
          props: {
            width: "170px",
            colors: [
              "#D9E3F0",
              "#F47373",
              "#697689",
              "#37D67A",
              "#2CCCE4",
              "#555555",
              "#dce775",
              "#ff8a65",
              "#ba68c8",
            ],
            triangle: "top",
          },
        },
      },
    },
    {
      type: "Control",
      scope: "#/properties/chromePicker",
      label: "Chrome Picker",
      options: {
        picker: {
          component: "chrome",
          props: {
            disableAlpha: false,
          },
        },
      },
    },
    {
      type: "Control",
      scope: "#/properties/circlePicker",
      label: "Circle Picker",
      options: {
        picker: {
          component: "circle",
          props: {
            width: "252px",
            colors: [
              "#f44336",
              "#e91e63",
              "#9c27b0",
              "#673ab7",
              "#3f51b5",
              "#2196f3",
              "#03a9f4",
              "#00bcd4",
              "#009688",
              "#4caf50",
              "#8bc34a",
              "#cddc39",
              "#ffeb3b",
              "#ffc107",
              "#ff9800",
              "#ff5722",
              "#795548",
              "#607d8b",
            ],
            circleSize: 28,
            circleSpacing: 14,
          },
        },
      },
    },
    {
      type: "Control",
      scope: "#/properties/compactPicker",
      label: "Compact Picker",
      options: {
        picker: {
          component: "compact",
          props: {
            colors: [
              "#4D4D4D",
              "#999999",
              "#FFFFFF",
              "#F44E3B",
              "#FE9200",
              "#FCDC00",
              "#DBDF00",
              "#A4DD00",
              "#68CCCA",
              "#73D8FF",
              "#AEA1FF",
              "#FDA1FF",
              "#333333",
              "#808080",
              "#cccccc",
              "#D33115",
              "#E27300",
              "#FCC400",
              "#B0BC00",
              "#68BC00",
              "#16A5A5",
              "#009CE0",
              "#7B64FF",
              "#FA28FF",
              "#000000",
              "#666666",
              "#B3B3B3",
              "#9F0500",
              "#C45100",
              "#FB9E00",
              "#808900",
              "#194D33",
              "#0C797D",
              "#0062B1",
              "#653294",
              "#AB149E",
            ],
          },
        },
      },
    },
    {
      type: "Control",
      scope: "#/properties/githubPicker",
      label: "Github Picker",
      options: {
        picker: {
          component: "github",
          props: {
            width: "200px",
            colors: [
              "#B80000",
              "#DB3E00",
              "#FCCB00",
              "#008B02",
              "#006B76",
              "#1273DE",
              "#004DCF",
              "#5300EB",
              "#EB9694",
              "#FAD0C3",
              "#FEF3BD",
              "#C1E1C5",
              "#BEDADC",
              "#C4DEF6",
              "#BED3F3",
              "#D4C4FB",
            ],
            triangle: "top-left",
          },
        },
      },
    },
    {
      type: "Control",
      scope: "#/properties/huePicker",
      label: "Hue Picker",
      options: {
        picker: {
          component: "hue",
          props: {
            width: "316px",
            height: "16px",
            direction: "horizontal",
          },
        },
      },
    },
    {
      type: "Control",
      scope: "#/properties/photoshopPicker",
      label: "Photoshop Picker",
      options: {
        picker: {
          component: "photoshop",
          props: {
            header: "Color Picker",
          },
        },
      },
    },
    {
      type: "Control",
      scope: "#/properties/sketchPicker",
      label: "Sketch Picker",
      options: {
        picker: {
          component: "sketch",
          props: {
            disableAlpha: false,
            presetColors: [
              "#D0021B",
              "#F5A623",
              "#F8E71C",
              "#8B572A",
              "#7ED321",
              "#417505",
              "#BD10E0",
              "#9013FE",
              "#4A90E2",
              "#50E3C2",
              "#B8E986",
              "#000000",
              "#4A4A4A",
              "#9B9B9B",
              "#FFFFFF",
            ],
          },
        },
      },
    },
    {
      type: "Control",
      scope: "#/properties/sliderPicker",
      label: "Slider Picker",
      options: {
        picker: {
          component: "slider",
        },
      },
    },
    {
      type: "Control",
      scope: "#/properties/swatchesPicker",
      label: "Swatches Picker",
      options: {
        picker: {
          component: "swatches",
          props: {
            width: 320,
            height: 240,
            colors: [
              [
                "#FF6900",
                "#FCB900",
                "#7BDCB5",
                "#00D084",
                "#8ED1FC",
                "#0693E3",
                "#ABB8C3",
                "#EB144C",
                "#F78DA7",
                "#9900EF",
              ],
              [
                "#000000",
                "#434343",
                "#666666",
                "#999999",
                "#CCCCCC",
                "#EFEFEF",
                "#F3F3F3",
                "#FFFFFF",
              ],
              [
                "#FF0000",
                "#FF9900",
                "#FFFF00",
                "#00FF00",
                "#00FFFF",
                "#0000FF",
                "#9900FF",
                "#FF00FF",
              ],
            ],
          },
        },
      },
    },
    {
      type: "Control",
      scope: "#/properties/twitterPicker",
      label: "Twitter Picker",
      options: {
        picker: {
          component: "twitter",
          props: {
            width: "276px",
            colors: [
              "#FF6900",
              "#FCB900",
              "#7BDCB5",
              "#00D084",
              "#8ED1FC",
              "#0693E3",
              "#ABB8C3",
              "#EB144C",
              "#F78DA7",
              "#9900EF",
            ],
            triangle: "top-left",
          },
        },
      },
    },
  ],
};

const renderers = [
  ...materialRenderers,
  {
    renderer: AdvancedColorPickerRenderer,
    tester: AdvancedColorPickerRendererTester,
  },
];

const JsonFormsForAdvancedColorPickerRenderer = () => {
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
type Story = StoryObj<typeof AdvancedColorPickerRenderer>;

export const Default: Story = {
  render: () => <JsonFormsForAdvancedColorPickerRenderer />,
};
