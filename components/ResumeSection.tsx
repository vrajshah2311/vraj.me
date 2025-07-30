'use client'

import { motion } from 'framer-motion'

const ResumeSection = () => {
  const experience = [
    {
      company: 'Luma',
      role: 'Product Designer',
      period: '2020 - Present',
      description: 'Designing interfaces and experiences for millions of users. Leading design initiatives for guest and host experiences.',
      achievements: [
        'Led design for core booking flow used by 2M+ monthly users',
        'Redesigned host dashboard improving conversion by 15%',
        'Established design system used across 50+ features'
      ]
    },
    {
      company: 'Freelance',
      role: 'UI/UX Designer',
      period: '2019 - 2020',
      description: 'Worked with startups and agencies to create user-centered digital experiences.',
      achievements: [
        'Designed mobile apps for 3 early-stage startups',
        'Created brand identities and design systems',
        'Improved user engagement by 25% across projects'
      ]
    }
  ]

  const education = [
    {
      institution: 'Design Institute',
      degree: 'Bachelor of Design',
      period: '2016 - 2020',
      description: 'Focused on user experience design, interaction design, and design thinking methodologies.'
    }
  ]

  const skills = [
    'Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research', 
    'Design Systems', 'Interaction Design', 'Visual Design', 'Design Thinking'
  ]

  const projects = [
    {
      name: 'Queue',
      description: 'A podcast app built with SwiftUI and ChatGPT integration',
      period: '2024'
    },
    {
      name: 'Canopi',
      description: 'Design system and component library for web applications',
      period: '2023'
    }
  ]

  return (
    <section className="min-h-screen flex items-start justify-center pb-32" style={{ paddingTop: '120px' }}>
      <div className="text-left max-w-2xl px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-10"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-left"
          >
            <h1 className="text-heading-24 font-semibold text-white mb-3">Resume</h1>
            <div className="w-12 h-px bg-white/20 mb-4"></div>
            <p className="text-white/60 text-[15px] leading-relaxed max-w-md">
              Designer, dancer and DJ living in Dubai. Born in Vadodara, India. 
              For the past 4 years, I've been designing interfaces at Luma.
            </p>
          </motion.div>

          {/* Experience */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="space-y-6">
              {experience.map((job, index) => (
                <div key={index} className="group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium text-lg">{job.role}</h3>
                      <p className="text-white/60 text-sm">{job.company}</p>
                    </div>
                    <span className="text-white/40 text-xs font-medium tracking-wide">{job.period}</span>
                  </div>
                  <p className="text-white/70 text-[15px] leading-relaxed mb-3">{job.description}</p>
                  <div className="space-y-1.5">
                    {job.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-white/30 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-white/50 text-[14px] leading-relaxed">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-medium text-lg">{edu.degree}</h3>
                      <p className="text-white/60 text-sm">{edu.institution}</p>
                    </div>
                    <span className="text-white/40 text-xs font-medium tracking-wide">{edu.period}</span>
                  </div>
                  <p className="text-white/70 text-[15px] leading-relaxed">{edu.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="grid grid-cols-2 gap-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="text-white/60 text-[14px] py-2 px-3 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                >
                  {skill}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="space-y-3">
              {projects.map((project, index) => (
                <div key={index} className="border border-white/10 rounded-lg p-3 hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-medium">{project.name}</h3>
                    <span className="text-white/40 text-xs font-medium tracking-wide">{project.period}</span>
                  </div>
                  <p className="text-white/60 text-[14px] leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ResumeSection 