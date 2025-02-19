import {
  AdbProvider,
  store,
  useOxigraph,
  useRDFDataSources,
} from "@graviola/edb-state-hooks";
import { Provider } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import "dayjs/locale/en";
import { BASE_IRI, PUBLIC_BASE_PATH } from "../components/config";
import { EditEntityModal } from "../components/form/edit/EditEntityModal";
import { SnackbarProvider } from "notistack";
import { useRouterHook } from "./useRouterHook";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { exhibitionConfig } from "../components/config/exhibitionAppConfig";
import { kulinarikAppConfig } from "../components/config/kulinarikAppConfig";
import { envToSparqlEndpoint } from "@graviola/edb-ui-utils";
import { EntityDetailModal } from "@graviola/edb-advanced-components";
import { SimilarityFinder } from "../components/form/similarity-finder";
import { SemanticJsonFormNoOps } from "@graviola/edb-linked-data-renderer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import NiceModal from "@ebay/nice-modal-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeComponent } from "@graviola/edb-default-theme";

import "react-json-view-lite/dist/index.css";
import "@triply/yasgui/build/yasgui.min.css";
import { availableAuthorityMappings } from "@slub/exhibition-schema";
import { Box, CircularProgress } from "@mui/material";

export const queryClient = new QueryClient();

const sparqlEndpoint = envToSparqlEndpoint(import.meta.env, "VITE");
console.log("sparqlEndpoint", import.meta.env);
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const appConfig =
  import.meta.env.VITE_APP_MANIFESTATION === "kulinarik"
    ? kulinarikAppConfig
    : exhibitionConfig;

const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

const OxigraphProvider = ({ children }: { children?: React.ReactNode }) => {
  const { oxigraph } = useOxigraph();
  if (!oxigraph?.ao) {
    return <Loading />;
  }

  return <>{children}</>;
};

const OxigraphInit = ({ children }: { children?: React.ReactNode }) => {
  const { bulkLoaded } = useRDFDataSources(
    "/ontology/exhibition-info.owl.ttl",
    BASE_IRI,
  );
  const { bulkLoaded: bulkLoaded2 } = useRDFDataSources(
    "/example-exhibitions.ttl",
    BASE_IRI,
  );
  if (!bulkLoaded || !bulkLoaded2) {
    return <Loading />;
  }
  return <>{children}</>;
};

export const App = ({ children }: { children?: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider store={store}>
          <ThemeComponent>
            <SnackbarProvider>
              <AdbProvider
                {...appConfig}
                lockedSPARQLEndpoint={sparqlEndpoint}
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
                useRouterHook={useRouterHook}
                normDataMapping={availableAuthorityMappings}
              >
                <GoogleOAuthProvider clientId={googleClientId}>
                  <OxigraphProvider>
                    <OxigraphInit>
                      <NiceModal.Provider>{children}</NiceModal.Provider>
                    </OxigraphInit>
                  </OxigraphProvider>
                </GoogleOAuthProvider>
              </AdbProvider>
            </SnackbarProvider>
          </ThemeComponent>
        </Provider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};
