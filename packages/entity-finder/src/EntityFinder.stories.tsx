import { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { EntityFinder } from "./EntityFinder";

const sladb = (name: string) =>
  `http://ontologies.slub-dresden.de/exhibition#${name}`;

const meta: Meta<typeof EntityFinder> = {
  component: EntityFinder,
  title: "Components/EntityFinder",
};

export default meta;
type Story = StoryObj<typeof EntityFinder>;

export const Default: Story = {
  args: {
    classIRI: sladb("Exhibition"),
  },
};

export const PersonFinder: Story = {
  args: {
    classIRI: sladb("Person"),
  },
};
