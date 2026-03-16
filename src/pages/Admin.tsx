import { useState, useEffect, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  Plus, Pencil, Trash2, Send, X, Check, LogOut,
  Newspaper, Stethoscope, Bell, BellRing, Tag, ChevronDown, ChevronUp,
  Image, AlertTriangle, Loader2, RefreshCw, Users, CalendarDays, Phone, Clock,
  MessageCircle, Link2, LinkIcon, Copy, CheckCheck, ExternalLink,
} from "lucide-react";
import {
  getNews, createNews, updateNews, deleteNews,
  getDoctors, createDoctor, updateDoctor, deleteDoctor,
  sendPush, getPushCount, loginForToken,
  type NewsItem, type Doctor,
} from "@/lib/adminApi.ts";

type Tab = "news" | "doctors" | "push" | "appointments" | "telegram";

const BASE = import.meta.env.VITE_API_URL ?? 'https://dentis-site-api.nesterenkovasil9.workers.dev';

function uid() { return Math.random().toString(36).slice(2, 9); }
function normalizeHot(v: boolean | number): boolean { return v === true || v === 1; }

function validatePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('380') && digits.length === 12) return '+' + digits
  if (digits.startsWith('0') && digits.length === 10) return '+38' + digits
  return null
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function TabButton({ active, onClick, icon, label }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
}) {
  return (
    <button onClick={onClick}
      className={`flex items-center justify-center gap-2 px-2 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex-1 sm:flex-none ${
        active ? "gradient-gold text-[hsl(220_40%_10%)] shadow-gold-custom"
          : "text-[hsl(40_20%_70%)] hover:text-[hsl(40_30%_92%)] hover:bg-[hsl(180_60%_18%)]"
      }`} style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
      {icon}<span className="hidden sm:inline">{label}</span>
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
  background: "hsl(180 50% 15%)",
  border: "1px solid hsl(180 40% 25%)",
  color: "hsl(40 30% 88%)",
  fontFamily: '"NueneMontreal", system-ui, sans-serif',
};

const lightInputStyle = {
  background: "hsl(180 30% 92%)",
  border: "1px solid hsl(180 40% 70%)",
  color: "#111",
  fontFamily: '"NueneMontreal", system-ui, sans-serif',
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

function NewsTab({ token }: { token: string }) {
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
      isNew ? await createNews(p, token) : await updateNews(editing.id!, p, token);
      await load(); setEditing(null);
    } catch (e: unknown) {
      setError(e instanceof Error && e.message === 'UNAUTHORIZED' ? 'Сесія закінчилась — увійдіть знову' : 'Помилка збереження');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteNews(id, token); setItems((p) => p.filter((i) => i.id !== id)); }
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

function DoctorsTab({ token }: { token: string }) {
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
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': pendingFile.type },
          body: pendingFile,
        });
        setUploading(false);
        if (!res.ok) throw new Error('Помилка завантаження фото');
        const data = await res.json() as { url: string };
        img_url = data.url;
      }

      const p = { name: editing.name, title: editing.title, speciality: editing.speciality, experience: editing.experience, desc: editing.desc, img_url, sort_order: editing.sort_order };
      isNew ? await createDoctor(p, token) : await updateDoctor(editing.id!, p, token);
      await load();
      setEditing(null);
      setPendingFile(null);
      setPreviewUrl(null);
    } catch (e: unknown) {
      setUploading(false);
      setError(e instanceof Error && e.message === 'UNAUTHORIZED' ? 'Сесія закінчилась — увійдіть знову' : (e instanceof Error ? e.message : 'Помилка збереження'));
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteDoctor(id, token); setDoctors((p) => p.filter((d) => d.id !== id)); }
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
            <div key={doc.id} className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4" style={{ background: "hsl(180 60% 12%)", border: "1px solid hsl(180 40% 22% / 0.5)" }}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[hsl(180_50%_18%)]">
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

