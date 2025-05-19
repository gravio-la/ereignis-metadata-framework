import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GraviolaProvider } from "./provider/GraviolaProvider";
import { bringDefinitionToTop } from "@graviola/json-schema-utils";
import "./index.css";
import App from "./App.tsx";
import { schema } from "./schema.ts";
import { allRenderers } from "./provider/config.ts";
import { generateDefaultUISchema } from "@graviola/edb-ui-utils";
// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const uischemata = {
  Item: generateDefaultUISchema(
    bringDefinitionToTop(schema as any, "Item") as any,
    {
      scopeOverride: {
        "#/properties/tags": {
          type: "Control",
          scope: "#/properties/tags",
          options: {
            chips: true,
            dropdown: true,
          },
        },
      },
    },
  ),
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GraviolaProvider
          apiBaseUrl="http://localhost:7898/query"
          schema={schema as any}
          renderers={allRenderers}
          baseIRI={"http://www.example.org/"}
          entityBaseIRI={"http://www.example.org/Item/"}
          primaryFields={{
            Category: {
              label: "name",
              description: "description",
            },
            Item: {
              label: "name",
              description: "description",
              image: "photos",
            },
            Tag: {
              label: "name",
              description: "description",
              image: "image",
            },
          }}
          typeNameLabelMap={{
            Category: "Kategorie",
            Item: "Artikel",
            Tag: "Tag",
          }}
          typeNameUiSchemaOptionsMap={{
            Category: {
              dropdown: true,
            },
            Tag: {
              chips: true,
            },
          }}
          uischemata={uischemata}
        >
          <App />
        </GraviolaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
