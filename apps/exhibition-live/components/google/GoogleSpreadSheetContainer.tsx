import { Box } from "@mui/material";
import React, { FC } from "react";

import { SpreadSheetWorkSheetView } from "./SpreadSheetWorkSheetView";
import { useGoogleSpreadSheet } from "./useGoogleSpreadSheet";

export type GoogleSpreadSheetContainerProps = {
  documentId: string;
  sheetId: number;
  mappingId: string;
};
export const GoogleSpreadSheetContainer: FC<
  GoogleSpreadSheetContainerProps
> = ({ documentId, sheetId, mappingId }) => {
  const { sheetsById, loaded } = useGoogleSpreadSheet(documentId);
  return (
    loaded && (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          maxHeight: "100%",
          overflow: "auto",
        }}
      >
        <SpreadSheetWorkSheetView
          workSheet={sheetsById[sheetId]}
          mappingId={mappingId}
        />
      </Box>
    )
  );
};
