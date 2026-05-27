type FieldErrorProps = {
  error?: {
    message?: string;
  } | null;
};

export const FieldError = ({ error }: FieldErrorProps) => {
  if (!error?.message) return null;

  return <p className="text-sm text-red-500">{error.message}</p>;
};
