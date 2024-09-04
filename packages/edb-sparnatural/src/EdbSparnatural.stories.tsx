import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { EdbSparnatural, EdbSparnaturalProps } from "./EdbSparnatural";

const meta: Meta<typeof EdbSparnatural> = {
  component: EdbSparnatural,
  title: "Components/EdbSparnatural",
  argTypes: {
    name: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof EdbSparnatural>;

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
