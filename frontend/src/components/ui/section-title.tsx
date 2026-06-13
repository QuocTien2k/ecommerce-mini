type SectionTitleProps = {
  title: string;
  description?: string;
};

export const SectionTitle = ({ title, description }: SectionTitleProps) => {
  return (
    <div className="space-y-2 text-center">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
