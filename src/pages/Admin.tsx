import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Pencil, Trash2, Send, X, Check, LogOut,
  Newspaper, Stethoscope, Bell, Tag, ChevronDown, ChevronUp,
  Image, AlertTriangle, Loader2, RefreshCw, Users,
} from "lucide-react";
import {
  getNews, createNews, updateNews, deleteNews,
  getDoctors, createDoctor, updateDoctor, deleteDoctor,
  sendPush, getPushCount,
  type NewsItem, type Doctor,
} from "@/lib/adminApi.ts";

type Tab = "news" | "doctors" | "push";

const BASE = import.meta.env.VITE_API_URL ?? 'https://dentis-site-api.nesterenkovasil9.workers.dev';

function uid() { return Math.random().toString(36).slice(2, 9); }
function normalizeHot(v: boolean | number): boolean { return v === true || v === 1; }

// ─── Shared ───────────────────────────────────────────────────────────────────

function TabButton({ active, onClick, icon, label }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
}) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        active ? "gradient-gold text-[hsl(220_40%_10%)] shadow-gold-custom"
          : "text-[hsl(40_20%_70%)] hover:text-[hsl(40_30%_92%)] hover:bg-[hsl(180_60%_18%)]"
      }`} style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
      {icon}<span>{label}</span>
    </button>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }: {
  message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="rounded-2xl p-6 max-w-sm w-full" style={{ border: "1px solid hsl(38 62% 52% / 0.2)" }}>
        <div className="flex items-start gap-3 mb-5">
          <AlertTriangle size={20} className="text-[hsl(38_74%_58%)] flex-shrink-0 mt-0.5" />
          <p className="text-[hsl(40_20%_85%)] text-sm leading-relaxed" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{message}</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm text-[hsl(180_20%_55%)] hover:text-[hsl(40_30%_88%)] transition-colors" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Скасувати</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Видалити</button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  border: "1px solid hsl(180 40% 25%)",
  color: "hsl(40 30% 88%)", fontFamily: '"NueneMontreal", system-ui, sans-serif',
};

function FieldInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
    </div>
  );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
       style={{
        border: '1px solid hsl(38 62% 52% / 0.25)',
        boxShadow: "0 24px 80px hsl(180 60% 5% / 0.7)",
      }} >
        <div className="h-[2px] gradient-gold rounded-t-2xl" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[hsl(40_30%_92%)] font-semibold" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg text-[hsl(180_20%_50%)] hover:text-[hsl(40_30%_88%)] hover:bg-[hsl(180_50%_18%)] transition-all"><X size={16} /></button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── News Tab ─────────────────────────────────────────────────────────────────

function NewsTab({ secret }: { secret: string }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<(Omit<NewsItem, 'id'> & { id?: number; _t?: string }) | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { setItems(await getNews()); } catch { setError("Не вдалося завантажити новини"); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const emptyForm = { type: 'news' as const, badge: 'Новини', title: '', desc: '', date: '', hot: false };
  const badgeOpts = { news: ['Новини', 'Інформація', 'Оновлення'], promo: ['Акція', 'Спецпропозиція', 'Знижка'] };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true); setError(null);
    try {
      const p = { type: editing.type, badge: editing.badge, title: editing.title, desc: editing.desc, date: editing.date, hot: editing.hot };
      isNew ? await createNews(p, secret) : await updateNews(editing.id!, p, secret);
      await load(); setEditing(null);
    } catch (e: unknown) {
      setError(e instanceof Error && e.message === 'UNAUTHORIZED' ? 'Невірний пароль адміна' : 'Помилка збереження');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteNews(id, secret); setItems((p) => p.filter((i) => i.id !== id)); }
    catch { setError("Помилка видалення"); }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <p className="text-[hsl(180_20%_55%)] text-sm" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{items.length} записів</p>
          <button onClick={load} className="p-1.5 rounded-lg text-[hsl(180_20%_45%)] hover:text-[hsl(38_70%_68%)] transition-colors">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        <button onClick={() => { setEditing({ ...emptyForm, _t: uid() }); setIsNew(true); }}
          className="flex items-center gap-2 gradient-gold text-[hsl(220_40%_10%)] px-4 py-2 rounded-xl text-sm font-semibold shadow-gold-custom hover:brightness-110 transition-all active:scale-95"
          style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
          <Plus size={16} />Додати
        </button>
      </div>

      {error && <div className="mb-4 flex items-center gap-2 text-red-400 text-sm" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}><AlertTriangle size={14} />{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[hsl(38_62%_52%)]" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl overflow-hidden" style={{
              
              border: normalizeHot(item.hot) ? "1px solid hsl(38 62% 52% / 0.4)" : "1px solid hsl(180 40% 22% / 0.5)",
            }}>
              {normalizeHot(item.hot) && (
                <div className="gradient-gold px-4 py-1.5 flex items-center gap-2">
                  <Tag size={11} className="text-[hsl(220_40%_10%)]" />
                  <span className="text-[10px] text-[hsl(220_40%_10%)] font-bold tracking-widest uppercase">Гаряча пропозиція</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wider uppercase mb-1 ${
                      item.type === "promo" ? "bg-[hsl(38_62%_52%/0.15)] text-[hsl(38_70%_68%)]" : "bg-[hsl(180_50%_25%/0.4)] text-[hsl(180_40%_60%)]"
                    }`}>{item.badge}</span>
                    <p className="text-[hsl(40_30%_92%)] font-medium text-sm leading-snug truncate" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{item.title}</p>
                    <p className="text-[hsl(180_20%_50%)] text-xs mt-0.5">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="p-2 rounded-lg text-[hsl(180_20%_50%)] hover:text-[hsl(40_30%_88%)] hover:bg-[hsl(180_50%_18%)] transition-all">
                      {expandedId === item.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className="p-2 rounded-lg text-[hsl(180_20%_50%)] hover:text-[hsl(38_70%_68%)] hover:bg-[hsl(38_62%_52%/0.1)] transition-all"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="p-2 rounded-lg text-[hsl(180_20%_50%)] hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15} /></button>
                  </div>
                </div>
                {expandedId === item.id && (
                  <p className="text-[hsl(40_15%_65%)] text-xs leading-relaxed mt-3 pt-3 border-t border-[hsl(180_40%_20%/0.5)]" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{item.desc}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ModalShell title={isNew ? "Нова публікація" : "Редагувати"} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Тип</label>
              <div className="flex gap-2">
                {(['news', 'promo'] as const).map((t) => (
                  <button key={t} onClick={() => setEditing((p) => p ? { ...p, type: t, badge: badgeOpts[t][0] } : p)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${editing.type === t ? "gradient-gold text-[hsl(220_40%_10%)]" : "text-[hsl(40_20%_65%)] border border-[hsl(180_40%_22%/0.5)]"}`}
                    style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
                    {t === "news" ? "Новина" : "Акція"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Мітка</label>
              <select value={editing.badge} onChange={(e) => setEditing((p) => p ? { ...p, badge: e.target.value } : p)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                {badgeOpts[editing.type].map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <FieldInput label="Заголовок" value={editing.title} onChange={(v) => setEditing((p) => p ? { ...p, title: v } : p)} placeholder="Назва акції або новини" />
            <div>
              <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Опис</label>
              <textarea value={editing.desc} onChange={(e) => setEditing((p) => p ? { ...p, desc: e.target.value } : p)} rows={3}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={inputStyle} placeholder="Детальний опис..." />
            </div>
            <FieldInput label="Дата / Термін" value={editing.date} onChange={(v) => setEditing((p) => p ? { ...p, date: v } : p)} placeholder="До 31 березня 2026" />
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setEditing((p) => p ? { ...p, hot: !normalizeHot(p.hot) } : p)}
                className={`w-11 h-6 rounded-full transition-all duration-200 flex items-center px-0.5 ${normalizeHot(editing.hot) ? "gradient-gold" : "bg-[hsl(180_50%_18%)]"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${normalizeHot(editing.hot) ? "translate-x-5" : "translate-x-0"}`} />
              </div>
              <span className="text-sm text-[hsl(40_20%_70%)]" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Гаряча пропозиція</span>
            </label>
          </div>
          {error && <p className="mt-3 text-red-400 text-xs" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{error}</p>}
          <div className="flex gap-2 mt-6">
            <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl text-sm text-[hsl(180_20%_55%)] border border-[hsl(180_40%_22%/0.5)]" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Скасувати</button>
            <button onClick={handleSave} disabled={!editing.title.trim() || saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold gradient-gold text-[hsl(220_40%_10%)] shadow-gold-custom hover:brightness-110 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}Зберегти
            </button>
          </div>
        </ModalShell>
      )}
      {deleteId !== null && <ConfirmDialog message="Видалити цю публікацію?" onConfirm={() => handleDelete(deleteId!)} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}

// ─── Doctors Tab ──────────────────────────────────────────────────────────────

function DoctorsTab({ secret }: { secret: string }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<(Omit<Doctor, 'id'> & { id?: number }) | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try { setDoctors(await getDoctors()); } catch { setError("Не вдалося завантажити лікарів"); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const emptyForm = { name: '', title: '', speciality: '', experience: '', desc: '', img_url: '', sort_order: 99 };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPendingFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true); setError(null);
    try {
      let img_url = editing.img_url;

      // Якщо є новий файл — завантажуємо в R2
      if (pendingFile) {
        setUploading(true);
        const res = await fetch(`${BASE}/api/doctors/photo`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${secret}`, 'Content-Type': pendingFile.type },
          body: pendingFile,
        });
        setUploading(false);
        if (!res.ok) throw new Error('Помилка завантаження фото');
        const data = await res.json() as { url: string };
        img_url = data.url;
      }

      const p = { name: editing.name, title: editing.title, speciality: editing.speciality, experience: editing.experience, desc: editing.desc, img_url, sort_order: editing.sort_order };
      isNew ? await createDoctor(p, secret) : await updateDoctor(editing.id!, p, secret);
      await load();
      setEditing(null);
      setPendingFile(null);
      setPreviewUrl(null);
    } catch (e: unknown) {
      setUploading(false);
      setError(e instanceof Error && e.message === 'UNAUTHORIZED' ? 'Невірний пароль адміна' : (e instanceof Error ? e.message : 'Помилка збереження'));
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteDoctor(id, secret); setDoctors((p) => p.filter((d) => d.id !== id)); }
    catch { setError("Помилка видалення"); }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <p className="text-[hsl(180_20%_55%)] text-sm" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{doctors.length} лікарів</p>
          <button onClick={load} className="p-1.5 rounded-lg text-[hsl(180_20%_45%)] hover:text-[hsl(38_70%_68%)] transition-colors">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        <button onClick={() => { setEditing({ ...emptyForm }); setIsNew(true); setPendingFile(null); setPreviewUrl(null); }}
          className="flex items-center gap-2 gradient-gold text-[hsl(220_40%_10%)] px-4 py-2 rounded-xl text-sm font-semibold shadow-gold-custom hover:brightness-110 transition-all active:scale-95"
          style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
          <Plus size={16} />Додати лікаря
        </button>
      </div>

      {error && <div className="mb-4 flex items-center gap-2 text-red-400 text-sm" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}><AlertTriangle size={14} />{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[hsl(38_62%_52%)]" /></div>
      ) : (
        <div className="space-y-3">
          {doctors.map((doc) => (
            <div key={doc.id} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: "hsl(180 60% 12%)", border: "1px solid hsl(180 40% 22% / 0.5)" }}>
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[hsl(180_50%_18%)]">
                {doc.img_url ? <img src={doc.img_url} alt={doc.name} className="w-full h-full object-cover object-top" />
                  : <div className="w-full h-full flex items-center justify-center text-[hsl(38_62%_52%)]"><Stethoscope size={22} /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[hsl(40_30%_92%)] font-medium text-sm leading-snug truncate" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{doc.name}</p>
                <p className="text-[hsl(38_62%_52%)] text-xs mt-0.5">{doc.title}</p>
                <p className="text-[hsl(180_20%_50%)] text-xs">{doc.experience}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing({ ...doc }); setIsNew(false); setPendingFile(null); setPreviewUrl(null); }} className="p-2 rounded-lg text-[hsl(180_20%_50%)] hover:text-[hsl(38_70%_68%)] hover:bg-[hsl(38_62%_52%/0.1)] transition-all"><Pencil size={15} /></button>
                <button onClick={() => setDeleteId(doc.id)} className="p-2 rounded-lg text-[hsl(180_20%_50%)] hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ModalShell title={isNew ? "Новий лікар" : "Редагувати лікаря"} onClose={() => { setEditing(null); setPendingFile(null); setPreviewUrl(null); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-[hsl(180_20%_55%)] text-xs mb-2 uppercase tracking-wider">Фото</label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "hsl(180 50% 15%)", border: "1px solid hsl(180 40% 25%)" }}>
                  {(previewUrl || editing.img_url) ? <img src={previewUrl ?? editing.img_url} alt="" className="w-full h-full object-cover object-top" />
                    : <div className="w-full h-full flex items-center justify-center text-[hsl(180_30%_45%)]"><Image size={20} /></div>}
                </div>
                <div className="flex-1">
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                    onChange={handleFileChange} />
                  <button onClick={() => fileRef.current?.click()} className="w-full py-2 rounded-xl text-xs text-[hsl(40_20%_65%)] hover:text-[hsl(38_70%_68%)] transition-colors"
                    style={{ border: "1px dashed hsl(180 40% 25%)", fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
                    {pendingFile ? `✓ ${pendingFile.name}` : 'Завантажити фото'}
                  </button>
                  <p className="text-[hsl(180_20%_40%)] text-[10px] mt-1">JPG, PNG, WebP · до 5MB</p>
                </div>
              </div>
            </div>
            <FieldInput label="ПІБ" value={editing.name} onChange={(v) => setEditing((p) => p ? { ...p, name: v } : p)} placeholder="Прізвище Ім'я По-батькові" />
            <FieldInput label="Посада" value={editing.title} onChange={(v) => setEditing((p) => p ? { ...p, title: v } : p)} placeholder="Головний лікар" />
            <FieldInput label="Спеціалізація" value={editing.speciality} onChange={(v) => setEditing((p) => p ? { ...p, speciality: v } : p)} placeholder="Лікар-стоматолог, імплантолог" />
            <FieldInput label="Досвід" value={editing.experience} onChange={(v) => setEditing((p) => p ? { ...p, experience: v } : p)} placeholder="10+ років досвіду" />
            <div>
              <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Опис</label>
              <textarea value={editing.desc} onChange={(e) => setEditing((p) => p ? { ...p, desc: e.target.value } : p)} rows={3}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={inputStyle} placeholder="Короткий опис лікаря..." />
            </div>
          </div>
          {error && <p className="mt-3 text-red-400 text-xs" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{error}</p>}
          <div className="flex gap-2 mt-6">
            <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl text-sm text-[hsl(180_20%_55%)] border border-[hsl(180_40%_22%/0.5)]" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Скасувати</button>
            <button onClick={handleSave} disabled={!editing.name.trim() || saving || uploading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold gradient-gold text-[hsl(220_40%_10%)] shadow-gold-custom hover:brightness-110 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
              {uploading ? <><Loader2 size={15} className="animate-spin" />Завантаження...</> : saving ? <><Loader2 size={15} className="animate-spin" />Збереження...</> : <><Check size={15} />Зберегти</>}
            </button>
          </div>
        </ModalShell>
      )}
      {deleteId !== null && <ConfirmDialog message="Видалити цього лікаря з сайту?" onConfirm={() => handleDelete(deleteId!)} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}

// ─── Push Tab ─────────────────────────────────────────────────────────────────

function PushTab({ secret }: { secret: string }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<number | null>(null);
  const [subCount, setSubCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { getPushCount(secret).then(setSubCount); }, [secret]);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true); setError(null); setSent(null);
    try { const r = await sendPush({ title, body, url }, secret); setSent(r.sent); setTitle(""); setBody(""); setUrl("/"); }
    catch (e: unknown) { setError(e instanceof Error && e.message === 'UNAUTHORIZED' ? 'Невірний пароль адміна' : 'Помилка надсилання'); }
    finally { setSending(false); }
  };

  const templates = [
    { label: "Акція", title: "🦷 Спецпропозиція від Дентіс", body: "Тільки цього тижня — знижка 15% на профогляд!" },
    { label: "Нагадування", title: "Нагадування про прийом", body: "Не забудьте про завтрашній візит до клініки Дентіс." },
    { label: "Новина", title: "Новини Дентіс", body: "У нашій клініці з'явилося нове обладнання преміум-класу." },
  ];

  return (
    <div className="max-w-xl">
      {subCount !== null && (
        <div className="rounded-2xl p-4 mb-5 flex items-center gap-3" style={{ background: "hsl(38 62% 52% / 0.08)", border: "1px solid hsl(38 62% 52% / 0.2)" }}>
          <Users size={16} className="text-[hsl(38_70%_68%)] flex-shrink-0" />
          <p className="text-[hsl(40_20%_70%)] text-sm" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
            <span className="text-[hsl(38_70%_68%)] font-semibold">{subCount}</span> підписників отримають сповіщення
          </p>
        </div>
      )}

      <div className="mb-5">
        <p className="text-[hsl(180_20%_55%)] text-xs uppercase tracking-wider mb-2.5">Шаблони</p>
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <button key={t.label} onClick={() => { setTitle(t.title); setBody(t.body); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[hsl(40_20%_65%)] hover:text-[hsl(38_70%_68%)] transition-colors"
              style={{ background: "hsl(180 60% 14%)", border: "1px solid hsl(180 40% 22% / 0.5)", fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Заголовок</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} placeholder="Короткий заголовок"
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ ...inputStyle, background: "hsl(180 60% 12%)" }} />
          <p className="text-right text-[10px] text-[hsl(180_20%_40%)] mt-1">{title.length}/60</p>
        </div>
        <div>
          <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Текст</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} maxLength={160} placeholder="Текст повідомлення..."
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ ...inputStyle, background: "hsl(180 60% 12%)" }} />
          <p className="text-right text-[10px] text-[hsl(180_20%_40%)] mt-1">{body.length}/160</p>
        </div>
        <div>
          <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Посилання</label>
          <select value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ ...inputStyle, background: "hsl(180 60% 12%)" }}>
            <option value="/">Головна сторінка</option>
            <option value="/#news">Новини та акції</option>
            <option value="/#services">Послуги</option>
            <option value="/contacts">Контакти</option>
          </select>
        </div>
      </div>

      {(title || body) && (
        <div className="mt-5 rounded-xl p-4" style={{ background: "hsl(180 60% 9%)", border: "1px solid hsl(180 40% 18% / 0.5)" }}>
          <p className="text-[hsl(180_20%_45%)] text-[10px] uppercase tracking-wider mb-2.5">Попередній перегляд</p>
          <div className="rounded-xl p-3 flex items-start gap-3" style={{ background: "hsl(180 50% 14%)", border: "1px solid hsl(180 40% 22% / 0.4)" }}>
            <img src="/favicon.png" alt="" className="w-8 h-8 rounded-lg flex-shrink-0" />
            <div>
              <p className="text-[hsl(40_30%_90%)] text-xs font-semibold" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{title || "Заголовок"}</p>
              <p className="text-[hsl(40_15%_65%)] text-xs leading-relaxed mt-0.5" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{body || "Текст повідомлення"}</p>
            </div>
          </div>
        </div>
      )}

      {sent !== null && <div className="mt-4 flex items-center gap-2 text-sm text-green-400" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}><Check size={15} />Надіслано {sent} підписникам</div>}
      {error && <div className="mt-4 flex items-center gap-2 text-sm text-red-400" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}><AlertTriangle size={15} />{error}</div>}

      <button onClick={handleSend} disabled={!title.trim() || !body.trim() || sending}
        className="mt-5 w-full py-3 rounded-xl font-semibold text-sm gradient-gold text-[hsl(220_40%_10%)] shadow-gold-custom hover:brightness-110 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
        {sending ? <><Loader2 size={16} className="animate-spin" />Надсилання...</> : <><Send size={16} />Розіслати всім</>}
      </button>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (s: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async () => {
    if (!password.trim()) return;
    setChecking(true);
    try {
      const res = await fetch(`${BASE}/api/push/count`, { headers: { Authorization: `Bearer ${password}` } });
      if (res.ok) { onLogin(password); }
      else { setError(true); setPassword(""); setTimeout(() => setError(false), 2000); }
    } catch {
      // Worker ще не задеплоєно — fallback
      if (password === "dentis2026") { onLogin(password); }
      else { setError(true); setPassword(""); setTimeout(() => setError(false), 2000); }
    } finally { setChecking(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "hsl(180 60% 8%)" }}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden" style={{
        background: "hsl(180 60% 11%)", border: "1px solid hsl(38 62% 52% / 0.2)",
        boxShadow: "0 32px 80px hsl(180 60% 5% / 0.6)",
      }}>
        <div className="h-[2px] gradient-gold" />
        <div className="p-8">
          <div className="text-center mb-8">
            <img src="/favicon.png" alt="Дентіс" className="w-12 h-12 mx-auto mb-4 rounded-xl" />
            <p className="text-[hsl(38_70%_68%)] text-xs tracking-[0.3em] uppercase mb-1" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Дентіс</p>
            <h1 className="text-[hsl(40_30%_92%)] text-xl font-semibold" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Адмін-панель</h1>
          </div>
          <div className="space-y-3">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Пароль" className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ background: "hsl(180 60% 15%)", border: `1px solid ${error ? "hsl(0 70% 50%)" : "hsl(180 40% 25%)"}`, color: "hsl(40 30% 88%)", fontFamily: '"NueneMontreal", system-ui, sans-serif' }} />
            {error && <p className="text-red-400 text-xs text-center" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Невірний пароль</p>}
            <button onClick={handleSubmit} disabled={checking}
              className="w-full py-3 rounded-xl text-sm font-semibold gradient-gold text-[hsl(220_40%_10%)] shadow-gold-custom hover:brightness-110 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
              {checking ? <><Loader2 size={15} className="animate-spin" />Перевірка...</> : "Увійти"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Admin() {
  const [secret, setSecret] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("news");
  const navigate = useNavigate();

  if (!secret) return <LoginScreen onLogin={setSecret} />;

  return (
    <div className="min-h-screen" style={{ background: "hsl(180 60% 8%)" }}>
      <div className="sticky top-0 z-30" style={{
        background: "hsl(180 60% 10% / 0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid hsl(180 40% 18% / 0.5)",
      }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="" className="w-7 h-7 rounded-lg" />
            <div>
              <p className="text-[hsl(38_70%_68%)] text-[10px] tracking-[0.25em] uppercase leading-none" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Дентіс</p>
              <p className="text-[hsl(40_30%_88%)] text-sm font-medium leading-tight" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Адмінь</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/")} className="text-xs text-[hsl(180_20%_50%)] hover:text-[hsl(40_30%_80%)] px-3 py-1.5 rounded-lg hover:bg-[hsl(180_50%_15%)] transition-colors" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>На сайт</button>
            <button onClick={() => setSecret(null)} className="p-2 rounded-lg text-[hsl(180_20%_50%)] hover:text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={15} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex gap-1 p-1 rounded-2xl mb-6" style={{ background: "hsl(180 60% 10%)", border: "1px solid hsl(180 40% 18% / 0.5)" }}>
          <TabButton active={tab === "news"} onClick={() => setTab("news")} icon={<Newspaper size={15} />} label="Новини" />
          <TabButton active={tab === "doctors"} onClick={() => setTab("doctors")} icon={<Stethoscope size={15} />} label="Лікарі" />
          <TabButton active={tab === "push"} onClick={() => setTab("push")} icon={<Bell size={15} />} label="Push" />
        </div>
        {tab === "news" && <NewsTab secret={secret} />}
        {tab === "doctors" && <DoctorsTab secret={secret} />}
        {tab === "push" && <PushTab secret={secret} />}
      </div>
    </div>
  );
}
