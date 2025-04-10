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

import type { AppProps } from "next/app";

import NiceModal from "@ebay/nice-modal-react";
import { SnackbarProvider, useSnackbar } from "notistack";
import { appWithTranslation, UserConfig, useTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/en";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { OptionalLiveDemoEndpoint } from "../components/state";
import getConfig from "next/config";
import { BASE_IRI, PUBLIC_BASE_PATH } from "../components/config";
import {
  AdbProvider,
  EdbGlobalContextProps,
  QueryClient,
  QueryClientProvider,
  store,
} from "@graviola/edb-state-hooks";
import { useRouter } from "next/router";
import { exhibitionConfig } from "../components/config/exhibitionAppConfig";
import { envToSparqlEndpoint } from "@graviola/edb-core-utils";
import { EditEntityModal, EntityDetailModal } from "@graviola/edb-advanced-components";
import { SimilarityFinder } from "../components/form/similarity-finder";
import { useSearchParams } from "next/navigation";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeComponent } from "@graviola/edb-default-theme";
import { ModRouter } from "@graviola/semantic-jsonform-types";
import { SemanticJsonFormNoOps } from "@graviola/semantic-json-form";

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
                  <NiceModal.Provider>
                    <OptionalLiveDemoEndpoint>
                      {<Component {...pageProps} />}
                    </OptionalLiveDemoEndpoint>
                  </NiceModal.Provider>
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
