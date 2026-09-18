import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const features = [
  { icon: "🏛️", key: "wallBuild" },
  { icon: "🖼️", key: "media" },
  { icon: "🚶", key: "walk" },
  { icon: "🤖", key: "ai" },
  { icon: "🔗", key: "share" },
  { icon: "⚡", key: "fast" },
];

const featureText: Record<string, { ar: string; en: string }> = {
  wallBuild: { ar: "بناء جدران وغرف بالسحب والإفلات", en: "Drag-and-drop wall & room builder" },
  media: { ar: "إضافة صور وفيديوهات ونماذج ثلاثية الأبعاد", en: "Add images, videos, and 3D models" },
  walk: { ar: "تجول بصيغة الشخص الأول داخل معرضك", en: "First-person walkthrough of your gallery" },
  ai: { ar: "توليد تصميم المتحف بالذكاء الاصطناعي", en: "AI-generated museum layouts" },
  share: { ar: "شارك متحفك برابط أو QR Code", en: "Share via link or QR code" },
  fast: { ar: "أداء سريع ومحسّن لجميع الأجهزة", en: "Fast, optimized on any device" },
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            {t("home.heroTitle")}
          </h1>
          <p className="text-lg text-brand-50 max-w-2xl mx-auto mb-8">
            {t("home.heroSubtitle")}
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-brand-700 font-bold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors"
          >
            {t("home.cta")}
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">{t("home.featuresTitle")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.key} className="card">
              <div className="text-3xl mb-3">{f.icon}</div>
              <p className="font-semibold text-gray-700">{featureText[f.key][lang]}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
