import { SemanticTable } from "@graviola/edb-table-components";
import { schema } from "@slub/exhibition-schema";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import React from "react";

import { tableConfig } from "../../../components/config/tableConfig";
import { getI18nProps, mixinStaticPathsParams } from "../../../components/i18n";
import { MainLayout } from "../../../components/layout/main-layout";

type Props = {
  typeName: string;
};
export async function getStaticPaths() {
  const paths = mixinStaticPathsParams(
    Object.keys(schema.$defs || {}).map((typeName) => ({
      params: { typeName },
    })),
  );

  return { paths, fallback: false };
}

export async function getStaticProps(ctx) {
  const params = ctx?.params || {};
  const typeName = params.typeName;
  return {
    props: {
      typeName,
      ...(await getI18nProps(ctx)),
    },
  };
}
export default (props: Props) => {
  const { t } = useTranslation();
  const { typeName } = props;
  const title = `${t(typeName)} - ${t("list")}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="a knowledge base about exhibitions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <SemanticTable typeName={typeName} tableConfigRegistry={tableConfig} />
      </MainLayout>
    </>
  );
};
