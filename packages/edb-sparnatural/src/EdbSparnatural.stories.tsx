import { Meta, StoryObj } from "@storybook/react";
import { EdbSparnatural } from "./EdbSparnatural";

const meta: Meta<typeof EdbSparnatural> = {
  component: EdbSparnatural,
  title: "Components/EdbSparnatural"
};

export default meta;
type Story = StoryObj<typeof EdbSparnatural>;

export const Default: Story = {
  args: {
  },
};
