'use client';

import React, { useMemo } from 'react'
import { AdbProvider, store } from '@graviola/edb-state-hooks'
import { SparqlEndpoint } from '@graviola/edb-core-types';
import NiceModal from '@ebay/nice-modal-react';
import { RestStoreProvider } from '@graviola/rest-store-provider';
import { makeStubSchema, uiSchemata } from './schemaHelper';
import { Provider } from "react-redux"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { EditEntityModal, EntityDetailModal } from '@graviola/edb-advanced-components';
import { createSemanticConfig, SemanticJsonFormNoOps, SimilarityFinder } from '@graviola/semantic-json-form';
import { BASE_IRI, entities } from './config';
import { GlobalSemanticConfig, ModRouter } from '@graviola/semantic-jsonform-types';
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { JSONSchema7 } from 'json-schema';


type GraviolaProviderProps = {
  apiBaseUrl: string,
  children: React.ReactNode,
  schema: JSONSchema7,
  renderers: JsonFormsRendererRegistryEntry[],
  authBearerToken?: string
}

const semanticConfig = createSemanticConfig({
  baseIRI: BASE_IRI
})

const realSemanticConfig: GlobalSemanticConfig = {
  ...semanticConfig,
  createEntityIRI: (_: string, id?: string) => {
    return `${entities}${id ?? Math.random().toString(36).substring(2, 15)}`;
  },
  queryBuildOptions: {
    ...semanticConfig.queryBuildOptions,
    primaryFields: {
      "Category": {
        "label": "name",
        "description": "description"
      },
      "Item": {
        "label": "name",
        "description": "description",
        "image": "photos"
      }
    }
  }
}

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
    searchParams: {},
  } as ModRouter;
};

export const GraviolaProvider: React.FC<GraviolaProviderProps> = ({ children, schema, renderers, apiBaseUrl, authBearerToken }: GraviolaProviderProps) => {

  const endpoint: SparqlEndpoint = useMemo(() => {
    return {
      endpoint: `${apiBaseUrl}`,
      label: "REST service",
      provider: "rest",
      active: true
    }
  }, [apiBaseUrl, authBearerToken])

  // @ts-ignore
  return <Provider store={store}>
    <AdbProvider
      {...realSemanticConfig}
      env={{
        publicBasePath: '',
        baseIRI: BASE_IRI,
      }}
      components={{
        EditEntityModal: EditEntityModal,
        EntityDetailModal: EntityDetailModal,
        SemanticJsonForm: SemanticJsonFormNoOps,
        SimilarityFinder: SimilarityFinder,
      }}
      useRouterHook={useRouterMock}
      schema={schema}
      makeStubSchema={makeStubSchema}
      uiSchemaDefaultRegistry={uiSchemata.registry}
      rendererRegistry={renderers}
    >
      <RestStoreProvider
        endpoint={endpoint}
        defaultLimit={20}
        requestOptions={authBearerToken ? {
          headers: {
            Authorization: `Bearer ${authBearerToken}`
          }
        } : undefined}
      >
        <NiceModal.Provider>
          {children}
        </NiceModal.Provider>
      </RestStoreProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </AdbProvider>

  </Provider>
}
