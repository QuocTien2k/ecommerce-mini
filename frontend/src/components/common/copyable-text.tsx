import { copyToClipboard } from "@/utils/copy";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

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
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1 font-mono text-xs hover:bg-muted/50 hover:text-foreground transition cursor-pointer ${className}`}
    >
      <span>{value}</span>

      {copied ? (
        <Check className="w-3 h-3 text-green-600" />
      ) : (
        <Copy className="w-3 h-3 opacity-40 group-hover:opacity-80 transition" />
      )}
    </button>
  );
};

export default CopyableText;
