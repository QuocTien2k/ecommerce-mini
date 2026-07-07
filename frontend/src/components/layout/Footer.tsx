import { useGetSetting } from "@/domains/setting/hooks/useSetting";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { SiTiktok, SiZalo } from "react-icons/si";
import { Link } from "react-router-dom";

const Footer = () => {
  const { data: setting } = useGetSetting();

  return (
    <footer className="mt-auto border-t border-border bg-zinc-950 text-zinc-100">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/">
              <h2 className="text-2xl font-black tracking-tight text-white">
                {setting?.siteName ?? "TechStore"}
              </h2>
            </Link>

            <p className="text-sm leading-6 text-zinc-400">
              Cửa hàng chuyên cung cấp laptop, điện thoại và phụ kiện công nghệ
              chính hãng với giá tốt.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Liên hệ</h3>

            {setting?.address && (
              <div className="flex gap-2 text-sm text-zinc-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                <span>{setting.address}</span>
              </div>
            )}

            {setting?.hotline1 && (
              <div className="flex gap-2 text-sm text-zinc-400">
                <Phone className="h-4 w-4 shrink-0 text-zinc-500" />
                <span>{setting.hotline1}</span>
              </div>
            )}

            {setting?.hotline2 && (
              <div className="flex gap-2 text-sm text-zinc-400">
                <Phone className="h-4 w-4 shrink-0 text-zinc-500" />
                <span>{setting.hotline2}</span>
              </div>
            )}

            {setting?.email && (
              <div className="flex gap-2 text-sm text-zinc-400">
                <Mail className="h-4 w-4 shrink-0 text-zinc-500" />
                <span>{setting.email}</span>
              </div>
            )}
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h3 className="font-semibold">Kết nối</h3>

            <div className="flex flex-col gap-2 text-sm">
              {setting?.facebookUrl && (
                <a
                  href={setting.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
                >
                  <FaFacebook className="h-4 w-4" />
                  Facebook
                </a>
              )}

              {setting?.youtubeUrl && (
                <a
                  href={setting.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
                >
                  <FaYoutube className="h-4 w-4" />
                  YouTube
                </a>
              )}

              {setting?.tiktokUrl && (
                <a
                  href={setting.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
                >
                  <SiTiktok className="h-4 w-4" />
                  TikTok
                </a>
              )}

              {setting?.zaloUrl && (
                <a
                  href={setting.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
                >
                  <SiZalo className="h-4 w-4" />
                  Zalo
                </a>
              )}
            </div>
          </div>

          {/* Working hours */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Giờ làm việc</h3>

            {setting?.workingHours && (
              <div className="flex gap-2 text-sm text-zinc-400">
                <Clock className="h-4 w-4 shrink-0 text-zinc-500" />
                <span>{setting.workingHours}</span>
              </div>
            )}

            {setting?.googleMapUrl && (
              <a
                href={setting.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Xem trên Google Maps
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-5 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} {setting?.siteName ?? "TechStore"}. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
