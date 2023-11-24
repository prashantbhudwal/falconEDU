import { useEffect, useState } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";

export function useIsFormDirty<T extends FieldValues>(
  form: UseFormReturn<T>,
  initialValue = false
) {
  const [isDirty, setIsDirty] = useState(initialValue);

  useEffect(() => {
    if (Object.keys(form.formState.dirtyFields).length > 0) {
      setIsDirty(true);
    }
  }, [form.formState.dirtyFields]);

  return { isDirty, setIsDirty };
}
