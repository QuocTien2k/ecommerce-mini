import type { LucideIcon } from "lucide-react";

type ProductStateProps = {
  icon: LucideIcon;
  title: string;
  desc: string;
  children?: React.ReactNode;
};

export const ProductState = ({
  icon: Icon,
  title,
  desc,
  children,
}: ProductStateProps) => {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <Icon className="size-12 text-muted-foreground" />

      <h3 className="mt-4 text-lg font-medium">{title}</h3>

      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>

      {children}
    </div>
  );
};
