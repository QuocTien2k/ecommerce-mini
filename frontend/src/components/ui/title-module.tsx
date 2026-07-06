import { cn } from "@lib/utils";

type PageTitleProps = {
  title: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export const Title = ({
  title,
  description,
  titleClassName,
  descriptionClassName,
}: PageTitleProps) => {
  return (
    <div className="space-y-1">
      <h2
        className={cn("text-2xl font-semibold tracking-tight", titleClassName)}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn("text-sm text-muted-foreground", descriptionClassName)}
        >
          {description}
        </p>
      )}
    </div>
  );
};
