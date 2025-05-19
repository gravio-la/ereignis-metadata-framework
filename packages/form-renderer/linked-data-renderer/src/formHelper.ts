import { isDescriptionHidden } from "@jsonforms/core";
import { useFocus } from "@jsonforms/material-renderers";
import merge from "lodash-es/merge";

type UseFormHelperProps = {
  description?: string;
  errors?: string[];
  config: any;
  uischema: any;
  visible?: boolean;
};

type UseFormHelper = (props: UseFormHelperProps) => {
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  isValid: boolean;
  firstFormHelperText: string;
  secondFormHelperText: string;
  showDescription: boolean;
};

export const useFormHelper: UseFormHelper = ({
  errors,
  config,
  uischema,
  visible,
  description,
}) => {
  const [focused, onFocus, onBlur] = useFocus();
  const isValid = errors?.length === 0;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription,
  );

  const firstFormHelperText = showDescription
    ? description
    : !isValid
      ? errors?.join(", ")
      : null;
  const secondFormHelperText =
    showDescription && !isValid ? errors?.join(", ") : null;

  return {
    focused,
    onFocus,
    onBlur,
    isValid,
    firstFormHelperText,
    secondFormHelperText,
    showDescription,
  };
};
