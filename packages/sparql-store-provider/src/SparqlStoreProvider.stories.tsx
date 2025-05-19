import { Meta, StoryObj } from "@storybook/react";

import {
  SparqlStoreProvider,
  SparqlStoreProviderProps,
} from "./SparqlStoreProvider";

const meta: Meta<typeof SparqlStoreProvider> = {
  component: SparqlStoreProvider,
  title: "Providers/SparqlStoreProvider",
};

export default meta;
type Story = StoryObj<typeof SparqlStoreProvider>;

export const Default: Story = {
  args: {
    endpoint: {
      label: "Oxigraph",
      endpoint: "http://localhost:7878/query",
      provider: "oxigraph",
      active: true,
    },
  },
};

export const Qlever: Story = {
  args: {
    endpoint: {
      label: "Qlever",
      endpoint: "http://localhost:7200/sparql",
      provider: "qlever",
      active: true,
    },
  },
};

export const Allegro: Story = {
  args: {
    endpoint: {
      label: "Allegro",
      endpoint: "http://localhost:7878/sparql",
      provider: "allegro",
      active: true,
    },
  },
};
