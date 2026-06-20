import { Button } from "@components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = ({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {icon && <div className="mb-3 text-muted-foreground">{icon}</div>}

      <h3 className="text-[16px] font-medium">{title}</h3>

      {description && (
        <p className=" text-muted-foreground mt-1">{description}</p>
      )}

      <div className="mt-4">
        {action ?? (
          <Button asChild>
            <Link to="/products">Tiếp tục mua sắm</Link>
          </Button>
        )}
      </div>
    </div>
  );
};