function ManualPushModal({ appt, token, onClose, onSent }: {
  appt: Appointment;
  token: string;
  onClose: () => void;
  onSent: () => void;
}) {
  const { date, time } = formatApptDt(appt.appointment_dt);
  const [title, setTitle] = useState('📋 Нагадування про прийом');
  const [body, setBody] = useState(`${appt.patient_name}, ваш прийом ${date} о ${time}`);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; noSub?: boolean } | null>(null);

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await fetch(`${BASE}/api/push/send-to`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: appt.phone, title, body, url: '/' }),
      });
      const data = await res.json() as { sent: number; noSub?: boolean };
      setResult(data);
      if (data.sent > 0) setTimeout(onSent, 1200);
    } catch {
      setResult({ sent: 0 });
    } finally { setSending(false); }
  };

  return (
    <ModalShell title="Надіслати сповіщення" onClose={onClose}>
      <div className="space-y-4">
        {/* Пацієнт */}
        <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'hsl(180 50% 15%)', border: '1px solid hsl(180 40% 22% / 0.5)' }}>
          <BellRing size={16} className="text-[hsl(38_62%_52%)] flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[hsl(40_30%_90%)] text-sm font-medium truncate" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{appt.patient_name}</p>
            <p className="text-[hsl(180_20%_50%)] text-xs">{appt.phone} · {date} {time}</p>
          </div>
        </div>

        <FieldInput label="Заголовок" value={title} onChange={setTitle} placeholder="Заголовок сповіщення" />
        <div>
          <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Текст</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={3}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
            style={{ ...inputStyle, background: 'hsl(180 50% 15%)' }} />
        </div>

        {result && (
          <div className={`rounded-xl px-3 py-2.5 text-sm text-center ${result.sent > 0 ? 'text-green-400' : 'text-[hsl(38_62%_52%)]'}`}
            style={{ background: result.sent > 0 ? 'hsl(150 50% 12%)' : 'hsl(38 50% 15%)', border: `1px solid ${result.sent > 0 ? 'hsl(150 50% 25%)' : 'hsl(38 50% 30%)'}` }}>
            {result.sent > 0 ? '✓ Сповіщення надіслано' : result.noSub ? '— Пацієнт не підписаний на сповіщення' : '✗ Помилка надсилання'}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-[hsl(180_20%_55%)] border border-[hsl(180_40%_22%/0.5)]"
            style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Закрити</button>
          <button onClick={handleSend} disabled={!title.trim() || !body.trim() || sending || !!result}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold gradient-gold text-[hsl(220_40%_10%)] shadow-gold-custom hover:brightness-110 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
            {sending ? <><Loader2 size={15} className="animate-spin" />Надсилання...</> : <><Send size={15} />Надіслати</>}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Appointments Tab ─────────────────────────────────────────────────────────

type Appointment = {
  id: number;
  patient_name: string;
  phone: string;
  appointment_dt: string;
  doctor: string | null;
  notes: string | null;
  status: 'scheduled' | 'cancelled' | 'changed';
  reminded_24h: number;
  reminded_1h: number;
};

const STATUS_LABEL: Record<string, string> = {
  scheduled: 'Заплановано',
  cancelled: 'Скасовано',
  changed: 'Змінено',
};
const STATUS_COLOR: Record<string, string> = {
  scheduled: 'hsl(150 60% 40%)',
  cancelled: 'hsl(0 60% 50%)',
  changed: 'hsl(38 70% 55%)',
};

function formatApptDt(dt: string) {
  const d = new Date(dt);
  return {
    date: d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' }),
    time: d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
    full: d.toLocaleDateString('uk-UA', { weekday: 'short', day: 'numeric', month: 'long' }),
  };
}

function ApptForm({
  initial, onSave, onCancel, saving, error,
}: {
  initial: Partial<Appointment>;
  onSave: (data: Omit<Appointment, 'id' | 'reminded_24h' | 'reminded_1h'>) => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState({
    patient_name: initial.patient_name ?? '',
    phone: initial.phone ?? '',
    appointment_dt: initial.appointment_dt ?? '',
    notes: initial.notes ?? '',
    status: initial.status ?? 'scheduled' as const,
  });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-3">
      <FieldInput label="ПІБ пацієнта" value={form.patient_name} onChange={v => set('patient_name', v)} placeholder="Іванченко Марія Василівна" />
      <div>
        <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Телефон</label>
        <div className="relative">
          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(180_20%_45%)]" />
          <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+380501234567"
            type="tel" autoComplete="tel"
            className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm outline-none" style={lightInputStyle} />
        </div>
        {form.phone.trim() && !validatePhone(form.phone) && (
          <p className="text-red-400 text-[11px] mt-1 px-1">Введіть у форматі +380XXXXXXXXX або 0XXXXXXXXX</p>
        )}
      </div>
      <div>
        <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Дата та час</label>
        <input type="datetime-local" value={form.appointment_dt} onChange={e => set('appointment_dt', e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={lightInputStyle} />
      </div>
      <div>
        <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Примітки</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={lightInputStyle} placeholder="Додаткова інформація..." />
      </div>
      {initial.id && (
        <div>
          <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Статус</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={lightInputStyle}>
            <option value="scheduled">Заплановано</option>
            <option value="cancelled">Скасовано</option>
            <option value="changed">Змінено</option>
          </select>
        </div>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div className="flex gap-2 mt-4">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm text-[hsl(180_20%_55%)] border border-[hsl(180_40%_22%/0.5)]" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Скасувати</button>
        <button onClick={() => onSave({ ...form, doctor: null })} disabled={!form.patient_name.trim() || !validatePhone(form.phone) || !form.appointment_dt || saving}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold gradient-gold text-[hsl(220_40%_10%)] shadow-gold-custom hover:brightness-110 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
          style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}Зберегти
        </button>
      </div>
    </div>
  );
}

function AppointmentsTab({ token }: { token: string }) {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<Appointment> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [sentId, setSentId] = useState<number | null>(null);
  const [pushModal, setPushModal] = useState<Appointment | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/appointments?date=${filterDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setItems(await res.json() as Appointment[]);
    } catch { setError('Не вдалося завантажити записи'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterDate]);

  const handleSave = async (data: Omit<Appointment, 'id' | 'reminded_24h' | 'reminded_1h'>) => {
    setSaving(true); setError(null);
    try {
      const url = isNew ? `${BASE}/api/appointments` : `${BASE}/api/appointments/${editing?.id}`;
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      await load();
      setEditing(null);
    } catch { setError('Помилка збереження'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${BASE}/api/appointments/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      setItems(p => p.filter(i => i.id !== id));
    } catch { setError('Помилка видалення'); }
    setDeleteId(null);
  };

  const scheduled = items.filter(i => i.status === 'scheduled');
  const others = items.filter(i => i.status !== 'scheduled');

  return (
    <div>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
            className="px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm outline-none" style={{ ...lightInputStyle, minWidth: 120 }} />
          <button onClick={load} className="p-1.5 rounded-lg text-[hsl(180_20%_45%)] hover:text-[hsl(38_70%_68%)] transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        <button onClick={() => { setEditing({}); setIsNew(true); }}
          className="flex items-center gap-1.5 gradient-gold text-[hsl(220_40%_10%)] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-gold-custom hover:brightness-110 transition-all active:scale-95"
          style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
          <Plus size={14} /><span>Новий запис</span>
        </button>
      </div>

      {error && <div className="mb-4 flex items-center gap-2 text-red-400 text-sm"><AlertTriangle size={14} />{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[hsl(38_62%_52%)]" /></div>
      ) : (
        <div className="space-y-2">
          {items.length === 0 && (
            <p className="text-center text-[hsl(180_20%_45%)] text-sm py-10" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
              Записів на {filterDate} немає
            </p>
          )}
          {[...scheduled, ...others].map(appt => {
            const { date, time } = formatApptDt(appt.appointment_dt);
            const hasPush = false; // placeholder
            return (
              <div key={appt.id} className="rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
                style={{ background: 'hsl(180 60% 12%)', border: `1px solid ${appt.status === 'cancelled' ? 'hsl(0 60% 35% / 0.4)' : 'hsl(180 40% 22% / 0.5)'}`, opacity: appt.status === 'cancelled' ? 0.6 : 1 }}>
                {/* Час */}
                <div className="flex-shrink-0 w-14 text-center rounded-xl py-2" style={{ background: 'hsl(180 50% 18%)' }}>
                  <p className="text-[hsl(38_62%_52%)] text-xs font-medium">{date}</p>
                  <p className="text-[hsl(40_30%_92%)] text-base font-semibold leading-tight">{time}</p>
                </div>
                {/* Інфо */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[hsl(40_30%_92%)] text-sm font-medium truncate" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{appt.patient_name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: STATUS_COLOR[appt.status] + '22', color: STATUS_COLOR[appt.status], border: `1px solid ${STATUS_COLOR[appt.status]}44` }}>
                      {STATUS_LABEL[appt.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-[hsl(180_20%_50%)] text-xs flex items-center gap-1"><Phone size={10} />{appt.phone}</p>
                    {appt.doctor && <p className="text-[hsl(38_50%_55%)] text-xs truncate">{appt.doctor}</p>}
                  </div>
                  {/* Індикатори нагадувань */}
                  {appt.status === 'scheduled' && (
                    <div className="flex gap-1.5 mt-1">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: appt.reminded_24h ? 'hsl(150 50% 20%)' : 'hsl(180 50% 15%)', color: appt.reminded_24h ? 'hsl(150 60% 55%)' : 'hsl(180 20% 45%)' }}>
                        24г {appt.reminded_24h ? '✓' : '○'}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: appt.reminded_1h ? 'hsl(150 50% 20%)' : 'hsl(180 50% 15%)', color: appt.reminded_1h ? 'hsl(150 60% 55%)' : 'hsl(180 20% 45%)' }}>
                        1г {appt.reminded_1h ? '✓' : '○'}
                      </span>
                    </div>
                  )}
                </div>
                {/* Дії */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => setPushModal(appt)} title="Надіслати сповіщення"
                    className="p-2 rounded-lg text-[hsl(180_20%_50%)] hover:text-[hsl(38_70%_68%)] hover:bg-[hsl(38_62%_52%/0.1)] transition-all">
                    {sentId === appt.id ? <Check size={15} className="text-green-400" /> : <BellRing size={15} />}
                  </button>
                  <button onClick={() => { setEditing(appt); setIsNew(false); }} className="p-2 rounded-lg text-[hsl(180_20%_50%)] hover:text-[hsl(38_70%_68%)] hover:bg-[hsl(38_62%_52%/0.1)] transition-all"><Pencil size={15} /></button>
                  <button onClick={() => setDeleteId(appt.id)} className="p-2 rounded-lg text-[hsl(180_20%_50%)] hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing !== null && (
        <ModalShell title={isNew ? 'Новий запис' : 'Редагувати запис'} onClose={() => setEditing(null)}>
          <ApptForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} saving={saving} error={error} />
        </ModalShell>
      )}
      {deleteId !== null && <ConfirmDialog message="Скасувати та видалити цей запис? Пацієнт отримає сповіщення." onConfirm={() => handleDelete(deleteId!)} onCancel={() => setDeleteId(null)} />}
      {pushModal && (
        <ManualPushModal
          appt={pushModal}
          token={token}
          onClose={() => setPushModal(null)}
          onSent={() => { setSentId(pushModal.id); setTimeout(() => setSentId(null), 3000); setPushModal(null); }}
        />
      )}
    </div>
  );
}

// ─── Push Tab ─────────────────────────────────────────────────────────────────

function PushTab({ token }: { token: string }) {
  const [pushTab, setPushTab] = useState<'all' | 'phone'>('all');

  // ── Broadcast ──
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<number | null>(null);
  const [subCount, setSubCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Send to phone ──
  const [pPhone, setPPhone] = useState("");
  const [pTitle, setPTitle] = useState("");
  const [pBody, setPBody] = useState("");
  const [pSending, setPSending] = useState(false);
  const [pResult, setPResult] = useState<{ sent: number; noSub?: boolean } | null>(null);
  const [pError, setPError] = useState<string | null>(null);

  useEffect(() => { getPushCount(token).then(setSubCount); }, [token]);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true); setError(null); setSent(null);
    try { const r = await sendPush({ title, body, url }, token); setSent(r.sent); setTitle(""); setBody(""); setUrl("/"); }
    catch (e: unknown) { setError(e instanceof Error && e.message === 'UNAUTHORIZED' ? 'Сесія закінчилась — увійдіть знову' : 'Помилка надсилання'); }
    finally { setSending(false); }
  };

  const handleSendToPhone = async () => {
    if (!validatePhone(pPhone) || !pTitle.trim() || !pBody.trim()) return;
    setPSending(true); setPError(null); setPResult(null);
    try {
      const res = await fetch(`${BASE}/api/push/send-to`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: pPhone, title: pTitle, body: pBody, url: '/' }),
      });
      const data = await res.json() as { sent: number; noSub?: boolean };
      setPResult(data);
    } catch { setPError('Помилка надсилання'); }
    finally { setPSending(false); }
  };

  const templates = [
    { label: "Акція", title: "🦷 Спецпропозиція від Дентіс", body: "Тільки цього тижня — знижка 15% на профогляд!" },
    { label: "Нагадування", title: "Нагадування про прийом", body: "Не забудьте про завтрашній візит до клініки Дентіс." },
    { label: "Новина", title: "Новини Дентіс", body: "У нашій клініці з'явилося нове обладнання преміум-класу." },
  ];

  const subTabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '7px 0', borderRadius: 10, fontSize: 13, fontWeight: active ? 600 : 400,
    background: active ? 'hsl(180 50% 20%)' : 'transparent',
    color: active ? 'hsl(40 30% 92%)' : 'hsl(180 20% 50%)',
    border: 'none', cursor: 'pointer', transition: 'all 0.15s',
    fontFamily: '"NueneMontreal", system-ui, sans-serif',
  });

  return (
    <div className="max-w-xl">
      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: 'hsl(180 60% 10%)', border: '1px solid hsl(180 40% 18% / 0.5)' }}>
        <button style={subTabStyle(pushTab === 'all')} onClick={() => setPushTab('all')}>Всім підписникам</button>
        <button style={subTabStyle(pushTab === 'phone')} onClick={() => { setPushTab('phone'); setPResult(null); }}>На номер</button>
      </div>

      {pushTab === 'all' ? (
        <>
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
        </>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Номер телефону</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(180_20%_45%)]" />
              <input value={pPhone} onChange={e => { setPPhone(e.target.value); setPResult(null); }}
                type="tel" autoComplete="tel" placeholder="+380501234567"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm outline-none" style={{ ...inputStyle, background: 'hsl(180 60% 12%)' }} />
            </div>
            {pPhone.trim() && !validatePhone(pPhone) && (
              <p className="text-red-400 text-[11px] mt-1 px-1">Формат: +380XXXXXXXXX або 0XXXXXXXXX</p>
            )}
          </div>
          <div>
            <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Заголовок</label>
            <input type="text" value={pTitle} onChange={e => { setPTitle(e.target.value); setPResult(null); }} maxLength={60} placeholder="Короткий заголовок"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ ...inputStyle, background: 'hsl(180 60% 12%)' }} />
            <p className="text-right text-[10px] text-[hsl(180_20%_40%)] mt-1">{pTitle.length}/60</p>
          </div>
          <div>
            <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Текст</label>
            <textarea value={pBody} onChange={e => { setPBody(e.target.value); setPResult(null); }} rows={3} maxLength={160} placeholder="Текст повідомлення..."
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ ...inputStyle, background: 'hsl(180 60% 12%)' }} />
            <p className="text-right text-[10px] text-[hsl(180_20%_40%)] mt-1">{pBody.length}/160</p>
          </div>
          {pResult && (
            <div className="rounded-xl px-3 py-2.5 text-sm text-center"
              style={{ background: pResult.sent > 0 ? 'hsl(150 50% 12%)' : 'hsl(38 40% 12%)', border: `1px solid ${pResult.sent > 0 ? 'hsl(150 50% 25%)' : 'hsl(38 40% 25%)'}`, color: pResult.sent > 0 ? 'hsl(150 60% 55%)' : 'hsl(38 62% 55%)', fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
              {pResult.sent > 0 ? '✓ Сповіщення надіслано' : '— Цей номер не підписаний на сповіщення'}
            </div>
          )}
          {pError && <div className="flex items-center gap-2 text-sm text-red-400"><AlertTriangle size={14} />{pError}</div>}
          <button onClick={handleSendToPhone} disabled={!validatePhone(pPhone) || !pTitle.trim() || !pBody.trim() || pSending}
            className="w-full py-3 rounded-xl font-semibold text-sm gradient-gold text-[hsl(220_40%_10%)] shadow-gold-custom hover:brightness-110 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
            {pSending ? <><Loader2 size={16} className="animate-spin" />Надсилання...</> : <><Send size={16} />Надіслати</>}
          </button>
        </div>
      )}
    </div>
  );
}


