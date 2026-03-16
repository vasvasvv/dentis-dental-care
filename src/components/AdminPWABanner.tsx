import { useEffect, useState } from 'react'
import { X, Download, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const STORAGE_KEY = 'dentis-admin-pwa-dismissed'

export default function AdminPWABanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Register admin service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/admin-sw.js', { scope: '/d-panel' })
        .catch(() => {/* silent */})
    }

    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    if (dismissed) return

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
    if (isStandalone) return

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)

    if (ios) {
      setTimeout(() => { setVisible(true); setMounted(true) }, 4000)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => { setVisible(true); setMounted(true) }, 4000)
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
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-500 md:hidden ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleDismiss}
      />

      <div
        style={{ fontFamily: '"NueneMontreal", system-ui, sans-serif' }}
        className={`
          fixed z-50 transition-all duration-500 ease-out
          bottom-4 left-4 right-4
          md:bottom-6 md:left-auto md:right-6 md:w-[360px]
          ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}
        `}
      >
        <div
          style={{
            background: 'linear-gradient(145deg, #0d1f3c 0%, #1a3355 100%)',
            border: '1px solid hsl(38 62% 52% / 0.4)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(193,166,118,0.1)',
          }}
          className="rounded-2xl overflow-hidden"
        >
          {/* Gold top accent */}
          <div style={{ background: 'linear-gradient(90deg, #c1a676, #e0c98a, #c1a676)', height: '2px' }} />

          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  style={{ background: 'rgba(193,166,118,0.15)', border: '1px solid rgba(193,166,118,0.3)' }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <img
                    src="/admin-icon-192.png"
                    alt="Адмін"
                    className="w-8 h-8 object-contain rounded-lg"
                  />
                </div>
                <div>
                  <p style={{ color: '#c1a676', fontSize: '11px', letterSpacing: '0.08em' }} className="uppercase font-medium mb-0.5">
                    Дентіс
                  </p>
                  <p style={{ color: 'hsl(40 30% 92%)', fontSize: '15px' }} className="font-medium leading-tight">
                    Встановити адмін-панель
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                style={{ color: 'hsl(220 20% 55%)' }}
                className="hover:opacity-80 transition-opacity p-1 -mt-0.5 -mr-0.5"
                aria-label="Закрити"
              >
                <X size={16} />
              </button>
            </div>

            {/* iOS instruction */}
            {isIOS ? (
              <div
                style={{
                  background: 'rgba(10,25,60,0.6)',
                  border: '1px solid rgba(193,166,118,0.2)',
                  color: 'hsl(40 20% 75%)',
                  fontSize: '13px',
                }}
                className="rounded-xl p-3 mb-3 leading-relaxed"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone size={14} style={{ color: '#c1a676', flexShrink: 0 }} />
                  <span style={{ color: 'hsl(40 30% 88%)' }} className="font-medium text-xs">
                    Інструкція для iPhone
                  </span>
                </div>
                <ol className="space-y-1 pl-1">
                  <li className="flex gap-2">
                    <span style={{ color: '#c1a676' }} className="font-medium text-xs flex-shrink-0">1.</span>
                    <span className="text-xs">
                      Натисніть{' '}
                      <span style={{ color: 'hsl(40 30% 88%)' }} className="inline-flex items-center gap-1">
                        «Поширити»
                        <svg width="11" height="13" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle', marginTop: '-1px' }}>
                          <path d="M6 10V1M6 1L3 4M6 1L9 4" stroke="hsl(40 30% 88%)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1 8v5a1 1 0 001 1h8a1 1 0 001-1V8" stroke="hsl(40 30% 88%)" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                      </span>
                      {' '}у Safari
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: '#c1a676' }} className="font-medium text-xs flex-shrink-0">2.</span>
                    <span className="text-xs">Оберіть <span style={{ color: 'hsl(40 30% 88%)' }}>«На Початковий екран»</span></span>
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: '#c1a676' }} className="font-medium text-xs flex-shrink-0">3.</span>
                    <span className="text-xs">Натисніть <span style={{ color: 'hsl(40 30% 88%)' }}>«Додати»</span></span>
                  </li>
                </ol>
              </div>
            ) : (
              <p style={{ color: 'hsl(220 15% 60%)', fontSize: '13px' }} className="mb-3 leading-relaxed">
                Швидкий доступ до панелі керування — без браузера.
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  style={{
                    background: 'linear-gradient(135deg, #c1a676, #e0c98a)',
                    color: '#0d1f3c',
                    fontSize: '13px',
                    boxShadow: '0 4px 16px rgba(193,166,118,0.35)',
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
                  color: 'hsl(220 20% 55%)',
                  border: '1px solid rgba(193,166,118,0.2)',
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
