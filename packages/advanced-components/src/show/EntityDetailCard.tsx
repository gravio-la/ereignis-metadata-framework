import NiceModal from "@ebay/nice-modal-react";
import { PrimaryFieldResults } from "@graviola/edb-core-types";
import { encodeIRI } from "@graviola/edb-core-utils";
import {
  useAdbContext,
  useModalRegistry,
  useModifiedRouter,
} from "@graviola/edb-state-hooks";
import { ModRouter } from "@graviola/semantic-jsonform-types";
import { Edit } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import isString from "lodash-es/isString";
import { useTranslation } from "next-i18next";
import React, { FunctionComponent, useCallback } from "react";

import { AllPropTableProps, AllPropTable } from "./AllPropsTable";

type OwnProps = {
  typeIRI: string;
  entityIRI: string;
  cardInfo: PrimaryFieldResults<string>;
  cardActionChildren?: React.ReactNode;
  data: any;
  readonly?: boolean;
  disableInlineEditing?: boolean;
  onEditClicked?: () => void;
  tableProps?: Partial<AllPropTableProps>;
  disableLoad?: boolean;
};

export type EntityDetailCardProps = OwnProps;
export const EntityDetailCard: FunctionComponent<EntityDetailCardProps> = ({
  typeIRI,
  entityIRI,
  cardInfo,
  data,
  cardActionChildren,
  readonly,
  disableInlineEditing,
  onEditClicked,
  tableProps = {},
  disableLoad,
}) => {
  const { t } = useTranslation();
  const {
    typeIRIToTypeName,
    components: { EditEntityModal },
  } = useAdbContext();

  const { push } = useModifiedRouter();

  const { registerModal } = useModalRegistry(NiceModal);
  const editEntry = useCallback(() => {
    if (!disableInlineEditing) {
      const modalID = `edit-${typeIRI}-${entityIRI}`;
      registerModal(modalID, EditEntityModal);
      NiceModal.show(modalID, {
        entityIRI: entityIRI,
        typeIRI: typeIRI,
        data,
        disableLoad: true,
      });
    } else {
      const typeName = typeIRIToTypeName(typeIRI);
      push(`/create/${typeName}?encID=${encodeIRI(entityIRI)}`);
    }
    onEditClicked?.();
  }, [
    typeIRI,
    entityIRI,
    disableInlineEditing,
    typeIRIToTypeName,
    registerModal,
    data,
    onEditClicked,
    EditEntityModal,
    push,
  ]);

  return (
    <>
      <Card>
        {cardInfo.image && (
          <CardMedia
            component="img"
            sx={{
              maxHeight: "24em",
              objectFit: "cover",
              display: { md: "none", xs: "block" },
            }}
            image={cardInfo.image}
            alt={cardInfo.label}
          />
        )}
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            {cardInfo.label}
          </Typography>
          {isString(data?.originalTitle) ||
            isString(data?.subtitle) ||
            (cardInfo.description?.length < 300 && (
              <Typography variant="body2" color="text.secondary">
                {data?.subtitle || data?.originalTitle || cardInfo.description}
              </Typography>
            ))}
        </CardContent>
        {cardActionChildren !== null && (
          <CardActions>
            {typeof cardActionChildren !== "undefined" ? (
              cardActionChildren
            ) : (
              <>
                {!readonly && (
                  <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    onClick={editEntry}
                    startIcon={<Edit />}
                  >
                    {!disableInlineEditing ? t("edit inline") : t("edit")}
                  </Button>
                )}
              </>
            )}
          </CardActions>
        )}
      </Card>
      <AllPropTable
        allProps={data}
        disableContextMenu
        inlineEditing={true}
        {...tableProps}
      />
    </>
  );
};
