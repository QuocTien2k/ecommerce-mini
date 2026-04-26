type LoadingProps = {
  size?: "sm" | "md" | "lg";
  text?: string;
};

const sizeMap: Record<NonNullable<LoadingProps["size"]>, string> = {
  sm: "w-8 h-8",
  md: "w-16 h-16",
  lg: "w-24 h-24",
};

const Loading: React.FC<LoadingProps> = ({
  size = "md",
  text = "Loading...",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center space-y-4 bg-white/40 backdrop-blur-md">
      <svg
        aria-label={text}
        role="status"
        viewBox="0 0 256 256"
        className={`stroke-gray-600 animate-[spin_1.4s_linear_infinite] ${sizeMap[size]}`}
      >
        <line
          x1="128"
          y1="32"
          x2="128"
          y2="64"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <line
          x1="195.9"
          y1="60.1"
          x2="173.3"
          y2="82.7"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <line
          x1="224"
          y1="128"
          x2="192"
          y2="128"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <line
          x1="195.9"
          y1="195.9"
          x2="173.3"
          y2="173.3"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <line
          x1="128"
          y1="224"
          x2="128"
          y2="192"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <line
          x1="60.1"
          y1="195.9"
          x2="82.7"
          y2="173.3"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <line
          x1="32"
          y1="128"
          x2="64"
          y2="128"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <line
          x1="60.1"
          y1="60.1"
          x2="82.7"
          y2="82.7"
          strokeWidth="24"
          strokeLinecap="round"
        />
      </svg>

      <span className="text-lg font-medium text-gray-700">{text}</span>
    </div>
  );
};

export default Loading;
