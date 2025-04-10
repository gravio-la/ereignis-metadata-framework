import { createContext, useContext } from "react";
import type {
  EditEntityModalProps,
  EntityDetailModalProps,
  GlobalAppConfig,
  ModRouter,
  SemanticJsonFormNoOpsProps,
  SimilarityFinderProps,
  SnackbarFacade,
} from "@graviola/semantic-jsonform-types";
import { NiceModalHocProps } from "@ebay/nice-modal-react";
import { SparqlEndpoint } from "@graviola/edb-core-types";

/**
 * Context for the ADB
 *
 * @param queryBuildOptions Options passed to the query builder
 * @param typeNameToTypeIRI Mapping from type name within Schema to a class IRI
 * @param lockedSPARQLEndpoint Optional locked SPARQL endpoint
 * @param useRouterHook Pass the hook needed for your framework specific routing (next router, react-router-dom,...)
 */
export type AdbContextValue<DeclarativeMappingType> =
  GlobalAppConfig<DeclarativeMappingType> & {
    lockedSPARQLEndpoint?: SparqlEndpoint;
    env: {
      publicBasePath: string;
      baseIRI: string;
    };
    components: {
      EditEntityModal: React.FC<EditEntityModalProps & NiceModalHocProps>;
      EntityDetailModal: React.FC<EntityDetailModalProps & NiceModalHocProps>;
      SemanticJsonForm: React.FC<SemanticJsonFormNoOpsProps>;
      SimilarityFinder: React.FC<SimilarityFinderProps>;
    };
    useSnackbar: () => SnackbarFacade;
    useRouterHook: () => ModRouter;
  };

export type EdbGlobalContextProps<DeclarativeMappingType> =
  Omit<AdbContextValue<DeclarativeMappingType>, "useSnackbar"> & {
    children: React.ReactNode;
    useSnackbar?: () => SnackbarFacade;
  };

export const AdbContext = createContext<AdbContextValue<any>>(null);

const useSnackbarFallback: () => SnackbarFacade = () => {
  return { enqueueSnackbar: (_1, _2) => {return null}, closeSnackbar: (_) => {} };
};

export const AdbProvider = <DeclarativeMappingType,>({
  children,
  ...rest
}: EdbGlobalContextProps<DeclarativeMappingType>) => {
  return <AdbContext.Provider value={{...rest, useSnackbar: rest.useSnackbar ?? useSnackbarFallback}}>{children}</AdbContext.Provider>;
};

export const useAdbContext = <DeclarativeMappingType,>() =>
  useContext(AdbContext) as AdbContextValue<DeclarativeMappingType>;
