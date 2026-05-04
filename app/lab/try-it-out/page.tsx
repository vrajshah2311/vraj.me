'use client'

import LabCard from '@/components/LabCard'

const tryCards = [
  { title: 'Actions', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-01.mp4', href: '/canvas/hallucination', noModal: true },
  { title: 'Toasts', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/toasts.mp4', href: '/canvas/toasts', noModal: true },
  { title: 'Dropdown', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/dropdown.mp4', href: '/canvas/labels-dropdown', noModal: true },
  { title: 'Orb', subtitle: 'Animation', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/orb.mp4', href: '/canvas/orb', noModal: true },
]

export default function TryItOutPage() {
  return (
    <>
      <style>{`
        .lab-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          width: 100%;
        }
        @media (max-width: 900px) {
          .lab-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .lab-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <main className="relative overflow-x-hidden" style={{ backgroundColor: '#fff' }}>
        <div className="flex justify-center">
          <div className="w-full max-w-[600px] px-5 sm:px-8 lg:px-[32px]">
            <div className="pt-[20px] sm:pt-[90px] md:pt-[110px] lg:pt-[130px] xl:pt-[148px] 2xl:pt-[170px]">
              <h1 className="text-[22px]" style={{
                fontWeight: '600',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em', lineHeight: '1.1',
              }}>
                Try it out
              </h1>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 48, padding: '0 32px 32px' }}>
          <div className="lab-grid" style={{
            animation: 'labFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {tryCards.map(card => (
              <LabCard key={card.href} {...card} />
            ))}
          </div>
        </div>
        <div style={{ height: 80 }} />
      </main>
      <style>{`
        @keyframes labFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
