import { QueryClient, QueryClientProvider } from "@graviola/edb-state-hooks";
import { Meta } from "@storybook/react";
import React, { useMemo } from "react";

import { sladb, slent } from "../../config/formConfigs";
import TypedForm from "../../content/main/TypedFormNoSSR";
import { MainLayout } from "./MainLayout";

export default {
  title: "ui/layout/MainLayout",
  component: MainLayout,
} as Meta<typeof MainLayout>;

export const MainLayoutDefault = () => <MainLayout>content</MainLayout>;

const typeName = "Exhibition",
  classIRI: string | undefined = sladb(typeName).value,
  queryClient = new QueryClient();
export const MainLayoutWithForm = () => (
  <QueryClientProvider client={queryClient}>
    <MainLayout>
      <TypedForm
        entityIRI={slent.example.value}
        typeName={typeName}
        classIRI={classIRI}
      />
    </MainLayout>
  </QueryClientProvider>
);
