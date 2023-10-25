import { useState } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";

export function useIsFormDirty<T extends FieldValues>(
  form: UseFormReturn<T>,
  initialValue = false
) {
  const [isDirty, setIsDirty] = useState(initialValue);

  form.watch(() => {
    setIsDirty(true);
  });

  return { isDirty, setIsDirty };
}
