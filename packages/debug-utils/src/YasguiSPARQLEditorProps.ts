import type Yasgui from "@triply/yasgui";
import { Prefixes } from "@graviola/edb-core-types";

export type YasguiSPARQLEditorProps = {
  onInit?: (yasgu: Yasgui) => void;
  prefixes?: Prefixes;
};
