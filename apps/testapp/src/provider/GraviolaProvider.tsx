'use client';

import React, { useCallback, useMemo } from 'react'
import { AdbProvider, store } from '@graviola/edb-state-hooks'
import { PrimaryFieldDeclaration, SparqlEndpoint } from '@graviola/edb-core-types';
import NiceModal from '@ebay/nice-modal-react';
import { RestStoreProvider } from '@graviola/rest-store-provider';
import { Provider } from "react-redux"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { EditEntityModal, EntityDetailModal } from '@graviola/edb-advanced-components';
import { createSemanticConfig, SemanticJsonFormNoOps, SimilarityFinder, createUISchemata, createStubSchema } from '@graviola/semantic-json-form';
import { GlobalSemanticConfig, ModRouter } from '@graviola/semantic-jsonform-types';
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { JSONSchema7 } from 'json-schema';
import { allRenderers } from './config';


type GraviolaProviderProps = {
  apiBaseUrl: string,
  baseIRI: string,
  entityBaseIRI: string,
  children: React.ReactNode,
  schema: JSONSchema7,
  renderers?: JsonFormsRendererRegistryEntry[],
  authBearerToken?: string,
  typeNameLabelMap: Record<string, string>,
  typeNameUiSchemaOptionsMap: Record<string, any>,
  primaryFields: PrimaryFieldDeclaration
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

export const GraviolaProvider: React.FC<GraviolaProviderProps> = ({
  children,
  baseIRI,
  entityBaseIRI,
  schema,
  primaryFields,
  renderers,
  apiBaseUrl,
  authBearerToken,
  typeNameLabelMap,
  typeNameUiSchemaOptionsMap,
}: GraviolaProviderProps) => {

  const endpoint: SparqlEndpoint = useMemo(() => {
    return {
      endpoint: `${apiBaseUrl}`,
      label: "REST service",
      provider: "rest",
      active: true
    }
  }, [apiBaseUrl, authBearerToken])

  const definitionToTypeIRI = (definitionName: string) => `${baseIRI}${definitionName}`;

  const { registry } = useMemo(() => createUISchemata(schema as JSONSchema7, {
    typeNameLabelMap,
    typeNameUiSchemaOptionsMap,
    definitionToTypeIRI,
  }), [schema, typeNameLabelMap, typeNameUiSchemaOptionsMap, definitionToTypeIRI]);


  const config = useMemo<GlobalSemanticConfig>(() => {
    const c = createSemanticConfig({ baseIRI })
    return ({
      ...c,
      queryBuildOptions: {
        ...c.queryBuildOptions,
        primaryFields
      }
    });
  }, [baseIRI, entityBaseIRI, primaryFields])


  const makeStubSchema = useCallback((schema: JSONSchema7) => createStubSchema(schema, {
    entityBaseIRI,
    definitionToTypeIRI,
  }), [definitionToTypeIRI, entityBaseIRI]);

  const rendererRegistry = useMemo(() => [
    ...allRenderers,
    ...(renderers || [])
  ], [renderers])

  // @ts-ignore
  return <Provider store={store}>
    <AdbProvider
      {...config}
      env={{
        publicBasePath: '',
        baseIRI,
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
      uiSchemaDefaultRegistry={registry}
      rendererRegistry={rendererRegistry}
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
