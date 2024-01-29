import { useEffect, useState } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";

export function useIsFormDirty<T extends FieldValues>(
  form: UseFormReturn<T>,
  initialValue = false,
) {
  const [isDirty, setIsDirty] = useState(initialValue);

  // using form.watch inside useEffect cause of it's weird behaviour coupled with form.formState it wont change the state after just one change you have to do at least 2 changes inside form to see a change in state
  useEffect(() => {
    if (Object.keys(form.formState.dirtyFields).length > 0) {
      setIsDirty(true);
    }
    form.watch(() => {
      if (Object.keys(form.formState.dirtyFields).length > 0) {
        setIsDirty(true);
      }
    });
  }, [form.formState.dirtyFields, form]);

  return { isDirty, setIsDirty };
}
