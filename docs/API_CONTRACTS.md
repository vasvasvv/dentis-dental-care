# API_CONTRACTS

Публічний сайт читає дані з `dentis-site-api`.

## Public news

`GET /api/public/news`

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

Admin API `/api/news` лишається у старому форматі `type/badge/desc/date/hot`.

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
