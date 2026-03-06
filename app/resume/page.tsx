import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vraj Shah — Resume',
  robots: { index: false },
}

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
      `}</style>

      {/* Print button */}
      <div className="no-print" style={{ position: 'fixed', top: 20, right: 20, zIndex: 100 }}>
        <button
          onClick={() => window.print()}
          style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
        >
          Print / Save PDF
        </button>
      </div>

      <div style={{ minHeight: '100vh', background: '#f0f0f0', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
        <div className="page" style={{ maxWidth: '794px', margin: '0 auto', background: '#fff', boxShadow: '0 4px 40px rgba(0,0,0,0.1)', padding: '56px 56px 64px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', paddingBottom: '28px', borderBottom: '1px solid #e5e5e5' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600, letterSpacing: '-0.03em', color: '#000', lineHeight: 1.1 }}>Vraj Shah</h1>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'rgba(0,0,0,0.5)', fontWeight: 400, letterSpacing: '-0.01em' }}>Product Designer</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: 'rgba(0,0,0,0.5)', lineHeight: 1.8, letterSpacing: '-0.01em' }}>
              <div><a href="https://cal.com/vraj-shah/say-hello-to-vraj" style={{ color: 'inherit', textDecoration: 'none' }}>Say hello</a></div>
              <div>vraj.me</div>
              <div>x.com/shahvraj99</div>
              <div>linkedin.com/in/vraj-shah-375990199</div>
            </div>
          </div>

          {/* About */}
          <div style={{ marginBottom: '36px' }}>
            <SectionLabel>About</SectionLabel>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.7, color: 'rgba(0,0,0,0.65)', maxWidth: '540px', letterSpacing: '-0.01em' }}>
              Product designer with a track record of building end-to-end experiences at fast-moving startups across fintech, AI, and health. I work across the full design process — from early concepts to shipped product — with a focus on clarity, craft, and things that actually work.
            </p>
          </div>

          {/* Experience */}
          <div style={{ marginBottom: '36px' }}>
            <SectionLabel>Experience</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              <ExperienceItem
                role="Product Designer"
                company="Peec AI"
                period="2024 – Present"
                bullets={[
                  'Designed the full product experience for an AI-powered marketing intelligence platform tracking brand visibility across paid and organic channels.',
                  'Built and shipped core features: prompt builder, actions flow, onboarding, data tables, URL details, and brand analytics views.',
                  'Worked closely with engineering and product to define interaction patterns and component systems from scratch.',
                ]}
              />

              <ExperienceItem
                role="Product Designer"
                company="Profound"
                location="New York, NY"
                period="2024"
                bullets={[
                  'Sole product designer at a startup tracking how AI agents (ChatGPT, Perplexity, etc.) talk about brands — processing 100M+ queries/month across 18 countries.',
                  'Designed the core dashboard, brand monitoring tools, reporting flows, and AI-generated insights UI.',
                  'Collaborated directly with founders to establish the full visual and interaction language of the product.',
                ]}
              />

              <ExperienceItem
                role="Product Designer"
                company="nSave"
                period="2023"
                bullets={[
                  'Led design from concept to launch for a cross-border fintech platform bringing savings, investments, and everyday banking to underbanked and high-inflation markets.',
                  'Owned the end-to-end design process across 11 shipped screens covering onboarding, accounts, and transactions.',
                ]}
              />

              <ExperienceItem
                role="Product Designer"
                company="Model ML"
                period="2023"
                bullets={[
                  'Designed the core dashboard and data visualization experience for a B2B ML platform helping teams build, deploy, and monitor AI models at scale.',
                ]}
              />

              <ExperienceItem
                role="Product Designer"
                company="Hale"
                period="2025"
                bullets={[
                  'Designed the end-to-end product experience for a health and wellness platform focused on personalized coaching and sustainable habit building.',
                ]}
              />

            </div>
          </div>

          {/* Skills */}
          <div style={{ marginBottom: '36px' }}>
            <SectionLabel>Skills</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
              <SkillGroup
                title="Design"
                items={['Product Design', 'UI / UX Design', 'Interaction Design', 'Design Systems', 'Prototyping & Wireframing']}
              />
              <SkillGroup
                title="Tools & Workflow"
                items={['Figma', 'Framer', 'Next.js / React', 'User Research', 'Cross-functional Collaboration']}
              />
            </div>
          </div>

          {/* Education — placeholder */}
          {/* Uncomment and fill in when ready
          <div>
            <SectionLabel>Education</SectionLabel>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <div>
                <div style={{ fontWeight: 500, color: '#000', letterSpacing: '-0.01em' }}>University Name</div>
                <div style={{ color: 'rgba(0,0,0,0.5)', marginTop: '2px' }}>Degree · Year – Year</div>
              </div>
            </div>
          </div>
          */}

        </div>
      </div>
    </>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '14px' }}>
      {children}
    </div>
  )
}

function ExperienceItem({ role, company, location, period, bullets }: {
  role: string
  company: string
  location?: string
  period: string
  bullets: string[]
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '0 24px' }}>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 500, color: '#000', letterSpacing: '-0.01em' }}>{company}</div>
        <div style={{ fontSize: '11.5px', color: 'rgba(0,0,0,0.45)', marginTop: '2px', letterSpacing: '-0.01em' }}>{period}</div>
        {location && <div style={{ fontSize: '11.5px', color: 'rgba(0,0,0,0.35)', marginTop: '1px', letterSpacing: '-0.01em' }}>{location}</div>}
      </div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 500, color: '#000', marginBottom: '6px', letterSpacing: '-0.01em' }}>{role}</div>
        <ul style={{ margin: 0, padding: '0 0 0 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ fontSize: '12px', lineHeight: 1.6, color: 'rgba(0,0,0,0.6)', letterSpacing: '-0.01em' }}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function SkillGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ fontSize: '12px', fontWeight: 500, color: '#000', marginBottom: '6px', letterSpacing: '-0.01em' }}>{title}</div>
      <ul style={{ margin: 0, padding: '0 0 0 14px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.5, letterSpacing: '-0.01em' }}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
