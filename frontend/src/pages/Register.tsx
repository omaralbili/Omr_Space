import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/useAuthStore";

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.error || "حدث خطأ");
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6">{t("auth.registerTitle")}</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input-field"
            placeholder={t("auth.name") as string}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="email"
            placeholder={t("auth.email") as string}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder={t("auth.password") as string}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button className="btn-primary w-full" type="submit">
            {t("auth.registerTitle")}
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4">
          {t("auth.haveAccount")}{" "}
          <Link to="/login" className="text-brand-600 font-semibold">
            {t("nav.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
