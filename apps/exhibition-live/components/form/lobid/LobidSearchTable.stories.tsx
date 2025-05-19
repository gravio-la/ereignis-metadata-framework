import React from "react";

import { sladb } from "../../config/formConfigs";
import LobidSearchTable from "./LobidSearchTable";

export default {
  title: "ui/form/LobidSearchTable",
  component: LobidSearchTable,
};

export const LobidSearchTableDefault = () => (
  <LobidSearchTable typeIRI={sladb["Person"].value} searchString={"Ada Love"} />
);