// ─── Telegram Tab ─────────────────────────────────────────────────────────────

type TgPending = { id: number; chat_id: string; first_name: string; created_at: string };

type TgAppointment = {
  id: number;
  patient_name: string;
  phone: string;
  appointment_dt: string;
  doctor: string | null;
  notes: string | null;
  status: string;
  telegram_chat_id: string | null;
  tg_reminded_24h: number;
  tg_reminded_1h: number;
};

function TelegramTab({ token }: { token: string }) {
  const [subTab, setSubTab] = useState<'appointments' | 'pending' | 'settings'>('appointments');

  // appointments sub-tab
  const [appts, setAppts] = useState<TgAppointment[]>([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [filterDate, setFilterDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<TgAppointment> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sentId, setSentId] = useState<number | null>(null);

  // manual send modal
  const [sendModal, setSendModal] = useState<TgAppointment | null>(null);
  const [sendText, setSendText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  // pending sub-tab
  const [pending, setPending] = useState<TgPending[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [linkModal, setLinkModal] = useState<TgPending | null>(null);
  const [linkPhone, setLinkPhone] = useState('');
  const [linking, setLinking] = useState(false);
  const [linkResult, setLinkResult] = useState<string | null>(null);

  // settings sub-tab
  const [botName, setBotName] = useState('');
  const [copied, setCopied] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);
  const [settingWebhook, setSettingWebhook] = useState(false);

  const loadAppts = async () => {
    setLoadingAppts(true); setError(null);
    try {
      const res = await fetch(`${BASE}/api/appointments?date=${filterDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setAppts(await res.json() as TgAppointment[]);
    } catch { setError('Не вдалося завантажити записи'); }
    finally { setLoadingAppts(false); }
  };

  const loadPending = async () => {
    setLoadingPending(true);
    try {
      const res = await fetch(`${BASE}/api/telegram/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPending(await res.json() as TgPending[]);
    } catch {}
    finally { setLoadingPending(false); }
  };

  useEffect(() => { loadAppts(); }, [filterDate]);
  useEffect(() => { if (subTab === 'pending') loadPending(); }, [subTab]);

  const handleSave = async (data: Omit<TgAppointment, 'id' | 'tg_reminded_24h' | 'tg_reminded_1h'>) => {
    setSaving(true); setError(null);
    try {
      const url = isNew ? `${BASE}/api/appointments` : `${BASE}/api/appointments/${editing?.id}`;
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      await loadAppts(); setEditing(null);
    } catch { setError('Помилка збереження'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${BASE}/api/appointments/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setAppts(p => p.filter(i => i.id !== id));
    } catch { setError('Помилка видалення'); }
    setDeleteId(null);
  };

  const handleSendTg = async () => {
    if (!sendModal?.telegram_chat_id || !sendText.trim()) return;
    setSendingMsg(true); setSendResult(null);
    try {
      const res = await fetch(`${BASE}/api/telegram/send`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: sendModal.telegram_chat_id, text: sendText }),
      });
      setSendResult(res.ok ? 'ok' : 'error');
      if (res.ok) { setSentId(sendModal.id); setTimeout(() => { setSentId(null); setSendModal(null); }, 1500); }
    } catch { setSendResult('error'); }
    finally { setSendingMsg(false); }
  };

  const handleLink = async () => {
    if (!linkModal || !linkPhone.trim()) return;
    setLinking(true); setLinkResult(null);
    try {
      const res = await fetch(`${BASE}/api/telegram/link`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: linkPhone, telegram_chat_id: linkModal.chat_id }),
      });
      const data = await res.json() as { updated: number };
      setLinkResult(data.updated > 0 ? `✓ Прив'язано до ${data.updated} запису` : 'Записів з таким номером не знайдено');
      if (data.updated > 0) {
        setTimeout(() => { setLinkModal(null); setLinkPhone(''); setLinkResult(null); loadPending(); }, 1800);
      }
    } catch { setLinkResult('Помилка'); }
    finally { setLinking(false); }
  };

  const copyBotLink = async () => {
    const link = `https://t.me/${botName || 'your_bot'}?start=dentis`;
    await navigator.clipboard.writeText(link);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const subTabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '7px 0', borderRadius: 10, fontSize: 13, fontWeight: active ? 600 : 400,
    background: active ? 'hsl(180 50% 20%)' : 'transparent',
    color: active ? 'hsl(40 30% 92%)' : 'hsl(180 20% 50%)',
    border: 'none', cursor: 'pointer', transition: 'all 0.15s',
    fontFamily: '"NueneMontreal", system-ui, sans-serif',
  });

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: 'hsl(180 60% 10%)', border: '1px solid hsl(180 40% 18% / 0.5)' }}>
        <button style={subTabStyle(subTab === 'appointments')} onClick={() => setSubTab('appointments')}>Записи</button>
        <button style={subTabStyle(subTab === 'pending')} onClick={() => setSubTab('pending')}>
          Очікують прив'язки {pending.length > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px]" style={{ background: 'hsl(38 62% 52% / 0.3)', color: 'hsl(38 70% 68%)' }}>{pending.length}</span>}
        </button>
        <button style={subTabStyle(subTab === 'settings')} onClick={() => setSubTab('settings')}>Налаштування</button>
      </div>

      {/* ── Appointments sub-tab ── */}
      {subTab === 'appointments' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-sm outline-none" style={{ ...lightInputStyle, minWidth: 140 }} />
              <button onClick={loadAppts} className="p-1.5 rounded-lg text-[hsl(180_20%_45%)] hover:text-[hsl(38_70%_68%)] transition-colors">
                <RefreshCw size={14} className={loadingAppts ? 'animate-spin' : ''} />
              </button>
            </div>
            <button onClick={() => { setEditing({}); setIsNew(true); }}
              className="flex items-center gap-2 gradient-gold text-[hsl(220_40%_10%)] px-4 py-2 rounded-xl text-sm font-semibold shadow-gold-custom hover:brightness-110 transition-all active:scale-95"
              style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
              <Plus size={16} />Новий запис
            </button>
          </div>

          {error && <div className="mb-4 flex items-center gap-2 text-red-400 text-sm"><AlertTriangle size={14} />{error}</div>}

          {loadingAppts ? (
            <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[hsl(38_62%_52%)]" /></div>
          ) : (
            <div className="space-y-2">
              {appts.length === 0 && (
                <p className="text-center text-[hsl(180_20%_45%)] text-sm py-10" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
                  Записів на {filterDate} немає
                </p>
              )}
              {appts.map(appt => {
                const { date, time } = formatApptDt(appt.appointment_dt);
                const hasTg = !!appt.telegram_chat_id;
                return (
                  <div key={appt.id} className="rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
                    style={{ background: 'hsl(180 60% 12%)', border: `1px solid ${appt.status === 'cancelled' ? 'hsl(0 60% 35% / 0.4)' : hasTg ? 'hsl(180 70% 40% / 0.35)' : 'hsl(180 40% 22% / 0.5)'}`, opacity: appt.status === 'cancelled' ? 0.6 : 1 }}>
                    {/* Час */}
                    <div className="flex-shrink-0 w-14 text-center rounded-xl py-2" style={{ background: 'hsl(180 50% 18%)' }}>
                      <p className="text-[hsl(38_62%_52%)] text-xs font-medium">{date}</p>
                      <p className="text-[hsl(40_30%_92%)] text-base font-semibold leading-tight">{time}</p>
                    </div>
                    {/* Інфо */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[hsl(40_30%_92%)] text-sm font-medium truncate" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{appt.patient_name}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: STATUS_COLOR[appt.status] + '22', color: STATUS_COLOR[appt.status], border: `1px solid ${STATUS_COLOR[appt.status]}44` }}>
                          {STATUS_LABEL[appt.status]}
                        </span>
                        {/* Telegram badge */}
                        <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1"
                          style={{ background: hasTg ? 'hsl(200 80% 30% / 0.3)' : 'hsl(180 50% 15%)', color: hasTg ? 'hsl(200 80% 70%)' : 'hsl(180 20% 40%)', border: `1px solid ${hasTg ? 'hsl(200 80% 45% / 0.4)' : 'hsl(180 40% 25% / 0.4)'}` }}>
                          <MessageCircle size={9} />{hasTg ? 'Telegram ✓' : 'Без Telegram'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-[hsl(180_20%_50%)] text-xs flex items-center gap-1"><Phone size={10} />{appt.phone}</p>
                        {appt.doctor && <p className="text-[hsl(38_50%_55%)] text-xs truncate">{appt.doctor}</p>}
                      </div>
                      {appt.status === 'scheduled' && hasTg && (
                        <div className="flex gap-1.5 mt-1">
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: appt.tg_reminded_24h ? 'hsl(200 80% 20%)' : 'hsl(180 50% 15%)', color: appt.tg_reminded_24h ? 'hsl(200 80% 60%)' : 'hsl(180 20% 45%)' }}>
                            TG 24г {appt.tg_reminded_24h ? '✓' : '○'}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: appt.tg_reminded_1h ? 'hsl(200 80% 20%)' : 'hsl(180 50% 15%)', color: appt.tg_reminded_1h ? 'hsl(200 80% 60%)' : 'hsl(180 20% 45%)' }}>
                            TG 1г {appt.tg_reminded_1h ? '✓' : '○'}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Дії */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {hasTg && (
                        <button onClick={() => { setSendModal(appt); setSendText(`Доброго дня, ${appt.patient_name}! Нагадуємо про ваш прийом у Дентіс 🦷`); setSendResult(null); }}
                          title="Написати у Telegram"
                          className="p-2 rounded-lg transition-all"
                          style={{ color: sentId === appt.id ? 'hsl(150 60% 55%)' : 'hsl(200 70% 60%)', background: sentId === appt.id ? 'hsl(150 50% 15%)' : 'transparent' }}>
                          {sentId === appt.id ? <CheckCheck size={15} /> : <MessageCircle size={15} />}
                        </button>
                      )}
                      <button onClick={() => { setEditing(appt); setIsNew(false); }} className="p-2 rounded-lg text-[hsl(180_20%_50%)] hover:text-[hsl(38_70%_68%)] hover:bg-[hsl(38_62%_52%/0.1)] transition-all"><Pencil size={15} /></button>
                      <button onClick={() => setDeleteId(appt.id)} className="p-2 rounded-lg text-[hsl(180_20%_50%)] hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {editing !== null && (
            <ModalShell title={isNew ? 'Новий запис' : 'Редагувати запис'} onClose={() => setEditing(null)}>
              <ApptForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} saving={saving} error={error} />
            </ModalShell>
          )}
          {deleteId !== null && <ConfirmDialog message="Видалити цей запис?" onConfirm={() => handleDelete(deleteId!)} onCancel={() => setDeleteId(null)} />}

          {/* Send Telegram message modal */}
          {sendModal && (
            <ModalShell title="Написати у Telegram" onClose={() => setSendModal(null)}>
              <div className="space-y-4">
                <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'hsl(200 60% 12%)', border: '1px solid hsl(200 60% 25% / 0.4)' }}>
                  <MessageCircle size={16} className="flex-shrink-0" style={{ color: 'hsl(200 80% 65%)' }} />
                  <div className="min-w-0">
                    <p className="text-[hsl(40_30%_90%)] text-sm font-medium truncate" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{sendModal.patient_name}</p>
                    <p className="text-[hsl(180_20%_50%)] text-xs">{sendModal.phone} · chat_id: {sendModal.telegram_chat_id}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Повідомлення</label>
                  <textarea value={sendText} onChange={e => setSendText(e.target.value)} rows={4}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
                </div>
                {sendResult && (
                  <div className={`rounded-xl px-3 py-2.5 text-sm text-center ${sendResult === 'ok' ? 'text-green-400' : 'text-red-400'}`}
                    style={{ background: sendResult === 'ok' ? 'hsl(150 50% 12%)' : 'hsl(0 50% 12%)', border: `1px solid ${sendResult === 'ok' ? 'hsl(150 50% 25%)' : 'hsl(0 50% 25%)'}` }}>
                    {sendResult === 'ok' ? '✓ Надіслано' : '✗ Помилка'}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => setSendModal(null)} className="flex-1 py-2.5 rounded-xl text-sm text-[hsl(180_20%_55%)] border border-[hsl(180_40%_22%/0.5)]" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Закрити</button>
                  <button onClick={handleSendTg} disabled={!sendText.trim() || sendingMsg || sendResult === 'ok'}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold gradient-gold text-[hsl(220_40%_10%)] shadow-gold-custom hover:brightness-110 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
                    {sendingMsg ? <><Loader2 size={15} className="animate-spin" />Надсилання...</> : <><Send size={15} />Надіслати</>}
                  </button>
                </div>
              </div>
            </ModalShell>
          )}
        </div>
      )}

      {/* ── Pending sub-tab ── */}
      {subTab === 'pending' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-[hsl(180_20%_55%)] text-sm" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
              Написали /start боту, але ще не прив'язані до запису
            </p>
            <button onClick={loadPending} className="p-1.5 rounded-lg text-[hsl(180_20%_45%)] hover:text-[hsl(38_70%_68%)] transition-colors">
              <RefreshCw size={14} className={loadingPending ? 'animate-spin' : ''} />
            </button>
          </div>

          {loadingPending ? (
            <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[hsl(38_62%_52%)]" /></div>
          ) : pending.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'hsl(200 70% 60%)' }} />
              <p className="text-[hsl(180_20%_45%)] text-sm" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
                Немає непідтверджених користувачів
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {pending.map(p => (
                <div key={p.id} className="rounded-2xl p-4 flex items-center gap-3"
                  style={{ background: 'hsl(180 60% 12%)', border: '1px solid hsl(200 60% 30% / 0.3)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'hsl(200 60% 20%)', color: 'hsl(200 80% 65%)' }}>
                    <MessageCircle size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[hsl(40_30%_90%)] text-sm font-medium" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{p.first_name || 'Без імені'}</p>
                    <p className="text-[hsl(180_20%_50%)] text-xs">chat_id: {p.chat_id}</p>
                    <p className="text-[hsl(180_20%_40%)] text-[10px]">{new Date(p.created_at).toLocaleString('uk-UA')}</p>
                  </div>
                  <button onClick={() => { setLinkModal(p); setLinkPhone(''); setLinkResult(null); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: 'hsl(38 62% 52% / 0.12)', color: 'hsl(38 70% 68%)', border: '1px solid hsl(38 62% 52% / 0.25)', fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
                    <LinkIcon size={12} />Прив'язати
                  </button>
                </div>
              ))}
            </div>
          )}

          {linkModal && (
            <ModalShell title={`Прив'язати ${linkModal.first_name || 'користувача'}`} onClose={() => setLinkModal(null)}>
              <div className="space-y-4">
                <div className="rounded-xl p-3" style={{ background: 'hsl(200 60% 12%)', border: '1px solid hsl(200 60% 25% / 0.4)' }}>
                  <p className="text-[hsl(40_30%_88%)] text-sm" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
                    Telegram: <span className="text-[hsl(200_80%_65%)] font-medium">{linkModal.first_name}</span> (chat_id: {linkModal.chat_id})
                  </p>
                </div>
                <div>
                  <label className="block text-[hsl(180_20%_55%)] text-xs mb-1.5 uppercase tracking-wider">Номер телефону пацієнта</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(180_20%_45%)]" />
                    <input value={linkPhone} onChange={e => { setLinkPhone(e.target.value); setLinkResult(null); }}
                      type="tel" placeholder="+380501234567"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm outline-none" style={lightInputStyle} />
                  </div>
                  {linkPhone.trim() && !validatePhone(linkPhone) && (
                    <p className="text-red-400 text-[11px] mt-1 px-1">Формат: +380XXXXXXXXX або 0XXXXXXXXX</p>
                  )}
                </div>
                {linkResult && (
                  <div className={`rounded-xl px-3 py-2.5 text-sm text-center ${linkResult.startsWith('✓') ? 'text-green-400' : 'text-[hsl(38_62%_55%)]'}`}
                    style={{ background: linkResult.startsWith('✓') ? 'hsl(150 50% 12%)' : 'hsl(38 40% 12%)', border: `1px solid ${linkResult.startsWith('✓') ? 'hsl(150 50% 25%)' : 'hsl(38 40% 25%)'}` }}>
                    {linkResult}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => setLinkModal(null)} className="flex-1 py-2.5 rounded-xl text-sm text-[hsl(180_20%_55%)] border border-[hsl(180_40%_22%/0.5)]" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Скасувати</button>
                  <button onClick={handleLink} disabled={!validatePhone(linkPhone) || linking}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold gradient-gold text-[hsl(220_40%_10%)] shadow-gold-custom hover:brightness-110 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
                    {linking ? <><Loader2 size={15} className="animate-spin" />Прив'язка...</> : <><Link2 size={15} />Прив'язати</>}
                  </button>
                </div>
              </div>
            </ModalShell>
          )}
        </div>
      )}

      {/* ── Settings sub-tab ── */}
      {subTab === 'settings' && (
        <div className="max-w-xl space-y-5">
          {/* Bot link */}
          <div className="rounded-2xl p-5" style={{ background: 'hsl(180 60% 12%)', border: '1px solid hsl(180 40% 22% / 0.5)' }}>
            <p className="text-[hsl(38_70%_68%)] text-xs font-semibold uppercase tracking-wider mb-3">Посилання для пацієнтів</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 rounded-xl px-3 py-2.5 text-sm" style={{ background: 'hsl(180 60% 8%)', color: 'hsl(200 80% 70%)', border: '1px solid hsl(200 60% 25% / 0.3)', fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
                https://t.me/dentis_notif_bot
              </div>
              <button onClick={async () => { await navigator.clipboard.writeText('https://t.me/dentis_notif_bot'); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
                style={{ background: 'hsl(38 62% 52% / 0.15)', color: 'hsl(38 70% 68%)', border: '1px solid hsl(38 62% 52% / 0.3)', fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
                {copied ? <><CheckCheck size={14} />Скопійовано</> : <><Copy size={14} />Копіювати</>}
              </button>
            </div>
            <p className="text-[hsl(180_20%_40%)] text-xs">Надішліть це посилання пацієнтам — після переходу бот запросить номер телефону</p>
          </div>

          {/* Flow reminder */}
          <div className="rounded-2xl p-5" style={{ background: 'hsl(38 62% 52% / 0.06)', border: '1px solid hsl(38 62% 52% / 0.2)' }}>
            <p className="text-[hsl(38_70%_68%)] text-xs font-semibold uppercase tracking-wider mb-3">Як це працює</p>
            <div className="space-y-2 text-sm" style={{ color: 'hsl(40 15% 65%)', fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
              <p>1. Пацієнт переходить за посиланням → пише /start боту</p>
              <p>2. Бот просить поділитись номером телефону</p>
              <p>3. Номер автоматично прив'язується до записів у базі</p>
              <p>4. За 24г та 1г до прийому — пацієнт отримує нагадування у Telegram</p>
              <p>5. При створенні запису — пацієнт отримує підтвердження</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const attemptsRef = React.useRef(0);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;
  const lockSecondsLeft = isLocked ? Math.ceil((lockedUntil! - Date.now()) / 1000) : 0;

  const handleSubmit = async () => {
    if (!password.trim() || isLocked) return;
    setChecking(true); setErrorMsg(null);
    try {
      const token = await loginForToken(password);
      attemptsRef.current = 0;
      onLogin(token);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg === 'TOO_MANY_ATTEMPTS') {
        setLockedUntil(Date.now() + 60_000);
        setErrorMsg('Забагато спроб. Зачекайте 60 секунд.');
      } else {
        attemptsRef.current += 1;
        if (attemptsRef.current >= 5) {
          setLockedUntil(Date.now() + 30_000);
          attemptsRef.current = 0;
        }
        setErrorMsg('Невірний пароль');
        setTimeout(() => setErrorMsg(null), 2500);
      }
      setPassword("");
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
              autoComplete="new-password"
              disabled={isLocked}
              style={{ background: "hsl(180 60% 15%)", border: `1px solid ${errorMsg ? "hsl(0 70% 50%)" : "hsl(180 40% 25%)"}`, color: "hsl(40 30% 88%)", fontFamily: '"NueneMontreal", system-ui, sans-serif' }} />
            {errorMsg && <p className="text-red-400 text-xs text-center" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>{errorMsg}</p>}
            {isLocked && !errorMsg && <p className="text-amber-400 text-xs text-center" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Забагато спроб. Зачекайте {lockSecondsLeft}с</p>}
            <button onClick={handleSubmit} disabled={checking || isLocked}
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

const SESSION_KEY = 'dentis-admin-jwt'

export default function Admin() {
  // Store JWT in sessionStorage — valid for 1h, cleared on tab close
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(SESSION_KEY));
  const [tab, setTab] = useState<Tab>("news");
  const navigate = useNavigate();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/admin-sw.js', { scope: '/d-panel' }).catch(() => {})
    }
  }, []);

  const handleLogin = (jwtToken: string) => {
    sessionStorage.setItem(SESSION_KEY, jwtToken);
    setToken(jwtToken);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setToken(null);
  };

  if (!token) return <LoginScreen onLogin={handleLogin} />;

  return (
    <>
      <Helmet>
        <title>Дентіс — Адмін панель</title>
        <link rel="manifest" href="/admin-manifest.json" />
        <link rel="apple-touch-icon" href="/admin-apple-touch-icon.png" />
        <meta name="theme-color" content="#0d1f3c" />
        <meta name="apple-mobile-web-app-title" content="Дентіс Адмін" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Helmet>
    <div className="min-h-screen" style={{ background: "hsl(180 60% 8%)" }}>
      <div className="sticky top-0 z-30" style={{
        background: "hsl(180 60% 10% / 0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid hsl(180 40% 18% / 0.5)",
      }}>
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="" className="w-7 h-7 rounded-lg" />
            <div>
              <p className="text-[hsl(38_70%_68%)] text-[10px] tracking-[0.25em] uppercase leading-none" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Дентіс</p>
              <p className="text-[hsl(40_30%_88%)] text-sm font-medium leading-tight" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>Адмінь</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/")} className="text-xs text-[hsl(180_20%_50%)] hover:text-[hsl(40_30%_80%)] px-3 py-1.5 rounded-lg hover:bg-[hsl(180_50%_15%)] transition-colors" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>На сайт</button>
            <button onClick={handleLogout} className="p-2 rounded-lg text-[hsl(180_20%_50%)] hover:text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={15} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex gap-1 p-1 rounded-2xl mb-6" style={{ background: "hsl(180 60% 10%)", border: "1px solid hsl(180 40% 18% / 0.5)" }}>
          <TabButton active={tab === "news"} onClick={() => setTab("news")} icon={<Newspaper size={15} />} label="Новини" />
          <TabButton active={tab === "doctors"} onClick={() => setTab("doctors")} icon={<Stethoscope size={15} />} label="Лікарі" />
          <TabButton active={tab === "appointments"} onClick={() => setTab("appointments")} icon={<CalendarDays size={15} />} label="Записи" />
          <TabButton active={tab === "push"} onClick={() => setTab("push")} icon={<Bell size={15} />} label="Push" />
          <TabButton active={tab === "telegram"} onClick={() => setTab("telegram")} icon={<MessageCircle size={15} />} label="Telegram" />
        </div>
        <style>{`
          @media (max-width: 480px) {
            .admin-tab-bar { gap: 2px !important; padding: 4px !important; }
          }
        `}</style>
        {tab === "news" && <NewsTab token={token} />}
        {tab === "doctors" && <DoctorsTab token={token} />}
        {tab === "appointments" && <AppointmentsTab token={token} />}
        {tab === "push" && <PushTab token={token} />}
        {tab === "telegram" && <TelegramTab token={token} />}
      </div>
    </div>
    </>
  );
}
