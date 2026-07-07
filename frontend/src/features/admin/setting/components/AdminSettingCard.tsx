import { Card, CardContent } from "@/components/ui/card";
import type { Setting } from "@/domains/setting/types/setting.type";
import { Separator } from "@components/ui/separator";

type AdminSettingCardProps = {
  setting: Setting;
};

const AdminSettingCard = ({ setting }: AdminSettingCardProps) => {
  return (
    <Card className="ring-0! shadow-none! rounded-none!">
      <CardContent className="space-y-8 py-2">
        {/* Thông tin chung */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold whitespace-nowrap">
              Thông tin chung
            </h3>

            <Separator className="h-3 bg-muted-foreground" />
          </div>

          <div className="pt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <InfoItem label="Tên website" value={setting.siteName} />
            <InfoItem label="Email" value={setting.email} />
            <InfoItem label="Hotline 1" value={setting.hotline1} />
            <InfoItem label="Hotline 2" value={setting.hotline2} />
            <InfoItem label="Địa chỉ" value={setting.address} />
            <InfoItem label="Giờ làm việc" value={setting.workingHours} />
          </div>
        </section>

        {/* Logo */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold whitespace-nowrap">Logo</h3>

            <Separator className="h-3 bg-muted-foreground" />
          </div>

          {setting.logo ? (
            <div className="h-40 w-64 rounded-xl border bg-muted/20 p-4 flex items-center justify-center">
              <img
                src={setting.logo}
                alt={setting.siteName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="h-40 w-64 rounded-xl border bg-muted/20 flex items-center justify-center text-muted-foreground">
              Chưa có logo
            </div>
          )}
        </section>

        {/* Mạng xã hội */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold whitespace-nowrap">
              Mạng xã hội
            </h3>

            <Separator className="h-3 bg-muted-foreground" />
          </div>

          <div className="pt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <InfoItem label="Facebook" value={setting.facebookUrl} isLink />
            <InfoItem label="YouTube" value={setting.youtubeUrl} isLink />
            <InfoItem label="TikTok" value={setting.tiktokUrl} isLink />
            <InfoItem label="Zalo" value={setting.zaloUrl} isLink />
            <InfoItem label="Google Map" value={setting.googleMapUrl} isLink />
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

type InfoItemProps = {
  label: string;
  value: string | null;
  isLink?: boolean;
};

const InfoItem = ({ label, value, isLink }: InfoItemProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>

      <div className="flex min-h-12 items-center rounded-lg border bg-muted/20 px-4 py-3">
        {!value ? (
          <span className="text-base text-muted-foreground">-</span>
        ) : isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-base font-medium text-primary hover:underline"
          >
            {value}
          </a>
        ) : (
          <span className="wrap-break-words text-base font-medium">
            {value}
          </span>
        )}
      </div>
    </div>
  );
};

export default AdminSettingCard;
