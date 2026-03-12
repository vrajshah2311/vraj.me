import type { Metadata } from 'next'
import PrintButton from './PrintButton'

export const metadata: Metadata = {
  title: 'Vraj Shah — Resume',
  robots: { index: false },
}

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const experience = [
  {
    company: 'Peec AI',
    role: 'Founding Designer',
    period: '2024 – Present',
    location: 'Berlin, DE',
    bullets: [
      'First and sole designer — built the entire product from 0 to 1, establishing the visual language, component system, and interaction patterns.',
      'Shipped core product features end-to-end: prompt builder, actions flow, brand analytics, data tables, URL details, and onboarding.',
      'Worked directly with founders and engineering to ship fast without sacrificing craft.',
    ],
  },
  {
    company: 'Profound',
    role: 'Product Designer',
    period: '2024',
    location: 'New York, NY',
    bullets: [
      'Sole designer at an AI visibility startup tracking how models like ChatGPT and Perplexity talk about brands — 100M+ queries/month across 18 countries.',
      'Designed the core dashboard, brand monitoring tools, AI-generated insights UI, and reporting flows.',
    ],
  },
  {
    company: 'Model ML',
    role: 'Product Designer',
    period: '2023',
    location: '',
    bullets: [
      'Designed the dashboard and data visualisation experience for a B2B ML platform helping teams build, deploy, and monitor AI models at scale.',
    ],
  },
  {
    company: 'nsave',
    role: 'Product Designer',
    period: '2022 – 2023',
    location: 'London, UK',
    bullets: [
      'Led design from concept to launch for a cross-border fintech bringing USD/EUR savings and everyday banking to underbanked, high-inflation markets.',
      'Owned end-to-end design across 11 shipped screens: onboarding, accounts, transactions, and investments.',
    ],
  },
  {
    company: 'Context',
    role: 'Product Designer',
    period: '2021 – 2022',
    location: '',
    bullets: [
      'Led design initiatives across the core product, enhancing user experiences and contributing to scalable design systems.',
    ],
  },
  {
    company: 'Hale',
    role: 'Product Designer',
    period: '2020 – 2021',
    location: '',
    bullets: [
      'Designed the end-to-end product experience for a health and wellness platform focused on personalised coaching and habit building.',
    ],
  },
]

const skills = ['Product Design', 'UI / UX', 'Interaction Design', 'Design Systems', 'Prototyping', 'User Research', 'Figma', 'Framer', 'Next.js / React', 'Cross-functional Leadership']

export default function ResumePage() {
  return (
    <>
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; min-height: 100vh; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: #f0f0f0; }
        a { color: inherit; text-decoration: none; }
      `}</style>

      <PrintButton />

      <div style={{ minHeight: '100vh', background: '#f0f0f0', padding: '40px 20px', fontFamily: SF }}>
        <div className="page" style={{ maxWidth: '794px', margin: '0 auto', background: '#fff', boxShadow: '0 4px 40px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>

          {/* Top accent bar */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, rgba(245,48,0,0.9), rgba(255,130,100,0.7))' }} />

          <div style={{ padding: '48px 56px 56px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700, letterSpacing: '-0.04em', color: '#000', lineHeight: 1 }}>Vraj Shah</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(245,48,0,0.9)', letterSpacing: '-0.01em' }}>Founding Designer</span>
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(0,0,0,0.2)', display: 'inline-block' }} />
                  <span style={{ fontSize: '13px', color: 'rgba(0,0,0,0.45)', letterSpacing: '-0.01em' }}>Berlin, DE</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11.5px', color: 'rgba(0,0,0,0.45)', lineHeight: 2, letterSpacing: '-0.01em' }}>
                <div><a href="https://vraj.me">vraj.me</a></div>
                <div><a href="https://x.com/shahvraj99">x.com/shahvraj99</a></div>
                <div><a href="https://linkedin.com/in/vraj-shah-375990199">linkedin.com/in/vraj-shah-375990199</a></div>
                <div><a href="https://cal.com/vraj-shah/say-hello-to-vraj">cal.com/vraj-shah</a></div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#ebebeb', marginBottom: '32px' }} />

            {/* About */}
            <div style={{ marginBottom: '32px' }}>
              <SectionLabel>About</SectionLabel>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.75, color: 'rgba(0,0,0,0.62)', maxWidth: '560px', letterSpacing: '-0.01em' }}>
                Product designer with a multidisciplinary background in business and engineering. I specialise in 0→1 product work at fast-moving startups — across fintech, AI, and health — where I own the full design process from early concept to shipped product. I care about clarity, craft, and building things that actually work for real people.
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#ebebeb', marginBottom: '32px' }} />

            {/* Experience */}
            <div style={{ marginBottom: '32px' }}>
              <SectionLabel>Experience</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {experience.map((job, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '0 28px' }}>
                    {/* Left */}
                    <div style={{ paddingTop: '1px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#000', letterSpacing: '-0.02em' }}>{job.company}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', marginTop: '3px', letterSpacing: '-0.01em' }}>{job.period}</div>
                      {job.location && <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.3)', marginTop: '1px', letterSpacing: '-0.01em' }}>{job.location}</div>}
                    </div>
                    {/* Right */}
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111', marginBottom: '7px', letterSpacing: '-0.02em' }}>{job.role}</div>
                      <ul style={{ margin: 0, padding: '0 0 0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {job.bullets.map((b, bi) => (
                          <li key={bi} style={{ fontSize: '11.5px', lineHeight: 1.65, color: 'rgba(0,0,0,0.58)', letterSpacing: '-0.01em' }}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#ebebeb', marginBottom: '32px' }} />

            {/* Education */}
            <div style={{ marginBottom: '32px' }}>
              <SectionLabel>Education</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '0 28px' }}>
                <div style={{ paddingTop: '1px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#000', letterSpacing: '-0.02em' }}>University of York</div>
                  <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', marginTop: '3px', letterSpacing: '-0.01em' }}>York, UK</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#111', letterSpacing: '-0.02em' }}>Master's in Business Administration</div>
                  <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', marginTop: '3px', letterSpacing: '-0.01em' }}>Multidisciplinary foundation spanning business strategy, engineering, and human-centred design.</div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#ebebeb', marginBottom: '32px' }} />

            {/* Skills */}
            <div>
              <SectionLabel>Skills</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {skills.map((skill, i) => (
                  <span key={i} style={{ fontSize: '11.5px', fontWeight: 500, color: 'rgba(0,0,0,0.6)', background: '#f5f5f5', borderRadius: '5px', padding: '3px 9px', letterSpacing: '-0.01em' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: '16px', fontFamily: SF }}>
      {children}
    </div>
  )
}
