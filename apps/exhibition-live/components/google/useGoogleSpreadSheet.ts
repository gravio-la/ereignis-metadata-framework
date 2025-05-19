import { useQuery } from "@graviola/edb-state-hooks";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { useEffect, useMemo, useState } from "react";

import { useGoogleToken } from "./useGoogleToken";

export const useGoogleSpreadSheet: (sheetId: string) => {
  loaded: boolean;
  sheetsByIndex: GoogleSpreadsheetWorksheet[];
  sheetsById: Record<number, GoogleSpreadsheetWorksheet>;
  title: string;
  spreadSheet: GoogleSpreadsheet;
} = (sheetId: string) => {
  const { credentials } = useGoogleToken();
  const spreadSheet = useMemo(() => {
    const doc = new GoogleSpreadsheet(sheetId, {
      token: credentials.access_token,
    });
    return doc;
  }, [sheetId, credentials.access_token]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const { data: sheetsData, isLoading: sheetsByIndexLoading } = useQuery({
    queryKey: ["sheetsByIndex", spreadSheet.spreadsheetId],
    queryFn: async () => {
      try {
        await spreadSheet.loadInfo();
      } catch (e) {
        console.error("failed to load spreadSheet", e);
        setLoaded(false);
        return;
      }
      setLoaded(true);
      return spreadSheet;
    },
    refetchOnWindowFocus: true,
  });

  const [title, setTitle] = useState("");
  useEffect(() => {
    try {
      setTitle(spreadSheet.title);
    } catch (e) {
      spreadSheet.loadInfo().then(() => setTitle(spreadSheet.title));
    }
  }, [spreadSheet, setTitle]);
  return {
    spreadSheet,
    sheetsByIndex: sheetsData?.sheetsByIndex,
    sheetsById: sheetsData?.sheetsById,
    loaded,
    title,
  };
};
