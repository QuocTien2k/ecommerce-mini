import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Setting } from "@/domains/setting/types/setting.type";

type AdminSettingCardProps = {
  setting: Setting;
};

const AdminSettingCard = ({ setting }: AdminSettingCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Thông tin cấu hình
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Logo */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">
            Logo
          </h3>

          {setting.logo ? (
            <div className="w-40 h-24 rounded-lg border p-2 flex items-center justify-center">
              <img
                src={setting.logo}
                alt={setting.siteName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có logo</p>
          )}
        </div>

        {/* Thông tin chung */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoItem label="Tên website" value={setting.siteName} />
          <InfoItem label="Email" value={setting.email} />
          <InfoItem label="Hotline 1" value={setting.hotline1} />
          <InfoItem label="Hotline 2" value={setting.hotline2} />
          <InfoItem label="Địa chỉ" value={setting.address} />
          <InfoItem label="Giờ làm việc" value={setting.workingHours} />
        </div>

        {/* Mạng xã hội */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">
            Liên kết mạng xã hội
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoItem label="Facebook" value={setting.facebookUrl} isLink />
            <InfoItem label="YouTube" value={setting.youtubeUrl} isLink />
            <InfoItem label="TikTok" value={setting.tiktokUrl} isLink />
            <InfoItem label="Zalo" value={setting.zaloUrl} isLink />
            <InfoItem label="Google Map" value={setting.googleMapUrl} isLink />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type InfoItemProps = {
  label: string;
  value: string | null;
  isLink?: boolean;
};

const InfoItem = ({ label, value, isLink }: InfoItemProps) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>

    {!value ? (
      <p>-</p>
    ) : isLink ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        Mở liên kết
      </a>
    ) : (
      <p>{value}</p>
    )}
  </div>
);

export default AdminSettingCard;
