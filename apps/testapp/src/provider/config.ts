import { materialRenderers } from "@jsonforms/material-renderers";
import { graviolaRenderers } from "./graviolaRenderer";

export const BASE_IRI = 'https://ausleihe.freie-theater-sachsen.de/';
export const entities = 'https://ausleihe.freie-theater-sachsen.de/';

export const allRenderers = [
  ...materialRenderers,
  ...graviolaRenderers
]