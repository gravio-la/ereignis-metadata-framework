import { JsonFormsCore, JsonSchema } from "@jsonforms/core";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { FunctionComponent, useCallback } from "react";

import { useSettings } from "../../state";

interface OwnProps {}

type Props = OwnProps;

const schema: JsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    apiKey: {
      type: "string",
    },
  },
};

const GoogleDriveSettingsForm: FunctionComponent<Props> = (props) => {
  const { googleDrive, setGoogleDriveConfig } = useSettings();

  const handleFormChange = useCallback(
    (state: Pick<JsonFormsCore, "data" | "errors">) => {
      setGoogleDriveConfig(state.data);
    },
    [setGoogleDriveConfig],
  );
  return (
    <Box>
      <Typography variant="h2">Google Drive API Einstellungen</Typography>
      <JsonForms
        data={googleDrive}
        schema={schema}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={handleFormChange}
      />
    </Box>
  );
};

export default GoogleDriveSettingsForm;
