import Editor from "./Editor";
import { Controller, type Control } from "react-hook-form";

type EditorControllerProps = {
  name: string;
  control: Control<any>;
  editable?: boolean;
};

export default function EditorController({
  name,
  control,
  editable = true,
}: EditorControllerProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Editor
          value={field.value}
          onChange={field.onChange}
          editable={editable}
        />
      )}
    />
  );
}
