import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@graviola/edb-state-hooks";

import { BASE_IRI, PUBLIC_BASE_PATH } from "../components/config";
import { AdbProvider, store } from "@graviola/edb-state-hooks";
import { EditEntityModal } from "../components/form/edit/EditEntityModal";
import { EntityDetailModal } from "@graviola/edb-advanced-components";
import { Provider } from "react-redux";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { exhibitionConfig } from "../components/config/exhibitionAppConfig";
import { SemanticJsonFormNoOps } from "@graviola/edb-linked-data-renderer";
import { SimilarityFinder } from "../components/form/similarity-finder/SimilarityFinder";
import { ThemeComponent } from "@graviola/edb-default-theme";
import { LocalOxigraphStoreProvider } from "@graviola/local-oxigraph-store-provider";
import NiceModal from "@ebay/nice-modal-react";
import "react-json-view-lite/dist/index.css";

export const parameters = {
  nextRouter: {
    Provider: AppRouterContext.Provider, // next 13 next 13 (using next/navigation)
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const queryClient = new QueryClient();

export const useRouterMock = () => {
  return {
    push: async (url) => {
      console.log("push", url);
    },
    replace: async (url) => {
      console.log("replace", url);
    },
    asPath: "",
    pathname: "",
    query: {},
  };
};

export const withMuiTheme = (Story) => {
  return (
    <Provider store={store}>
      <AdbProvider
        {...exhibitionConfig}
        lockedSPARQLEndpoint={{
          endpoint: "https://ausstellungsdatenbank.kuenste.live/query",
          //endpoint: "http://localhost:7878/query",
          label: "Remote",
          provider: "oxigraph",
        }}
        env={{
          publicBasePath: PUBLIC_BASE_PATH,
          baseIRI: BASE_IRI,
        }}
        components={{
          EntityDetailModal: EntityDetailModal,
          EditEntityModal: EditEntityModal,
          SemanticJsonForm: SemanticJsonFormNoOps,
          SimilarityFinder: SimilarityFinder,
        }}
        useRouterHook={useRouterMock}
      >
        <ThemeComponent>
          <QueryClientProvider client={queryClient}>
            <LocalOxigraphStoreProvider
              endpoint={{
                endpoint: "urn:worker",
                label: "Local",
                provider: "oxigraph",
              }}
              defaultLimit={10}
            >
              <NiceModal.Provider>
                <CssBaseline />
                <Story />
              </NiceModal.Provider>
            </LocalOxigraphStoreProvider>
          </QueryClientProvider>
        </ThemeComponent>
      </AdbProvider>
    </Provider>
  );
};

export const decorators = [withMuiTheme];
