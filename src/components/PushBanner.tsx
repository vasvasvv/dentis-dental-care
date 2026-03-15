import { useState, useEffect, useCallback } from 'react'
import { Bell, BellOff, Download, Smartphone, X, ChevronRight } from 'lucide-react'
import { usePushNotifications } from '@/hooks/usePushNotifications'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isPWA() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
  )
}

// ── Спливаючий банер ───────────────────────────────────────────────────────────
export function PushBanner() {
  const { state, subscribe } = usePushNotifications()

  // PWA install state
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  // Banner flow: 'pwa' | 'push' | null
  const [step, setStep] = useState<'pwa' | 'push' | null>(null)
  const [visible, setVisible] = useState(false)
  const [phone, setPhone] = useState('')

  useEffect(() => {
    // Якщо вже підписаний — нічого не показуємо
    if (state === 'subscribed' || state === 'denied' || state === 'unsupported') return

    const pushSeen = localStorage.getItem('push-banner-seen')
    if (pushSeen) return

    const installed = isPWA()
    setIsInstalled(installed)

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)

    if (installed) {
      // PWA вже встановлено — одразу показуємо push банер
      const t = setTimeout(() => { setStep('push'); setVisible(true) }, 5000)
      return () => clearTimeout(t)
    }

    // Чекаємо на beforeinstallprompt (Chrome/Android)
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      const t = setTimeout(() => { setStep('pwa'); setVisible(true) }, 8000)
      // зберігаємо таймер в замиканні — але не можемо скасувати після return
      void t
    }
    window.addEventListener('beforeinstallprompt', handler)

    // iOS — показуємо PWA інструкцію
    if (ios) {
      const t = setTimeout(() => { setStep('pwa'); setVisible(true) }, 8000)
      return () => { clearTimeout(t); window.removeEventListener('beforeinstallprompt', handler) }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [state])

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      setDeferredPrompt(null)
      if (outcome === 'accepted') {
        // Після встановлення переходимо до push
        setStep('push')
        return
      }
    }
    // Якщо відхилив або iOS — пропонуємо push без PWA
    setStep('push')
  }, [deferredPrompt])

  const handlePushAccept = useCallback(async () => {
    setVisible(false)
    localStorage.setItem('push-banner-seen', '1')
    await subscribe(phone.trim() || undefined)
  }, [subscribe, phone])

  const handleDismiss = useCallback(() => {
    setVisible(false)
    localStorage.setItem('push-banner-seen', '1')
  }, [])

  const handlePwaSkip = useCallback(() => {
    setStep('push')
  }, [])

  if (!step || state === 'subscribed') return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-6 md:max-w-sm z-50 rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, hsl(180 60% 11%) 0%, hsl(180 55% 14%) 100%)',
        border: '1px solid hsl(38 62% 52% / 0.25)',
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.45s ease',
        fontFamily: '"NueneMontreal", system-ui, sans-serif',
      }}
    >
      {/* Gold accent line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, hsl(38 74% 52%), hsl(38 80% 68%), hsl(38 74% 52%))' }} />

      <div className="p-5 md:p-4">
        {/* Close */}
        <button onClick={handleDismiss} className="absolute top-4 right-4 text-[hsl(180_20%_45%)] hover:text-[hsl(40_30%_75%)] transition-colors">
          <X size={15} />
        </button>

        {step === 'pwa' ? (
          /* ── PWA крок ── */
          <>
            <div className="flex items-center gap-3 mb-3 pr-5">
              <div className="w-12 h-12 md:w-10 md:h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: 'hsl(38 62% 52% / 0.12)', border: '1px solid hsl(38 62% 52% / 0.25)' }}>
                <img src="/favicon.png" alt="" className="w-8 h-8 md:w-7 md:h-7 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[hsl(38_70%_60%)] mb-0.5">Дентіс</p>
                <p className="text-[hsl(40_30%_92%)] text-base md:text-sm font-medium leading-snug">Додайте на головний екран</p>
              </div>
            </div>

            {isIOS ? (
              <div className="rounded-xl p-3 mb-3 text-xs leading-relaxed" style={{ background: 'hsl(180 55% 9%)', border: '1px solid hsl(180 40% 22% / 0.5)' }}>
                <div className="flex items-center gap-2 mb-2 text-[hsl(38_62%_52%)]">
                  <Smartphone size={13} />
                  <span className="font-medium">Для iPhone/iPad:</span>
                </div>
                <div className="space-y-1 text-[hsl(40_20%_70%)]">
                  <p><span className="text-[hsl(38_62%_52%)]">1.</span> Натисніть «Поділитися» в Safari</p>
                  <p><span className="text-[hsl(38_62%_52%)]">2.</span> Оберіть «На Початковий екран»</p>
                  <p><span className="text-[hsl(38_62%_52%)]">3.</span> Натисніть «Додати»</p>
                </div>
              </div>
            ) : (
              <p className="text-[hsl(180_15%_60%)] text-xs mb-3 leading-relaxed">
                Встановіть додаток — і сповіщення від клініки приходитимуть без рядка «from ...» у браузері.
              </p>
            )}

            <div className="flex gap-2">
              {!isIOS && deferredPrompt && (
                <button onClick={handleInstall}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 md:py-2.5 text-sm md:text-xs font-semibold transition-all hover:brightness-110 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, hsl(38 74% 52%), hsl(38 80% 62%))', color: 'hsl(220 40% 10%)', boxShadow: '0 4px 14px hsl(38 62% 52% / 0.3)' }}>
                  <Download size={14} />Встановити
                </button>
              )}
              <button onClick={isIOS ? handlePushAccept : handlePwaSkip}
                className="flex items-center justify-center gap-1 rounded-xl py-3 md:py-2.5 text-sm md:text-xs transition-all hover:brightness-125 active:scale-95"
                style={{ flex: (!isIOS && deferredPrompt) ? '0 0 auto' : 1, paddingLeft: 16, paddingRight: 16, color: 'hsl(180 20% 55%)', border: '1px solid hsl(180 35% 25% / 0.6)' }}>
                {isIOS ? 'Зрозуміло' : <><span>Пізніше</span><ChevronRight size={12} /></>}
              </button>
            </div>
          </>
        ) : (
          /* ── Push крок ── */
          <>
            <div className="flex items-center gap-3 mb-4 pr-5">
              <div className="w-12 h-12 md:w-10 md:h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: 'hsl(38 62% 52% / 0.12)', border: '1px solid hsl(38 62% 52% / 0.25)' }}>
                <Bell size={22} className="text-[hsl(38_62%_52%)]" />
              </div>
              <div>
                <p className="text-[hsl(40_30%_92%)] text-base md:text-sm font-medium leading-snug">Отримуйте сповіщення</p>
                <p className="text-[hsl(180_20%_55%)] text-sm md:text-xs mt-0.5">Акції, новини та нагадування про прийом</p>
              </div>
            </div>
            <div className="mb-3">
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Ваш номер (необов'язково)"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'hsl(180 30% 92%)', border: '1px solid hsl(180 40% 60%)', color: '#111', fontFamily: '"NueneMontreal", system-ui, sans-serif' }}
              />
              <p className="text-[hsl(180_20%_45%)] text-[10px] mt-1 px-1" style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}>
                {phone.trim() && !/^(\+?380\d{9}|0\d{9})$/.test(phone.replace(/\s/g, ''))
                  ? <span style={{ color: 'hsl(0 60% 55%)' }}>Формат: +380XXXXXXXXX або 0XXXXXXXXX</span>
                  : 'Для індивідуальних нагадувань про запис'}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleDismiss}
                className="px-4 py-3 md:py-2.5 rounded-xl text-sm md:text-xs transition-all hover:brightness-125"
                style={{ color: 'hsl(180 20% 50%)', border: '1px solid hsl(180 35% 25% / 0.6)' }}>
                Не зараз
              </button>
              <button onClick={handlePushAccept}
                className="flex-1 py-3 md:py-2.5 rounded-xl text-sm md:text-xs font-semibold transition-all hover:brightness-110 active:scale-95"
                style={{ background: 'linear-gradient(135deg, hsl(38 74% 52%), hsl(38 80% 62%))', color: 'hsl(220 40% 10%)', boxShadow: '0 4px 14px hsl(38 62% 52% / 0.3)' }}>
                Отримувати
              </button>
            </div>
          </>
        )}
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
      <button onClick={unsubscribe} title="Відписатись від сповіщень"
        className={`relative flex items-center justify-center rounded-full transition-all ${className}`}
        style={{ color: 'hsl(38 62% 52%)' }}>
        <Bell size={20} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[hsl(38_62%_52%)]" />
      </button>
    )
  }

  if (state === 'denied') {
    return (
      <button title="Сповіщення заблоковані в браузері"
        className={`flex items-center justify-center rounded-full opacity-40 cursor-not-allowed ${className}`}
        style={{ color: 'hsl(180 20% 50%)' }}>
        <BellOff size={20} />
      </button>
    )
  }

  return (
    <button onClick={subscribe} title="Підписатись на сповіщення"
      className={`flex items-center justify-center rounded-full transition-all hover:opacity-80 ${className}`}
      style={{ color: 'hsl(180 20% 55%)' }}>
      <Bell size={20} />
    </button>
  )
}
