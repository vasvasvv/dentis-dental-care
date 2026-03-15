import { useEffect, useState } from 'react'
import { X, Download, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const STORAGE_KEY = 'dentis-pwa-banner-dismissed'

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Не показувати якщо вже встановлено або dismissed
    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    if (dismissed) return

    // Перевірка чи вже встановлено як PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
    if (isStandalone) return

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)

    if (ios) {
      // iOS не підтримує beforeinstallprompt — показуємо ручну інструкцію
      setTimeout(() => {
        setVisible(true)
        setMounted(true)
      }, 3000)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => {
        setVisible(true)
        setMounted(true)
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') handleDismiss()
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  if (!mounted) return null

  return (
    <>
      {/* Backdrop blur on mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-500 md:hidden ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleDismiss}
      />

      {/* Banner */}
      <div
        style={{
          fontFamily: '"NueneMontreal", system-ui, sans-serif',
        }}
        className={`
          fixed z-50 transition-all duration-500 ease-out
          bottom-4 left-4 right-4
          md:bottom-6 md:left-auto md:right-6 md:w-[360px]
          ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}
        `}
      >
        <div
          style={{
            background: 'linear-gradient(145deg, hsl(180 60% 18%) 0%, hsl(180 55% 22%) 100%)',
            border: '1px solid hsl(38 62% 52% / 0.3)',
            boxShadow: '0 20px 60px hsl(180 60% 10% / 0.5), 0 0 0 1px hsl(180 60% 25% / 0.2)',
          }}
          className="rounded-2xl overflow-hidden"
        >
          {/* Gold top accent line */}
          <div
            style={{
              background: 'linear-gradient(90deg, hsl(38 74% 58%), hsl(38 80% 70%), hsl(38 74% 58%))',
              height: '2px',
            }}
          />

          <div className="p-4">
            {/* Header row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div
                  style={{
                    background: 'hsl(38 62% 52% / 0.15)',
                    border: '1px solid hsl(38 62% 52% / 0.3)',
                  }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <img
                    src="/favicon.png"
                    alt="Дентіс"
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(38 74% 58%)" stroke-width="1.5"><path d="M12 2C9 2 6 5 6 8c0 2 1 4 2 5l1 8h6l1-8c1-1 2-3 2-5 0-3-3-6-6-6z"/></svg>`
                    }}
                  />
                </div>
                <div>
                  <p
                    style={{ color: 'hsl(38 70% 68%)', fontSize: '11px', letterSpacing: '0.08em' }}
                    className="uppercase font-medium mb-0.5"
                  >
                    Дентіс
                  </p>
                  <p
                    style={{ color: 'hsl(40 30% 92%)', fontSize: '15px' }}
                    className="font-medium leading-tight"
                  >
                    Додаток на головний екран
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                style={{ color: 'hsl(180 20% 60%)' }}
                className="hover:opacity-80 transition-opacity p-1 -mt-0.5 -mr-0.5"
                aria-label="Закрити"
              >
                <X size={16} />
              </button>
            </div>

            {/* Description */}
            {isIOS ? (
              <div
                style={{
                  background: 'hsl(180 60% 12% / 0.6)',
                  border: '1px solid hsl(180 40% 30% / 0.3)',
                  color: 'hsl(40 20% 75%)',
                  fontSize: '13px',
                }}
                className="rounded-xl p-3 mb-3 leading-relaxed"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone size={14} style={{ color: 'hsl(38 62% 52%)', flexShrink: 0 }} />
                  <span style={{ color: 'hsl(40 30% 88%)' }} className="font-medium text-xs">
                    Інструкція для iPhone
                  </span>
                </div>
                <ol className="space-y-1 pl-1">
                  <li className="flex gap-2">
                    <span style={{ color: 'hsl(38 62% 52%)' }} className="font-medium text-xs flex-shrink-0">1.</span>
                    <span className="text-xs">Натисніть{' '}
                      <span style={{ color: 'hsl(40 30% 88%)' }} className="inline-flex items-center gap-1">
                        «Поширити»
                        <svg width="11" height="13" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle', marginTop: '-1px' }}>
                          <path d="M6 10V1M6 1L3 4M6 1L9 4" stroke="hsl(40 30% 88%)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1 8v5a1 1 0 001 1h8a1 1 0 001-1V8" stroke="hsl(40 30% 88%)" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                      </span>
                    {' '}у Safari</span>
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: 'hsl(38 62% 52%)' }} className="font-medium text-xs flex-shrink-0">2.</span>
                    <span className="text-xs">Оберіть <span style={{ color: 'hsl(40 30% 88%)' }}>«На Початковий екран»</span></span>
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: 'hsl(38 62% 52%)' }} className="font-medium text-xs flex-shrink-0">3.</span>
                    <span className="text-xs">Натисніть <span style={{ color: 'hsl(40 30% 88%)' }}>«Додати»</span></span>
                  </li>
                </ol>
              </div>
            ) : (
              <p
                style={{ color: 'hsl(180 15% 65%)', fontSize: '13px' }}
                className="mb-3 leading-relaxed"
              >
                Швидкий доступ до клініки — без браузера.
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  style={{
                    background: 'linear-gradient(135deg, hsl(38 74% 52%), hsl(38 80% 60%))',
                    color: 'hsl(220 40% 10%)',
                    fontSize: '13px',
                    boxShadow: '0 4px 16px hsl(38 62% 52% / 0.35)',
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 font-medium transition-all hover:brightness-110 active:scale-95"
                >
                  <Download size={14} />
                  Встановити
                </button>
              )}
              <button
                onClick={handleDismiss}
                style={{
                  color: 'hsl(180 20% 55%)',
                  border: '1px solid hsl(180 30% 30% / 0.5)',
                  fontSize: '13px',
                }}
                className={`${isIOS ? 'flex-1' : ''} px-4 rounded-xl py-2.5 transition-all hover:brightness-125 active:scale-95`}
              >
                {isIOS ? 'Зрозуміло' : 'Пізніше'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}