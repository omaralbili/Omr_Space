import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/useAuthStore";
import { setLanguage } from "../../i18n";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-extrabold text-brand-700">
          {t("appName")}
        </Link>

        <nav className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(i18n.language === "ar" ? "en" : "ar")}
            className="text-sm text-gray-500 hover:text-brand-600 px-2"
          >
            {i18n.language === "ar" ? "EN" : "AR"}
          </button>

          {user ? (
            <>
              <Link to="/dashboard" className="btn-secondary text-sm">
                {t("nav.dashboard")}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="btn-primary text-sm"
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm">
                {t("nav.login")}
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                {t("nav.register")}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
