'use client';

import React, { useMemo } from 'react'
import { AdbProvider, createSemanticConfig } from '@graviola/edb-state-hooks'
import { SparqlEndpoint } from '@graviola/edb-core-types';
import NiceModal from '@ebay/nice-modal-react';
import { SimilarityFinder } from './SimilarityFinder';
import { GlobalSemanticConfig, ModRouter } from '@graviola/semantic-jsonform-types';
import type { JSONSchema7 } from 'json-schema';
import { EditEntityModal } from './EditEntityModal';
import { SemanticJsonFormNoOps } from '@graviola/edb-linked-data-renderer';
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { RestStoreProvider } from '@graviola/rest-store-provider';
import { makeDefaultUiSchemaForAllDefinitions, makeStubSchema } from './makeDefaultUiSchemaForAllDefinitions';

export const BASE_IRI = 'https://test.example.org/';
export const entities = 'https://entities.example.org/';



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
  typeIRIToTypeName: (iri: string | undefined) => {
    if (!iri) {
      return '';
    }
    return semanticConfig.typeIRIToTypeName(iri);
  },
  typeNameToTypeIRI: (name: string | undefined) => {
    if (!name) {
      return '';
    }
    return semanticConfig.typeNameToTypeIRI(name);
  },
  createEntityIRI: (_: string, id?: string) => {
    return `${entities}${id ?? Math.random().toString(36).substring(2, 15)}`;
  },
  queryBuildOptions: {
    ...semanticConfig.queryBuildOptions,
    primaryFields: {
      "Category": {
        "label": "name",
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
  return <AdbProvider
      {...realSemanticConfig}
      env={{
        publicBasePath: '',
        baseIRI: BASE_IRI,
      }}
      lockedSPARQLEndpoint={endpoint}
      normDataMapping={{}}
      components={{
        EditEntityModal: EditEntityModal(renderers),
        EntityDetailModal: () => null,
        SemanticJsonForm: SemanticJsonFormNoOps,
        SimilarityFinder: SimilarityFinder,
      }}
      useRouterHook={useRouterMock}
      schema={schema}
      makeStubSchema={makeStubSchema}
      uiSchemaDefaultRegistry={makeDefaultUiSchemaForAllDefinitions(schema)}
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
    </AdbProvider>
}
