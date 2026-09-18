import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import { api } from "../lib/api";

export default function Share() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function createShare() {
      const { data } = await api.post(`/projects/${id}/share`);
      setShareUrl(`${window.location.origin}${data.url}`);
    }
    createShare();
  }, [id]);

  if (!shareUrl) return <div className="p-10 text-center text-gray-400">...جاري إنشاء الرابط</div>;

  const embedCode = `<iframe src="${shareUrl}" width="800" height="600" frameborder="0"></iframe>`;

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <div className="card text-center space-y-6">
        <h1 className="text-2xl font-bold">{t("share.title")}</h1>

        <div className="flex justify-center">
          <QRCodeSVG value={shareUrl} size={160} />
        </div>

        <div className="flex gap-2">
          <input readOnly className="input-field text-sm" value={shareUrl} />
          <button
            className="btn-primary shrink-0"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? t("share.copied") : t("share.copyLink")}
          </button>
        </div>

        <div className="text-start">
          <label className="text-sm text-gray-500 block mb-1">{t("share.embed")}</label>
          <textarea readOnly className="input-field text-xs font-mono" rows={3} value={embedCode} />
        </div>
      </div>
    </div>
  );
}
