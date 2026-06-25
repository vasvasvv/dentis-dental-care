const BASE = import.meta.env.VITE_API_URL ?? 'https://dentis-site-api.nesterenkovasil9.workers.dev';

export type PublicDoctor = {
  id: number;
  full_name: string;
  position: string;
  specialization: string | null;
  experience_years: number;
  description: string | null;
  photo_url: string | null;
  sort_order: number;
};

export type PublicNewsItem = {
  id: number;
  kind: 'news' | 'promo';
  label: string;
  title: string;
  description: string;
  expires_on: string | null;
  is_hot: number | boolean;
  published_at: string | null;
};

export type AppointmentRequestPayload = {
  patient_name: string;
  phone: string;
  problem: string;
};

export async function getPublicDoctors(): Promise<PublicDoctor[]> {
  const response = await fetch(`${BASE}/api/public/doctors`);
  if (!response.ok) throw new Error('Failed to fetch doctors');
  return response.json();
}

export async function getPublicNews(lang: 'uk' | 'en' = 'uk'): Promise<PublicNewsItem[]> {
  const response = await fetch(`${BASE}/api/public/news?lang=${lang}`);
  if (!response.ok) throw new Error('Failed to fetch news');
  return response.json();
}

export async function sendAppointmentRequest(payload: AppointmentRequestPayload): Promise<void> {
  const response = await fetch(`${BASE}/api/public/appointment-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Failed to send appointment request';
    const data = await response.json().catch(() => null);
    if (typeof data?.error === 'string') message = data.error;
    throw new Error(message);
  }
}
