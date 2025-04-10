import { graviolaRenderers } from "@graviola/semantic-json-form";
import { materialRenderers } from "@jsonforms/material-renderers";

export const BASE_IRI = 'https://ausleihe.freie-theater-sachsen.de/';
export const entities = 'https://ausleihe.freie-theater-sachsen.de/';

export const allRenderers = [
  ...materialRenderers,
  ...graviolaRenderers
]