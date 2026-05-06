import { Spinner } from "./spinner";

type Props = {
  text?: string;
};

export const SpinnerOverlay = ({ text = "Đang tải..." }: Props) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-md">
      <div className="bg-white/70 px-4 py-2 rounded-lg shadow-sm">
        <Spinner size="sm" label={text} />
      </div>
    </div>
  );
};
