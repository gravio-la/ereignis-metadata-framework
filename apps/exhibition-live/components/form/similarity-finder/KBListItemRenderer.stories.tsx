import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { BasicThingInformation } from "@slub/edb-core-types";
import { KBListItemRenderer } from "./KBListItemRenderer";

export default {
  title: "ui/components/similarity-finder/KBListItemRenderer",
  component: KBListItemRenderer,
} as Meta<typeof KBListItemRenderer>;

type Story = StoryObj<typeof KBListItemRenderer>;

const sampleData: BasicThingInformation = {
  id: "example-id",
  label: "Example Label",
  avatar: "http://example.com/avatar.png",
  secondary: "Additional Information",
};

export const Primary: Story = {
  args: {
    data: sampleData,
    idx: 1,
    typeIRI: "http://example.org/type",
    selected: false,
  },
};
