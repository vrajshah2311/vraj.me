'use client'

import { motion } from 'framer-motion'

const CaseStudiesSection = () => {
  const caseStudies = [
    {
      id: 1,
      title: 'Profound Conversation Explorer',
      subtitle: 'Designing a tool that reveals what people actually ask AI',
      company: 'Profound',
      duration: '2 months',
      platform: '',
      role: 'Product Design',
      background: "Consumers increasingly sidestep traditional search engines and turn straight to conversational agents like ChatGPT, Perplexity and Copilot. Profound's Conversation Explorer arose from this shift. Unlike conventional SEO tools that rely on historic search data, CVE taps into a dataset of millions of real prompts to reveal what people actually ask AI. These insights help brands understand emerging topics, sentiment and intent across answer engines.",
      contribution: "As the lead designer on CVE, I took an early‑stage prototype and turned it into a polished product ready for customers. Working with data scientists, engineers and marketers, I conducted user interviews and competitive analysis to understand how marketers research keywords, designed and launched features like Bulk Keyword Analysis and a keyword‑hierarchy view, built a component library of atoms and molecules that now underpins Profound's design system, and balanced design decisions with data‑privacy constraints, ensuring sensitive prompts remained hidden while still delivering value.",
      research: {
        competitors: [
          "Semrush offers search‑volume, competition and cost‑per‑click metrics and can analyse up to 100 keywords at once",
          "Ahrefs uses AI to brainstorm seed keywords and instantly cluster them, providing ranking difficulty and traffic potential",
          "Ubersuggest covers search volume, SEO difficulty, cost‑per‑click and backlink data, but its keyword database is much smaller",
          "Google Trends compares search term popularity over time, across regions and categories, but only shows relative interest"
        ],
        insights: [
          "Authenticity: Marketers want to see what people actually ask AI tools, not just search‑engine queries",
          "Bulk entry: Competitors handle large keyword lists; CVE needed similar or better scale",
          "Hierarchy: Campaigns are organised by brand, category and subtopic. Users needed a way to group related queries",
          "Export: Results should be easy to download and integrate into existing workflows",
          "Clarity: Despite complex data, the interface had to be simple and reusable across the platform"
        ]
      },
      process: [
        {
          title: 'Building the system',
          description: "I created a design system of reusable atoms and molecules. Buttons, inputs and icons were designed with accessible colours and spacing; tables, charts and cards were assembled from these primitives. Each component had variants for loading, empty and error states to handle privacy restrictions gracefully."
        },
        {
          title: 'Bulk Keyword Analysis',
          description: "Inspired by Semrush's bulk analysis, we built a tool that lets users paste up to 100 keywords and select an AI platform. For each keyword, CVE returns prompt volume and trends over the past three months, comparative tables that sort by volume or growth, CSV exports for deeper analysis, and keyword hierarchy and recommendations."
        },
        {
          title: 'Keyword hierarchy and recommendations',
          description: "Borrowing ideas from Ahrefs' clustering and Google Trends' comparisons, I designed a tree view that groups related queries under parent topics. To surface new questions, we built a prompt‑recommendation engine that analyses real conversations to suggest valuable prompts and identify gaps."
        },
        {
          title: 'UI polish',
          description: "To keep CVE approachable, we used progressive disclosure so that tables and charts expand only when needed, tooltips explain how volumes are calculated, and a responsive layout and dark mode ensure the tool works across devices and meets accessibility standards."
        }
      ],
      impact: "Launching bulk analysis and the hierarchy view doubled adoption among existing customers. Marketers now spend less time compiling keywords and more time creating content strategies. The new components form the foundation of Profound's design system, accelerating development across the company. By combining real conversation data with bulk analysis and hierarchy, CVE offers a perspective that search‑based tools simply cannot.",
      future: "The next phase involves adding regional and language filters, incorporating sentiment and intent directly into the UI and extending the design system with dashboard templates. Conversation Explorer is already changing how marketers think about SEO; grounding design decisions in genuine AI conversations has positioned Profound to lead in this rapidly evolving space."
    }
  ]

  return (
    <section className="py-32 flex items-start justify-center">
              <div className="text-left w-[600px] px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-12"
        >
          {caseStudies.map((study) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="space-y-12"
            >
              {/* Case Study Header */}
              <div className="relative">
                {/* Left Column - Metadata (pushed outside container) */}
                <div className="absolute -left-40 w-32">
                  <div className="space-y-3 text-sm text-white/60">
                    <div>
                      <span className="font-medium text-white/80">Company</span>
                      <p>{study.company}</p>
                    </div>
                    <div>
                      <span className="font-medium text-white/80">Duration</span>
                      <p>{study.duration}</p>
                    </div>
                    {study.platform && (
                      <div>
                        <span className="font-medium text-white/80">Platform</span>
                        <p>{study.platform}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-white/80">Role</span>
                      <p>{study.role}</p>
                    </div>
                  </div>
                </div>
                
                {/* Main Content (stays within container) */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-heading-24 font-semibold text-white mb-2">{study.title}</h3>
                    <p className="text-white/70 text-[16px]">
                      {study.subtitle}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Background */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Why we built it</h4>
                  <p className="text-white/70 text-[16px] leading-relaxed font-normal">
                    {study.background}
                  </p>
                </div>

                {/* My contribution */}
                <div>
                  <h4 className="text-white font-semibold mb-3">My contribution</h4>
                  <p className="text-white/70 text-[16px] leading-relaxed font-normal">
                    {study.contribution}
                  </p>
                </div>

                {/* Research highlights */}
                <div>
                  <h4 className="text-white font-semibold mb-6">Research highlights</h4>
                  
                  {/* Competitor tools */}
                  <div className="mb-6">
                    <h5 className="text-white font-medium mb-3">Competitor tools</h5>
                    <div className="space-y-2">
                      {study.research.competitors.map((competitor, index) => (
                        <p key={index} className="text-white/70 text-[16px] leading-relaxed font-normal">
                          {competitor}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* User insights */}
                  <div>
                    <h5 className="text-white font-medium mb-3">User insights</h5>
                    <div className="space-y-2">
                      {study.research.insights.map((insight, index) => (
                        <p key={index} className="text-white/70 text-[16px] leading-relaxed font-normal">
                          {insight}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Design process */}
                <div>
                  <h4 className="text-white font-semibold mb-6">Design process</h4>
                  <div className="space-y-8">
                    {study.process.map((step, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex items-start gap-4">
                          <span className="text-white/40 text-sm font-mono mt-1">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          <div className="flex-1">
                            <h5 className="text-white font-semibold mb-2">{step.title}</h5>
                            <p className="text-white/70 text-[16px] leading-relaxed font-normal">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Impact</h4>
                  <p className="text-white/70 text-[16px] leading-relaxed font-normal">
                    {study.impact}
                  </p>
                </div>

                {/* Looking ahead */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Looking ahead</h4>
                  <p className="text-white/70 text-[16px] leading-relaxed font-normal">
                    {study.future}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default CaseStudiesSection 