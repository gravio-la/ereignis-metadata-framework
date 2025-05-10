---
to: packages/form-renderer/<%= name.split("/")[1] %>/src/<%= h.changeCase.pascal(name.split("/")[1]) %>.tsx
---
<%
  const packageName = name.split("/")[1];
  const ComponentName = h.changeCase.pascal(packageName);
%>
import { ControlProps, RankedTester, rankWith, isStringControl } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import {
  FormControl,
  TextField,
} from "@mui/material";
import merge from "lodash-es/merge";
import React, { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";

const <%= ComponentName %>Component = (props: ControlProps) => {
  const {
    id,
    errors,
    schema,
    uischema,
    visible,
    required,
    config,
    data,
    handleChange,
    path,
  } = props;
  const isValid = errors.length === 0;
  const { t } = useTranslation();
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const handleChange_ = useCallback(
    (v?: string) => {
      handleChange(path, v);
    },
    [path, handleChange],
  );

  if (!visible) {
    return null;
  }

  return (
    <FormControl
      fullWidth={!appliedUiSchemaOptions.trim}
      id={id}
      sx={(theme) => ({
        marginBottom: theme.spacing(2),
      })}
    >
       <TextField
         label={schema.title || t("implement your own renderer")}
         onChange={(e) => handleChange_(e.target.value)}
         value={data}
         fullWidth={true}
       />
    </FormControl>
  );
};

export const <%= ComponentName %> = withJsonFormsControlProps(<%= ComponentName %>Component);

export const <%= ComponentName %>Tester: RankedTester = rankWith(
  10,
  isStringControl,
);
