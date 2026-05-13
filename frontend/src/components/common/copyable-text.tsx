import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { copyToClipboard } from "@/utils/copy";

type Props = {
  value: string;
  className?: string;
};

const CopyableText = ({ value, className }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(value);

    if (!success) return;

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy"
      aria-label={`Copy ${value}`}
      className={cn(
        "group inline-flex max-w-full items-center gap-1 rounded-md transition-colors cursor-pointer",
        "font-mono text-xs text-muted-foreground",
        "hover:bg-muted/50 hover:text-foreground",
        className,
      )}
    >
      <span className="truncate">{value}</span>

      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
      ) : (
        <Copy className="w-3.5 h-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-70" />
      )}
    </button>
  );
};

export default CopyableText;
