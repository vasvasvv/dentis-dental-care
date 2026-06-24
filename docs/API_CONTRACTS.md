# API_CONTRACTS

Публічний сайт читає дані з `dentis-site-api`.

## Public news

`GET /api/public/news?lang=uk|en`

`lang` необов'язковий, за замовчуванням `uk`. Для `lang=en` API повертає тільки записи з заповненими англомовними `title_en` і `desc_en`, щоб не підмішувати український текст.

Повертає масив:

```ts
{
  id: number
  kind: "news" | "promo"
  label: string
  title: string
  description: string
  expires_on: string | null
  is_hot: number
  published_at: string | null
}
```

Admin API `/api/news` зберігає базові поля `type/badge/desc/date/hot` і додаткові англомовні поля `badge_en/title_en/desc_en/date_en`.

Заплановані публікації `/api/scheduled-articles` приймають і зберігають `badge_en/title_en/desc_en`; під час публікації ці поля копіюються в `news`.

## Public doctors

`GET /api/public/doctors`

Повертає масив:

```ts
{
  id: number
  full_name: string
  position: string
  specialization: string | null
  experience_years: number
  description: string | null
  photo_url: string | null
  sort_order: number
}
```

Контактні CTA використовують `tel:+380504800825`. Події аналітики мають залишатися сумісними з `dataLayer` і `gtag`, навіть якщо GTM/GA завантажуються відкладено.
