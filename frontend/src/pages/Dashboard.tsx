import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { Project } from "../types";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await api.get("/projects");
    setProjects(data);
  }

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    const { data } = await api.post("/projects", { title });
    setShowModal(false);
    setTitle("");
    navigate(`/editor/${data.id}`);
  }

  async function deleteProject(id: string) {
    if (
      !window.confirm(
        isAr ? "هل أنت متأكد من رغبتك في حذف هذا المتحف؟" : "Are you sure you want to delete this museum?"
      )
    ) {
      return;
    }
    await api.delete(`/projects/${id}`);
    load();
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + {t("dashboard.newProject")}
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-400 text-center py-20">{t("dashboard.empty")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div key={p.id} className="card flex flex-col gap-3">
              <div className="h-32 rounded-xl bg-gradient-to-br from-brand-100 to-accent-400/30 flex items-center justify-center text-4xl">
                🏛️
              </div>
              <h3 className="font-bold text-lg">{p.title}</h3>
              <div className="flex gap-2 text-sm mt-auto">
                <button className="btn-secondary flex-1" onClick={() => navigate(`/editor/${p.id}`)}>
                  {t("dashboard.edit")}
                </button>
                <button className="btn-secondary flex-1" onClick={() => navigate(`/gallery/${p.id}`)}>
                  {t("dashboard.view")}
                </button>
                <button className="btn-secondary flex-1" onClick={() => navigate(`/share/${p.id}`)}>
                  {t("dashboard.share")}
                </button>
                <button
                  className="px-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50"
                  onClick={() => deleteProject(p.id)}
                  title={isAr ? "حذف المتحف" : "Delete museum"}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={createProject} className="card w-full max-w-sm">
            <h2 className="font-bold text-lg mb-4">{t("dashboard.newProject")}</h2>
            <input
              autoFocus
              className="input-field mb-4"
              placeholder={t("dashboard.newProject") as string}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <button type="button" className="btn-secondary flex-1" onClick={() => setShowModal(false)}>
                ✕
              </button>
              <button type="submit" className="btn-primary flex-1">
                ✓
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
