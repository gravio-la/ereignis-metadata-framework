import { Padding } from "@mui/icons-material";
import { ThemeExtended } from "./themeType";
import { Components } from "@mui/material";

export default function componentStyleOverrides(theme: ThemeExtended) {
  const bgColor = theme.colors?.grey50;
  const variant = theme.variant || "outlined";
  const components: Components<ThemeExtended> = {
    MuiTextField: {
      defaultProps: {
        variant,
      },
    },
    MuiSelect: {
      defaultProps: {
        variant,
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          variants: [
            {
              // avoid jammed look of input fields when variant is not 'standard'
              props: ({ variant }) => variant !== "standard",
              style: {
                marginTop: (theme) => theme.spacing(1),
                marginBottom: (theme) => theme.spacing(1),
              },
            },
          ],
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: theme.backgroundDefault,
          ".MuiTypography-root": {
            color: theme.textDark,
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          paddingTop: "12px",
          paddingBottom: "12px",
          maxHeight: "48px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: "4px",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: `${theme?.customization?.borderRadius || 0}px`,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          paddingTop: "8px",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: theme.colors?.textDark,
          padding: "0",
        },
        title: {
          fontSize: "1rem",
          fontWeight: 600,
          lineHeight: "1.235",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "0",
          "&:last-child": {
            paddingBottom: "0",
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: theme.darkTextPrimary,
          paddingTop: "10px",
          paddingBottom: "10px",
          "&.Mui-selected": {
            color: theme.menuSelected,
            backgroundColor: theme.menuSelectedBack,
            "&:hover": {
              backgroundColor: theme.menuSelectedBack,
            },
            "& .MuiListItemIcon-root": {
              color: theme.menuSelected,
            },
          },
          "&:hover": {
            backgroundColor: theme.menuSelectedBack,
            color: theme.menuSelected,
            "& .MuiListItemIcon-root": {
              color: theme.menuSelected,
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: theme.darkTextPrimary,
          "&.Mui-selected": {
            color: theme.menuSelected,
            backgroundColor: theme.menuSelectedBack,
            "&:hover": {
              backgroundColor: theme.menuSelectedBack,
            },
          },
          "&:hover": {
            backgroundColor: theme.menuSelectedBack,
            color: theme.menuSelected,
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          "&:has(.MuiListItemSecondaryAction-root)": {
            paddingRight: "70px",
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: theme.darkTextPrimary,
          minWidth: "36px",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: theme.textDark,
        },
        root: {
          ".MuiTypography-root": {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: theme.textDark,
          "&::placeholder": {
            color: theme.darkTextSecondary,
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: bgColor,
          borderRadius: `${theme?.customization?.borderRadius}px`,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.colors?.grey400,
          },
          "&:hover $notchedOutline": {
            borderColor: theme.colors?.primaryLight,
          },
          "&.MuiInputBase-multiline": {
            padding: 1,
          },
        },
        input: {
          fontWeight: 500,
          background: bgColor,
          padding: "15.5px 14px",
          borderRadius: `${theme?.customization?.borderRadius}px`,
          "&.MuiInputBase-inputSizeSmall": {
            padding: "10px 14px",
            "&.MuiInputBase-inputAdornedStart": {
              paddingLeft: 0,
            },
          },
        },
        inputAdornedStart: {
          paddingLeft: 4,
        },
        notchedOutline: {
          borderRadius: `${theme?.customization?.borderRadius}px`,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: theme.colors?.grey300,
          },
        },
        mark: {
          backgroundColor: theme.paper,
          width: "4px",
        },
        valueLabel: {
          color: theme?.colors?.primaryLight,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.divider,
          opacity: 1,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: theme.colors?.primaryDark,
          background: theme.colors?.primary200,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-deletable .MuiChip-deleteIcon": {
            color: "inherit",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          color: theme.paper,
          background: theme.colors?.grey700,
        },
      },
    },
  };
  return components;
}
