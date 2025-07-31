'use client'

import { motion } from 'framer-motion'

const CaseStudiesSection = () => {
  const caseStudies = [
    {
      id: 1,
      title: 'Helping Creators post quality content',
      subtitle: 'Running quick and broad experiments to figure out how to help creators create meaningful content',
      company: 'LinkedIn Creators',
      duration: '12 months',
      platform: 'Mobile, Web',
      role: 'Design Lead',
      background: "So far, your LinkedIn feed has been filled with average content. Acquaintances announcing new jobs. Five learnings from doing good in the community. These are great, but they don't necessarily help your career. We want to change that. We want to make the Feed a great place to learn and boost your career further.",
      research: "Quality content is integral to LinkedIn's content ecosystem. Our UX Research team has identified six core pillars of creator needs that our team needs to design for in order to help creators thrive on LinkedIn.",
      approach: "Because LinkedIn is new to the creator game, we move quickly to validate ideas to see what effectively helps our creators get on top of their game. Each experiments took less than a quarter from design to shipping. We monitor the metrics and deliver learnings to Notifications, Feed, Analytics and Profile teams so they can use these learnings to iterate their features.",
      experiments: [
        {
          id: 1,
          title: 'Nudging to reshare when mentioned',
          description: "When a member is mentioned in a post, the conversation is likely to include a high quality opinion. Therefore we nudge the member to reshare the post to add their voice as a post in addition to the comment to spark meaningful conversation on LinkedIn.",
          metrics: [
            { label: 'Pure reshares', value: '+24.26%' },
            { label: 'DMPC', value: '+0.96%', note: '(members who create or reshare on a given day and have 500+ non-connection followers)' }
          ]
        },
        {
          id: 2,
          title: 'Creator content recommendation',
          description: "By using AI to analyze member's Profile, we were able to categorize members' interests and recommend content they might want to reshare. Everyday, we recommend three posts that are of their interest to help them get inspired on post to create.",
          metrics: [
            { label: 'Sessions', value: '+0.03%' },
            { label: 'DCC', value: '+0.09%', note: '(members who create or reshare post on a given day)' }
          ]
        },
        {
          id: 3,
          title: 'Sharebox Prompts',
          description: "Sharebox on the Feed is the first thing any creator sees on LinkedIn. Using the Interests AI and their recent Profile edits, we give post inspirations in this prime space to give inspiration for the Creators to post to their audience.",
          metrics: [
            { label: 'Net Content Shared', value: '+4.13%' }
          ]
        },
        {
          id: 4,
          title: 'Share your achievement',
          description: "When users update their Linkedin Profile, it usually calls for a celebratory moment. New job, promotion, starting a new school, or obtaining a certificate, all of these moments are worth sharing with their network and we made it very easy to do so.",
          metrics: [
            { label: 'Net Content Shared', value: '+20%' },
            { label: 'DCC', value: '+1%' },
            { label: 'of all user posts', value: '6.5%' }
          ]
        }
      ]
    }
  ]

  return (
    <section className="py-32 flex items-start justify-center">
      <div className="text-left w-[464px] px-8">
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
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-heading-24 font-semibold text-white">{study.title}</h3>
                  </div>
                  <p className="text-white/70 text-[16px] mb-2">
                    {study.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-white/60">
                    <span>{study.company}</span>
                    <span>•</span>
                    <span>{study.duration}</span>
                    <span>•</span>
                    <span>{study.platform}</span>
                    <span>•</span>
                    <span>{study.role}</span>
                  </div>
                </div>
              </div>
              
              {/* Background */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Background</h4>
                  <p className="text-white/70 text-[16px] leading-relaxed font-normal">
                    {study.background}
                  </p>
                </div>

                {/* UX Research */}
                <div>
                  <h4 className="text-white font-semibold mb-3">UX Research</h4>
                  <p className="text-white/70 text-[16px] leading-relaxed font-normal">
                    {study.research}
                  </p>
                </div>

                {/* Approach */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Approach</h4>
                  <p className="text-white/70 text-[16px] leading-relaxed font-normal">
                    {study.approach}
                  </p>
                </div>

                {/* Experiments */}
                <div>
                  <h4 className="text-white font-semibold mb-6">Experiments</h4>
                  <div className="space-y-8">
                    {study.experiments.map((experiment, index) => (
                      <div key={experiment.id} className="space-y-4">
                        <div className="flex items-start gap-4">
                          <span className="text-white/40 text-sm font-mono mt-1">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          <div className="flex-1">
                            <h5 className="text-white font-semibold mb-2">{experiment.title}</h5>
                            <p className="text-white/70 text-[16px] leading-relaxed font-normal mb-4">
                              {experiment.description}
                            </p>
                            <div className="space-y-2">
                              {experiment.metrics.map((metric, metricIndex) => (
                                <div key={metricIndex} className="flex items-center gap-2">
                                  <span className="text-white font-semibold">{metric.value}</span>
                                  <span className="text-white/70">{metric.label}</span>
                                  {metric.note && (
                                    <span className="text-white/50 text-sm">({metric.note})</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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