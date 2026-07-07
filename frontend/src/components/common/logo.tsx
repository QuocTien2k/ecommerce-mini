import { useGetSetting } from "@/domains/setting/hooks/useSetting";
import { Link } from "react-router-dom";

type SiteLogoProps = {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
};

export const SiteLogo = ({
  className,
  imageClassName,
  textClassName,
}: SiteLogoProps) => {
  const { data: setting } = useGetSetting();

  return (
    <Link to="/" className={`inline-flex items-center ${className ?? ""}`}>
      {/* {setting?.logo ? (
        <img
          src={setting.logo}
          alt={setting.siteName}
          className={imageClassName}
        />
      ) : (
        <span className={textClassName}>
          {setting?.siteName ?? "TechStore"}
        </span>
      )} */}
      <h1 className="text-3xl font-black tracking-tight">
        <span className="text-primary">Tech</span>
        <span className="text-foreground">Store</span>
      </h1>
    </Link>
  );
};
