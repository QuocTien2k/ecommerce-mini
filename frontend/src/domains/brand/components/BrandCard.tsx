import { FALLBACK_IMAGE } from "@shared/constants/image";

interface BrandCardProps {
  name: string;
  slug: string;
  thumbnail: string;
}

const BrandCard = ({ name, thumbnail }: BrandCardProps) => {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex h-16 w-full items-center justify-center">
        <img
          src={thumbnail || FALLBACK_IMAGE}
          alt={name}
          loading="lazy"
          className="max-h-full object-contain"
        />
      </div>
    </div>
  );
};

export default BrandCard;
