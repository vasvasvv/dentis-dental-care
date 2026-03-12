// src/components/sections/AwardsSection.tsx
//
// Коли будуть готові реальні фото — замінити placeholder на реальні img:
  import award1 from '@/assets/award1.png'
  import award2 from '@/assets/award2.png'
  import award3 from '@/assets/award3.png'
// і замінити <AwardPlaceholder> на:
//   <img src={award.image} alt={award.title} className="w-full h-full object-cover" />

const awards = [
  {
    id: 1,
    title: 'Найкраща стоматологічна клініка',
    issuer: 'Народний бренд',
    year: '2025',
    image: award1,
  },
  {
    id: 2,
    title: 'Найкраща стоматологічна клініка',
    issuer: 'Народний бренд',
    year: '2023',
    image: award3,
  },
  {
    id: 3,
    title: 'Найкраща стоматологічна клініка',
    issuer: 'Народний бренд',
    year: '2022',
    image: award2,
  },
]


export default function AwardsSection() {
  return (
    <section id="awards" className="py-24">
      <div className="container mx-auto px-4">
      {/* Soft radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative">

        {/* Section header */}
        <div className="text-center mb-14">
        <div className="text-center mb-14">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Визнання</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary gold-line-center">
            Нагороди та сертифікати
          </h2>
        </div>

        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {awards.map((award, i) => (
            <div
              key={award.id}
              className="flex flex-col items-center bg-white rounded-2xl px-10 pt-8 pb-7 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              {/* Award image / placeholder */}
              <div className="w-44 h-44 rounded-xl overflow-hidden mb-6 shadow">
                <img src={award.image} alt={award.title} className="w-full h-full object-cover" />

              </div>

              {/* Text */}
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-500 mb-2">
                {award.year}
              </span>
              <h3 className="text-[15px] font-semibold text-slate-800 text-center mb-1 leading-snug">
                {award.title}
              </h3>
              <p className="text-sm text-slate-400 text-center leading-relaxed">
                {award.issuer}
              </p>
            </div>
          ))}
        </div>

      </div>
      </div>
    </section>
  )
}
