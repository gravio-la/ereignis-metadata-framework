import React, { FunctionComponent } from "react";

export type EdbSparnaturalProps = {
  name: string;
};
export const EdbSparnatural: FunctionComponent<EdbSparnaturalProps> = ({
  name,
}) => {
  return <div>Hello {name} from @slub/edb-sparnatural Package!</div>;
};
