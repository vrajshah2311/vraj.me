'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import OpacityBox from './OpacityBox'
import BouncyText from './BouncyText'

const CaseStudies = () => {
  const [activeProject, setActiveProject] = useState(0)
  const [activeSection, setActiveSection] = useState('role')
  
  const projects = [
    {
      id: 1,
      title: 'Orimi',
      subtitle: 'Invoicing and payment management for freelancers',
      duration: 'Now',
      role: 'Founder',
      description: 'When I first went full time as a freelancer, I thought invoicing and payments would be the easy part. Turns out, they were the messiest. Every client had a different system. Some wanted hourly logs. Others needed contracts upfront. A few just ghosted after sending a brief. I found myself buried in spreadsheets, chasing down hours, rewriting invoices, and sending polite but pointed payment reminders. After too many late nights doing admin instead of actual work, I decided to fix it.',
      highlight: "That's how Orimi started.",
      hasOpacityBox: true
    },
    {
      id: 2,
      title: 'Profound',
      subtitle: 'Designing a tool to uncover what people actually ask AI',
      duration: '2 months',
      platform: '',
      role: 'Product Design',
      background: "As users shift from Google to tools like ChatGPT, Perplexity, and Copilot, traditional SEO tools fall short. They track search queries, not conversations. Profound's Conversation Explorer (CVE) bridges that gap, surfacing real prompts from millions of users across answer engines. These insights help brands track emerging topics, understand sentiment, and adapt their strategy for the AI-first internet.",
      contribution: "I led design for CVE, evolving it from a scrappy prototype into a production-ready product. I collaborated with data scientists, engineers, and marketers to conduct user interviews and competitive research, launch key features like Bulk Keyword Analysis and keyword hierarchy, build the foundational design system (atoms, molecules, components) now used across Profound, navigate data-privacy constraints while keeping the product genuinely useful, and redesign the date picker UI, replacing a frustrating experience with a clean, dual-calendar flow inspired by Airbnb.",
      process: [
        {
          title: 'A scalable design system',
          description: "I created a UI kit of accessible, reusable components — from buttons and inputs to complex cards and charts — each with clear states (loading, error, empty) to handle private data restrictions."
        },
        {
          title: 'Bulk Keyword Analysis',
          description: "We built a flow for users to drop in up to 100 keywords and choose a platform (e.g. ChatGPT or Perplexity). CVE returns prompt volume and trendlines, sortable tables for easy comparisons, CSV export for further analysis, and keyword hierarchy and recommended queries."
        },
        {
          title: 'Keyword hierarchy & recommendations',
          description: "I introduced a collapsible tree view for parent-child topic mapping, think 'EVs' > 'EV tax credits' > 'charging station costs'. We layered on Profound's prompt recommendation engine to surface high-potential queries rooted in real conversations."
        },
        {
          title: 'Date picker redesign',
          description: "The old date picker was clunky and error-prone, especially for date ranges spanning months. I redesigned it from the ground up, taking cues from Airbnb's booking UI. Dual calendars, tighter spacing, and fewer clicks made the experience intuitive and fast."
        },
        {
          title: 'UI polish',
          description: "I used progressive disclosure to keep the interface clean: tables and charts expand on demand, tooltips clarify metrics, and responsive layouts ensure the tool works across screens. Dark mode and WCAG AA compliance were built in from the start."
        }
      ],
      impact: "Adoption doubled after launching bulk analysis and hierarchy view. Marketers saved hours on research, shifting time toward strategy. The new design system accelerated dev velocity across Profound. CVE now offers a competitive edge by surfacing data that SEO tools simply can't touch.",
      future: "We're exploring regional and language filters, embedded sentiment and intent analysis, and new dashboard templates to extend the design system. CVE redefines how marketers think about keyword research in an AI-native world. Grounded in real prompts and thoughtful design, it's built not just for today, but for where search is going next."
    },
    {
      id: 3,
      title: 'nsave',
      subtitle: 'A Fintech Platform for the Rest of Us',
      duration: '6 months',
      platform: 'Web & Mobile',
      role: 'Founding Designer',
      background: "Nsave was founded to solve a critical gap: people from high-inflation economies often lack access to secure, stable banking. Traditional financial systems weren't built for them. Nsave changes that—offering a fully compliant, multi-currency account that lets users store wealth in USD, EUR, or GBP from anywhere. As the product matured, our challenge was to make it feel just as trustworthy and intuitive as a top-tier neobank—while staying nimble and legally compliant.",
      contribution: "As the founding designer, I led the entire brand and product redesign. My work spanned UX, UI, growth design, and marketing. I worked closely with founders, legal counsel, and engineering to reimagine the brand and visual identity, aligning trust with global accessibility; design and ship core money features: Investments, Savings, and Transfers; lead onboarding redesign to increase completion and trust signals; build a scalable design system used across web, mobile, and internal tools; and own all growth and marketing design — from Product Hunt to performance ads.",
      research: {
        competitors: [
          "Wise: Excellent international transfers, but limited on wealth preservation",
          "Revolut: Broad features but region-locked, with volatile user trust",
          "Western Union / Legacy banks: Accessible but slow, expensive, and outdated"
        ],
        insights: [
          "Trust and compliance—without friction or jargon",
          "A clean, modern experience that worked internationally",
          "Clear entry points into investing, saving, and moving funds",
          "A brand that felt global but empathetic",
          "An onboarding that reassured without overwhelming"
        ]
      },
      process: [
        {
          title: 'A full brand redesign',
          description: "We rebuilt the brand from the ground up—new logo, color system, typography, and tone of voice. It had to speak to trust, safety, and borderless access. We deliberately avoided cliché fintech blues and leaned into a warmer, modern palette that felt secure but human. Within 24 hours of launch, thousands signed up organically. The new look helped signal product maturity and investor-readiness."
        },
        {
          title: 'Core financial features',
          description: "I designed flows for Investments (launching with US Treasury-backed products and Shariah-compliant options via Zoya), Savings (structured options with clear returns and risk profiles), and Transfers (fast, intuitive money movement in and out of nsave accounts)."
        },
        {
          title: 'Onboarding revamp',
          description: "The previous onboarding flow caused drop-off due to compliance-heavy screens. I redesigned it with a clear progress tracker, in-context guidance, and progressive disclosure. I worked closely with our CTO and legal team to balance regulatory constraints with UX best practices. The result: a 33% lift in retention."
        },
        {
          title: 'Scalable design system',
          description: "I built the initial library of components: buttons, inputs, modals, cards, graphs—with clear states (loading, empty, error) to handle real-world data issues. It cut dev time by 75% across platforms and enabled the team to ship three major features in under 10 weeks."
        },
        {
          title: 'Growth & marketing design',
          description: "I owned creative across Product Hunt (where we hit #1), paid acquisition, and our public-facing site. Each piece reinforced the new brand tone and drove acquisition. We kept messaging sharp, visuals lightweight, and made sure our campaign design system was plug-and-play across web and mobile."
        }
      ],
      impact: "Thousands of signups in 24 hours post-launch. Increased DAU by 24.6%, retention up 33%. Built investor confidence, contributing to our successful $18M Series A raise. Cut dev time by 75% with the design system.",
      future: "Expand investment options and user controls. Launch Mastercard integration for global payments. Build native mobile app experience using the new design system. Nsave isn't just another fintech. It's a lifeline for people overlooked by the global banking system. Designing it meant building more than just features—it meant building trust from screen one."
    }
  ]

  // Removed auto scroll detection - navigation only changes on manual clicks

  // Simple scroll functions
  const scrollToProject = useCallback((index: number) => {
    setActiveProject(index)
    
    const element = document.getElementById(`project-${index}`)
    if (element) {
      const offset = 120
      const elementPosition = element.offsetTop
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
  }, [])

  const scrollToSection = useCallback((projectIndex: number, sectionId: string) => {
    // Extract the section type from the sectionId (e.g., 'section-process' -> 'process')
    const sectionType = sectionId.replace('section-', '')
    
    setActiveProject(projectIndex)
    setActiveSection(sectionType)
    
    const sectionElement = document.getElementById(`${sectionId}-${projectIndex}`)
    if (sectionElement) {
      const offset = 120
      const elementPosition = sectionElement.offsetTop
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
  }, [])

  return (
    <section className="pt-32 flex items-start justify-center relative" style={{ paddingTop: '40px' }}>
      {/* Navigation */}
      <div className="fixed left-7 top-1/2 transform -translate-y-1/2 z-40 hidden md:block bg-transparent overflow-visible">
        
        <div className="flex flex-col space-y-3 bg-transparent overflow-visible">
                      {projects.map((project, index) => (
              <div key={index} className="flex flex-col bg-transparent overflow-visible">
                <div className="relative space-y-1 bg-transparent overflow-visible">
                {/* Project Title */}
                <div
                  className={`text-[12px] flex items-center transition-all duration-200 ease-in-out cursor-pointer bg-transparent overflow-visible ${
                    activeProject === index 
                      ? 'text-white' 
                      : 'text-white/40 hover:text-white/80'
                  }`}
                  onClick={() => {
                    setActiveProject(index)
                    setActiveSection('role')
                    scrollToProject(index)
                  }}
                >
                  {project.title}
                </div>
                
                {/* Navigation Items */}
                <div 
                  className={`text-[12px] flex items-center transition-all duration-200 ease-in-out cursor-pointer bg-transparent relative overflow-visible ${
                    activeProject === index && activeSection === 'role' 
                      ? 'text-white' 
                      : 'text-white/30 hover:text-white/70 hover:bg-white/8'
                  }`}
                  onClick={() => {
                    setActiveProject(index)
                    setActiveSection('role')
                    scrollToSection(index, 'section-role')
                  }}
                >
                  {activeProject === index && activeSection === 'role' && (
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-white/5 w-32 h-[24px] -z-10"></div>
                  )}
                  ↳ My role
                </div>
                
                <div 
                  className={`text-[12px] flex items-center transition-all duration-200 ease-in-out cursor-pointer bg-transparent relative overflow-visible ${
                    activeProject === index && activeSection === 'process' 
                      ? 'text-white' 
                      : 'text-white/30 hover:text-white/70 hover:bg-white/8'
                  }`}
                  onClick={() => {
                    setActiveProject(index)
                    setActiveSection('process')
                    scrollToSection(index, 'section-process')
                  }}
                >
                  {activeProject === index && activeSection === 'process' && (
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-white/5 w-32 h-[24px] -z-10"></div>
                  )}
                  ↳ What I designed
                </div>
                
                <div 
                  className={`text-[12px] flex items-center transition-all duration-200 ease-in-out cursor-pointer bg-transparent relative overflow-visible ${
                    activeProject === index && activeSection === 'impact' 
                      ? 'text-white' 
                      : 'text-white/30 hover:text-white/70 hover:bg-white/8'
                  }`}
                  onClick={() => {
                    setActiveProject(index)
                    setActiveSection('impact')
                    scrollToSection(index, 'section-impact')
                  }}
                >
                  {activeProject === index && activeSection === 'impact' && (
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-white/5 w-32 h-[24px] -z-10"></div>
                  )}
                  ↳ Impact
                </div>
                
                <div 
                  className={`text-[12px] flex items-center transition-all duration-200 ease-in-out cursor-pointer bg-transparent relative overflow-visible ${
                    activeProject === index && activeSection === 'future' 
                      ? 'text-white' 
                      : 'text-white/30 hover:text-white/70 hover:bg-white/8'
                  }`}
                  onClick={() => {
                    setActiveProject(index)
                    setActiveSection('future')
                    scrollToSection(index, 'section-future')
                  }}
                >
                  {activeProject === index && activeSection === 'future' && (
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-white/5 w-32 h-[24px] -z-10"></div>
                  )}
                  ↳ What's next
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      

      
      {/* Content */}
      <div className="text-left w-full max-w-[600px] px-4 md:px-8 relative z-30">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col"
        >
          {projects.map((project, index) => (
            <div key={project.id} id={`project-${index}`} className="mb-32">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="space-y-12"
              >
                {/* Project Header */}
                <div>
                  <div>
                    <div className="mb-6">
                      <div className="mb-2">
                        <BouncyText 
                          text={project.title}
                          className="text-2xl md:text-heading-24 font-semibold text-white/90"
                          delay={0.05}
                          staggerDelay={0.015}
                        />
                      </div>
                      <div>
                        <BouncyText 
                          text={project.subtitle}
                          className="text-sm md:text-[16px] text-white/60"
                          delay={0.3}
                          staggerDelay={0.01}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex flex-wrap gap-8 mb-6 text-sm text-white/80">
                    {project.duration && (
                      <div>
                        <span className="font-medium text-white/80">Duration</span>
                        <p>{project.duration}</p>
                      </div>
                    )}
                    {project.platform && (
                      <div>
                        <span className="font-medium text-white/80">Platform</span>
                        <p>{project.platform}</p>
                      </div>
                    )}
                    {project.role && (
                      <div>
                        <span className="font-medium text-white/80">Role</span>
                        <p>{project.role}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Project Description */}
                {project.description && (
                  <div className="text-[16px] leading-relaxed font-normal text-white/60">
                    <div>
                      <BouncyText 
                        text={project.description}
                        className="text-sm md:text-[16px] leading-relaxed font-normal text-white/60"
                        delay={0.7}
                        staggerDelay={0.008}
                      />
                    </div>
                    {project.highlight && (
                      <div className="mt-4">
                        <BouncyText 
                          text={project.highlight}
                          className="text-white/60"
                          delay={0.9}
                          staggerDelay={0.01}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Opacity Box for Orimi */}
                {project.hasOpacityBox && <OpacityBox />}
                
                {/* Text below the box for Orimi */}
                {project.hasOpacityBox && (
                  <div className="mt-6 text-left">
                    <p className="text-white/60 text-[16px] leading-relaxed font-normal">
                      This is a custom box with specific dimensions and opacity settings. 
                      The box demonstrates the use of fixed width and height properties 
                      while maintaining a subtle appearance with low opacity.
                    </p>
                  </div>
                )}

                {/* Sections for Orimi */}
                {project.hasOpacityBox && (
                  <div>
                    {/* My role for Orimi */}
                    <div className="mb-12" id={`section-role-${index}`}>
                      <div className="mb-3">
                        <BouncyText 
                          text="My role"
                          className="font-semibold text-white/80"
                          delay={0.8}
                          staggerDelay={0.02}
                        />
                      </div>
                      <div>
                        <BouncyText 
                          text="As the founder of Orimi, I led the entire product development process from concept to launch, including user research, design, and strategic planning."
                          className="text-[16px] leading-relaxed font-normal text-white/60"
                          delay={1.0}
                          staggerDelay={0.012}
                        />
                      </div>
                    </div>

                    {/* What I designed for Orimi */}
                    <div className="mb-12" id={`section-process-${index}`}>
                      <div className="mb-6">
                        <BouncyText 
                          text="What I designed"
                          className="font-semibold text-white/80"
                          delay={1.0}
                          staggerDelay={0.02}
                        />
                      </div>
                      <div>
                        <BouncyText 
                          text="Designed the complete user interface and user experience for the Orimi platform, focusing on intuitive navigation and modern design principles."
                          className="text-[16px] leading-relaxed font-normal text-white/60"
                          delay={1.2}
                          staggerDelay={0.012}
                        />
                      </div>
                    </div>

                    {/* Impact for Orimi */}
                    <div className="mb-12" id={`section-impact-${index}`}>
                      <div className="mb-3">
                        <BouncyText 
                          text="Impact"
                          className="font-semibold text-white/80"
                          delay={1.4}
                          staggerDelay={0.02}
                        />
                      </div>
                      <div>
                        <BouncyText 
                          text="Successfully launched the platform with positive user feedback and increased engagement metrics."
                          className="text-[16px] leading-relaxed font-normal text-white/60"
                          delay={1.6}
                          staggerDelay={0.012}
                        />
                      </div>
                    </div>

                    {/* What's next for Orimi */}
                    <div className="mb-12" id={`section-future-${index}`}>
                      <div className="mb-3">
                        <BouncyText 
                          text="What's next"
                          className="font-semibold text-white/80"
                          delay={1.8}
                          staggerDelay={0.02}
                        />
                      </div>
                      <div>
                        <BouncyText 
                          text="Continuing to iterate on the design based on user feedback and expanding the platform's capabilities."
                          className="text-[16px] leading-relaxed font-normal text-white/60"
                          delay={2.0}
                          staggerDelay={0.012}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Case Study Content for Profound and Nsave */}
                {project.background && (
                  <div>
                    {/* My role for Profound and Nsave */}
                    <div className="mb-12" id={`section-role-${index}`}>
                      <div className="mb-3">
                        <BouncyText 
                          text="My role"
                          className="font-semibold text-white/80"
                          delay={1.6}
                          staggerDelay={0.02}
                        />
                      </div>
                      <div>
                        <BouncyText 
                          text={project.role}
                          className="text-[16px] leading-relaxed font-normal text-white/60"
                          delay={1.8}
                          staggerDelay={0.012}
                        />
                      </div>
                    </div>

                    {/* Background */}
                    <div className="mb-12" id={`section-background-${index}`}>
                      <div className="mb-3">
                        <BouncyText 
                          text="Why we built it"
                          className="font-semibold text-white/80"
                          delay={1.8}
                          staggerDelay={0.02}
                        />
                      </div>
                      <div>
                        <BouncyText 
                          text={project.background}
                          className="text-[16px] leading-relaxed font-normal text-white/60"
                          delay={2.0}
                          staggerDelay={0.012}
                        />
                      </div>
                    </div>
                    
                    {/* Opacity Box after Background */}
                    <div className="my-12">
                      <OpacityBox />
                    </div>

                    {/* My contribution */}
                    <div className="mb-12" id={`section-contribution-${index}`}>
                      <div className="mb-3">
                        <BouncyText 
                          text="My contribution"
                          className="font-semibold text-white/80"
                          delay={2.4}
                          staggerDelay={0.02}
                        />
                      </div>
                      <div>
                        <BouncyText 
                          text={project.contribution}
                          className="text-[16px] leading-relaxed font-normal text-white/60"
                          delay={2.6}
                          staggerDelay={0.012}
                        />
                      </div>
                    </div>
                    
                    {/* Opacity Box after Contribution */}
                    <div className="mb-12">
                      <OpacityBox />
                    </div>

                    {/* Design process */}
                    <div className="mb-12" id={`section-process-${index}`}>
                      <div className="mb-6">
                        <BouncyText 
                          text="What I designed"
                          className="font-semibold text-white/80"
                          delay={4.8}
                          staggerDelay={0.02}
                        />
                      </div>
                      <div className="space-y-8">
                        {project.process.map((step, idx) => (
                          <div key={idx}>
                            <div className="mb-3">
                              <BouncyText 
                                text={step.title}
                                className="font-semibold text-white/80"
                                delay={5.0 + (idx * 0.3)}
                                staggerDelay={0.02}
                              />
                            </div>
                            <div>
                              <BouncyText 
                                text={step.description}
                                className="text-[16px] leading-relaxed font-normal text-white/60"
                                delay={5.2 + (idx * 0.3)}
                                staggerDelay={0.012}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Impact */}
                    <div className="mb-12" id={`section-impact-${index}`}>
                      <div className="mb-3">
                        <BouncyText 
                          text="Impact"
                          className="font-semibold text-white/80"
                          delay={7.0}
                          staggerDelay={0.02}
                        />
                      </div>
                      <div>
                        <BouncyText 
                          text={project.impact}
                          className="text-[16px] leading-relaxed font-normal text-white/60"
                          delay={7.2}
                          staggerDelay={0.012}
                        />
                      </div>
                    </div>
                    
                    {/* Opacity Box after Impact */}
                    <div className="my-12">
                      <OpacityBox />
                    </div>

                    {/* Looking ahead */}
                    <div className="mb-12" id={`section-future-${index}`}>
                      <div className="mb-3">
                        <BouncyText 
                          text="What's next"
                          className="font-semibold text-white/80"
                          delay={7.6}
                          staggerDelay={0.02}
                        />
                      </div>
                      <div>
                        <BouncyText 
                          text={project.future}
                          className="text-[16px] leading-relaxed font-normal text-white/60"
                          delay={7.8}
                          staggerDelay={0.012}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
              
              {/* Divider between projects */}
              {index < projects.length - 1 && (
                <div className="flex justify-center my-12">
                  <div className="w-24 h-px" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}></div>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default CaseStudies 