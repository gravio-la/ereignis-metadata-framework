import { graviolaRenderers } from "@graviola/semantic-json-form";
import { materialRenderers } from "@jsonforms/material-renderers";

export const allRenderers = [
  ...materialRenderers,
  ...graviolaRenderers
]