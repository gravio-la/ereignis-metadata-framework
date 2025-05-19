import Head from "next/head";
import { useTranslation } from "next-i18next";
import React from "react";

import { Dashboard } from "../../components/content/main/Dashboard";
import { getI18nProps, mixinStaticPathsParams } from "../../components/i18n";
import { MainLayout } from "../../components/layout/main-layout";

export async function getStaticPaths() {
  const paths = mixinStaticPathsParams([
    {
      params: {},
    },
  ]);

  return { paths, fallback: false };
}

export async function getStaticProps(ctx) {
  return {
    props: {
      ...(await getI18nProps(ctx)),
    },
  };
}

export default () => {
  const { t } = useTranslation("translation");
  const title = `${t("exhibition database")}`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="a knowledge base about exhibitions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </>
  );
};
