import "vis-timeline/styles/vis-timeline-graph2d.css";
import "../styles/jquery.typeahead.min.css";
import "../styles/jquery-ui.min.css";
import "../styles/highlight.min.css";
import "../styles/tooltipster.bundle.min.css";
import "../styles/tooltipster-sideTip-shadow.min.css";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@triply/yasgui/build/yasgui.min.css";
import "leaflet/dist/leaflet.css";
import "react-json-view-lite/dist/index.css";
import "dayjs/locale/de";
import "dayjs/locale/en";

import NiceModal from "@ebay/nice-modal-react";
import {
  EditEntityModal,
  EntityDetailModal,
} from "@graviola/edb-advanced-components";
import { envToSparqlEndpoint } from "@graviola/edb-core-utils";
import { ThemeComponent } from "@graviola/edb-default-theme";
import {
  AdbProvider,
  EdbGlobalContextProps,
  QueryClient,
  QueryClientProvider,
  store,
} from "@graviola/edb-state-hooks";
import { SemanticJsonFormNoOps } from "@graviola/semantic-json-form";
import { ModRouter } from "@graviola/semantic-jsonform-types";
import { SparqlStoreProvider } from "@graviola/sparql-store-provider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dayjs from "dayjs";
import type { AppProps } from "next/app";
import getConfig from "next/config";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { appWithTranslation, UserConfig, useTranslation } from "next-i18next";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useEffect } from "react";
import { Provider } from "react-redux";

import { BASE_IRI, PUBLIC_BASE_PATH } from "../components/config";
import { exhibitionConfig } from "../components/config/exhibitionAppConfig";
import { SimilarityFinder } from "../components/form/similarity-finder";
import { OptionalLiveDemoEndpoint } from "../components/state";
import nextI18NextConfig from "../next-i18next.config";

export const queryClient = new QueryClient();
const QueryClientProviderWrapper = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const sparqlEndpoint = envToSparqlEndpoint(getConfig().publicRuntimeConfig);

const useNextRouterHook: () => ModRouter = () => {
  const { query, asPath, push, replace, pathname } = useRouter();
  const searchParams = useSearchParams();
  return { query, asPath, push, replace, pathname, searchParams };
};

function App({ Component, pageProps }: AppProps) {
  const { i18n } = useTranslation();
  useEffect(() => {
    dayjs.locale(i18n.language in ["en", "de"] ? i18n.language : "en");
  }, [i18n.language]);
  return (
    <QueryClientProviderWrapper>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider store={store}>
          <ThemeComponent>
            <SnackbarProvider>
              <AdbProvider
                {...exhibitionConfig}
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
                useSnackbar={useSnackbar}
                useRouterHook={useNextRouterHook}
              >
                <GoogleOAuthProvider
                  clientId={process.env.NEXT_PUBLIC_GAPI_OAUTH_CLIENT_ID}
                >
                  <SparqlStoreProvider
                    endpoint={sparqlEndpoint}
                    defaultLimit={100}
                  >
                    <NiceModal.Provider>
                      <OptionalLiveDemoEndpoint>
                        {<Component {...pageProps} />}
                      </OptionalLiveDemoEndpoint>
                    </NiceModal.Provider>
                  </SparqlStoreProvider>
                </GoogleOAuthProvider>
              </AdbProvider>
            </SnackbarProvider>
          </ThemeComponent>
          <ReactQueryDevtools initialIsOpen={false} />
        </Provider>
      </LocalizationProvider>
    </QueryClientProviderWrapper>
  );
}

// @ts-ignore
export default appWithTranslation(App, nextI18NextConfig as any as UserConfig);
