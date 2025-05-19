import { VisibilityState } from "@tanstack/table-core";

import { ColumnDefMatcher } from "./listHelper";

export type ListConfigType = {
  columnVisibility: VisibilityState;
  matcher: ColumnDefMatcher;
};
export type TableConfigRegistry = {
  default: Partial<ListConfigType>;
  [typeName: string]: Partial<ListConfigType>;
};
