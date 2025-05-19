import { Meta, StoryObj } from "@storybook/react";

import { DiscoverSearchTable } from "./DiscoverSearchTable";

export default {
  title: "ui/form/DiscoverSearchTable",
  component: DiscoverSearchTable,
} as Meta<typeof DiscoverSearchTable>;

type Story = StoryObj<typeof DiscoverSearchTable>;

export const DiscoverSearchTableDefault: Story = {
  args: {
    typeName: "Person",
    searchString: "Marie",
  },
};

export const DiscoverSearchTableWithImage: Story = {
  args: {
    typeName: "Location",
    searchString: "New York",
  },
};
