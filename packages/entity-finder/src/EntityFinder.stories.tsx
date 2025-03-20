import { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { EntityFinder, EntityFinderProps } from "./EntityFinder";

const meta: Meta<typeof EntityFinder> = {
  component: EntityFinder,
  title: "Components/EntityFinder",
  argTypes: {
    name: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof EntityFinder>;

export const Default: Story = {
  args: {
    name: "World",
  },
};

export const CustomName: Story = {
  args: {
    name: "Storybook",
  },
};

export const LongName: Story = {
  args: {
    name: "This is a very long name to test wrapping",
  },
};
