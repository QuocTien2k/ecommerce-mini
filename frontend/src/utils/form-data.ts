export const buildFormData = <T extends object>(
  data: T,
  files?: Record<string, File | File[]>,
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // object / array
    if (
      typeof value === "object" &&
      !(value instanceof File) &&
      !Array.isArray(value)
    ) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    // array value
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  if (files) {
    Object.entries(files).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((file) => {
          formData.append(key, file);
        });

        return;
      }

      formData.append(key, value);
    });
  }

  return formData;
};

export const appendArrayField = (
  formData: FormData,
  key: string,
  values?: string[],
) => {
  if (!values?.length) return;

  formData.delete(key);

  values.forEach((value) => {
    formData.append(key, value);
  });
};
