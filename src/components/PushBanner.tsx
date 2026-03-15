import { useState, useEffect } from 'react'
import { Bell, BellOff, X } from 'lucide-react'
import { usePushNotifications } from '@/hooks/usePushNotifications'

// ── Спливаючий банер при першому заході ───────────────────────────────────────
export function PushBanner() {
  const { state, subscribe } = usePushNotifications()
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (state === 'unsubscribed' && !dismissed) {
      const seen = localStorage.getItem('push-banner-seen')
      if (!seen) {
        // Показуємо через 8 секунд після завантаження
        const t = setTimeout(() => setVisible(true), 8000)
        return () => clearTimeout(t)
      }
    }
  }, [state, dismissed])

  const handleAccept = async () => {
    setVisible(false)
    localStorage.setItem('push-banner-seen', '1')
    await subscribe()
  }

  const handleDismiss = () => {
    setVisible(false)
    setDismissed(true)
    localStorage.setItem('push-banner-seen', '1')
  }

  if (!visible || state !== 'unsubscribed') return null

  return (
    <div
      className="fixed bottom-6 left-4 right-4 z-50 max-w-sm mx-auto rounded-2xl p-4 shadow-2xl"
      style={{
        background: 'hsl(180 60% 10%)',
        border: '1px solid hsl(38 62% 52% / 0.3)',
        animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-[hsl(180_20%_45%)] hover:text-[hsl(40_30%_80%)] transition-colors"
      >
        <X size={16} />
      </button>
      <div className="flex items-start gap-3 pr-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(38 62% 52% / 0.15)' }}>
          <Bell size={20} className="text-[hsl(38_62%_52%)]" />
        </div>
        <div>
          <p className="text-[hsl(40_30%_92%)] text-sm font-medium leading-snug" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
            Отримуйте сповіщення
          </p>
          <p className="text-[hsl(180_20%_55%)] text-xs mt-0.5 leading-relaxed" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
            Акції, нові послуги та важливі новини клініки
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-lg text-xs text-[hsl(180_20%_50%)] border border-[hsl(180_40%_22%/0.5)] hover:border-[hsl(180_40%_35%)] transition-colors"
              style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}
            >
              Не зараз
            </button>
            <button
              onClick={handleAccept}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold gradient-gold text-[hsl(220_40%_10%)] shadow-gold-custom hover:brightness-110 transition-all"
              style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}
            >
              Підписатись
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Кнопка дзвіночка для хедера ───────────────────────────────────────────────
export function PushButton({ className = '' }: { className?: string }) {
  const { state, subscribe, unsubscribe } = usePushNotifications()

  if (state === 'unsupported' || state === 'loading') return null

  if (state === 'subscribed') {
    return (
      <button
        onClick={unsubscribe}
        title="Відписатись від сповіщень"
        className={`relative flex items-center justify-center rounded-full transition-all ${className}`}
        style={{ color: 'hsl(38 62% 52%)' }}
      >
        <Bell size={20} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[hsl(38_62%_52%)]" />
      </button>
    )
  }

  if (state === 'denied') {
    return (
      <button
        title="Сповіщення заблоковані в браузері"
        className={`flex items-center justify-center rounded-full transition-all opacity-40 cursor-not-allowed ${className}`}
        style={{ color: 'hsl(180 20% 50%)' }}
      >
        <BellOff size={20} />
      </button>
    )
  }

  return (
    <button
      onClick={subscribe}
      title="Підписатись на сповіщення"
      className={`flex items-center justify-center rounded-full transition-all hover:opacity-80 ${className}`}
      style={{ color: 'hsl(180 20% 55%)' }}
    >
      <Bell size={20} />
    </button>
  )
}
