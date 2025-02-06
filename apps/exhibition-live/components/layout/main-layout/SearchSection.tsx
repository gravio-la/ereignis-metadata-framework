import { Avatar, OutlinedInput, Popper } from "@mui/material";
// material-ui
import { styled } from "@mui/material/styles";
import { shouldForwardProp } from "@mui/system";
// assets
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "next-i18next";

// third-party
// project imports
import {
  useAdbContext,
  useGlobalSearch,
  useModifiedRouter,
} from "@graviola/edb-state-hooks";
import { encodeIRI } from "@graviola/edb-ui-utils";
import { DiscoverAutocompleteInput } from "@graviola/edb-advanced-components";

// styles
const PopperStyle = styled(Popper, { shouldForwardProp })(({ theme }) => ({
  zIndex: 1100,
  width: "99%",
  top: "-55px !important",
  padding: "0 12px",
  [theme.breakpoints.down("sm")]: {
    padding: "0 10px",
  },
}));

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(
  ({ theme }) => ({
    width: 434,
    marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 16,
    "& input": {
      background: "transparent !important",
      paddingLeft: "4px !important",
    },
    [theme.breakpoints.down("lg")]: {
      width: 250,
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: 4,
      background: "#fff",
    },
  }),
);

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(
  ({ theme }) => ({
    // @ts-ignore
    ...theme.typography.commonAvatar,
    // @ts-ignore
    ...theme.typography.mediumAvatar,
    background: theme.palette.secondary.light,
    color: theme.palette.secondary.dark,
    "&:hover": {
      background: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
    },
  }),
);

// ==============================|| SEARCH INPUT ||============================== //

export const SearchSection = () => {
  const { t } = useTranslation();
  const { search, setSearch } = useGlobalSearch();
  const router = useModifiedRouter();
  const { typeNameToTypeIRI } = useAdbContext();
  const { typeName } = router.query as { typeName: string | null | undefined };
  const classIRI: string | undefined = useMemo(
    () =>
      typeof typeName === "string" ? typeNameToTypeIRI(typeName) : undefined,
    [typeName, typeNameToTypeIRI],
  );

  const handleChange = useCallback(
    (value?: string | null) => {
      value && router.push(`/create/${typeName}?encID=${encodeIRI(value)}`);
    },
    [typeName, router],
  );

  const handleSearchTextChange = useCallback(
    (search) => {
      setSearch(search);
    },
    [setSearch],
  );

  return !typeName ? null : (
    <>
      {classIRI && typeName && (
        <DiscoverAutocompleteInput
          key={typeName}
          typeIRI={classIRI}
          limit={1000}
          condensed
          inputProps={{
            placeholder: `Suche nach ${typeName}`,
            variant: "outlined",
          }}
          title={typeName}
          typeName={typeName}
          onDebouncedSearchChange={handleSearchTextChange}
          onSelectionChange={(selection) => handleChange(selection?.value)}
        />
      )}
    </>
  );
};
