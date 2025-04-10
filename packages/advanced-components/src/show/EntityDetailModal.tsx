import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { PrimaryField, PrimaryFieldResults } from "@graviola/edb-core-types";
import { filterUndefOrNull } from "@graviola/edb-core-utils";
import {
  applyToEachField,
  extractFieldIfString,
} from "@graviola/edb-data-mapping";
import {
  useAdbContext,
  useCRUDWithQueryClient,
} from "@graviola/edb-state-hooks";
import {
  useExtendedSchema,
  useTypeIRIFromEntity,
} from "@graviola/edb-state-hooks";
import { EntityDetailModalProps } from "@graviola/semantic-jsonform-types";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useCallback, useMemo, useState } from "react";

import { EntityDetailCard } from "./EntityDetailCard";

export const EntityDetailModal = NiceModal.create(
  ({
    typeIRI,
    entityIRI,
    data: defaultData,
    disableLoad,
    readonly,
    disableInlineEditing,
  }: EntityDetailModalProps) => {
    const {
      queryBuildOptions: { primaryFields },
      typeIRIToTypeName,
    } = useAdbContext();
    const modal = useModal();

    const handleClose = useCallback(() => {
      modal.reject();
      modal.remove();
    }, [modal]);

    const classIRI = useTypeIRIFromEntity(entityIRI, typeIRI, disableLoad);
    const typeName = useMemo(
      () => typeIRIToTypeName(classIRI),
      [classIRI, typeIRIToTypeName],
    );
    const loadedSchema = useExtendedSchema({ typeName });
    const {
      loadQuery: { data: rawData },
    } = useCRUDWithQueryClient({
      entityIRI,
      typeIRI: classIRI,
      schema: loadedSchema,
      queryOptions: {
        enabled: !disableLoad,
        refetchOnWindowFocus: true,
        initialData: defaultData,
      },
      loadQueryKey: "show",
    });
    const { t } = useTranslation();
    const data = rawData?.document || defaultData;
    const cardInfo = useMemo<PrimaryFieldResults<string>>(() => {
      const fieldDecl = primaryFields[typeName];
      if (data && fieldDecl)
        return applyToEachField(data, fieldDecl, extractFieldIfString);
      return {
        label: null,
        description: null,
        image: null,
      };
    }, [typeName, data, primaryFields]);

    const [aboutToRemove, setAboutToRemove] = useState(false);
    const removeSlowly = useCallback(() => {
      if (aboutToRemove) return;
      setAboutToRemove(true);
      setTimeout(() => {
        handleClose();
        setAboutToRemove(false);
      }, 500);
    }, [modal, setAboutToRemove, aboutToRemove]);

    const fieldDeclaration = useMemo(
      () => primaryFields[typeName] as PrimaryField,
      [typeName, primaryFields],
    );
    const disabledProperties = useMemo(
      () => filterUndefOrNull(Object.values(fieldDeclaration || {})),
      [fieldDeclaration],
    );

    return (
      <Dialog
        open={modal.visible}
        onClose={handleClose}
        scroll={"paper"}
        disableScrollLock={false}
        maxWidth={false}
        sx={{
          transition: "opacity 0.5s",
          opacity: aboutToRemove ? 0 : 1,
        }}
      >
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit" component="div">
              {cardInfo.label}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex" }}>
              <IconButton
                size="large"
                aria-label={t("close")}
                onClick={handleClose}
                color="inherit"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <EntityDetailCard
            typeIRI={classIRI}
            entityIRI={entityIRI}
            data={data}
            cardInfo={cardInfo}
            disableInlineEditing={disableInlineEditing}
            readonly={readonly}
            onEditClicked={removeSlowly}
            tableProps={{ disabledProperties }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("cancel")}</Button>
        </DialogActions>
      </Dialog>
    );
  },
);
