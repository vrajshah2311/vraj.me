'use client'

import { motion } from 'framer-motion'
import BouncyText from './BouncyText'

const ResumeSection = () => {
  const experience = [
    {
      company: 'Freelance',
      role: 'Product Designer & Developer',
      period: '2022 - Present',
      description: 'Building digital products and experiences for startups and agencies.',
      achievements: [
        'Designed and developed 10+ web applications',
        'Improved user engagement by 40% across projects',
        'Led design systems for 3 major brands'
      ],
      tech: ['React', 'Next.js', 'Figma', 'TypeScript']
    },
    {
      company: 'Various Startups',
      role: 'Full-Stack Developer',
      period: '2021 - 2022',
      description: 'Built scalable web applications and mobile experiences.',
      achievements: [
        'Developed 5+ production applications',
        'Reduced loading times by 60%',
        'Implemented CI/CD pipelines'
      ],
      tech: ['Node.js', 'React Native', 'AWS', 'PostgreSQL']
    }
  ]

  const skills = {
    'Design': ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
    'Development': ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    'Tools': ['Git', 'Docker', 'AWS', 'Framer', 'Vercel']
  }

  const projects = [
    {
      name: 'Orimi',
      description: 'Invoicing platform for freelancers',
      period: '2024',
      status: 'Live'
    },
    {
      name: 'Profound',
      description: 'AI-powered conversation explorer',
      period: '2024',
      status: 'Live'
    },
    {
      name: 'Orimi',
      description: 'Side project - Invoicing platform for freelancers',
      period: '2024',
      status: 'Side Project'
    }
  ]

  return (
    <section className="min-h-screen flex items-start justify-center pb-32" style={{ paddingTop: '120px' }}>
      <div className="text-left w-[600px] px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-left"
          >
            <div className="mb-4">
              <BouncyText 
                text="Experience"
                className="text-4xl font-bold text-white/90"
                delay={0.05}
                staggerDelay={0.015}
              />
            </div>
            <div className="max-w-md">
              <BouncyText 
                text="Product designer and developer focused on creating meaningful digital experiences."
                className="text-white/60 text-lg leading-relaxed"
                delay={0.3}
                staggerDelay={0.01}
              />
            </div>
          </motion.div>

          {/* Experience Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="space-y-8"
          >
            {experience.map((job, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                className="group relative"
              >
                {/* Background Card */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/2 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300"></div>
                
                {/* Content */}
                <div className="relative p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-white/90 font-semibold text-xl mb-1">{job.role}</h3>
                      <p className="text-white/60 text-lg">{job.company}</p>
                    </div>
                    <span className="text-white/40 text-sm font-medium tracking-wide bg-white/5 px-3 py-1 rounded-full">
                      {job.period}
                    </span>
                  </div>
                  
                  <p className="text-white/70 text-base leading-relaxed mb-6">{job.description}</p>
                  
                  {/* Achievements */}
                  <div className="space-y-3 mb-6">
                    {job.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                        <p className="text-white/60 text-sm leading-relaxed">{achievement}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {job.tech.map((tech, idx) => (
                      <span 
                        key={idx}
                        className="text-white/50 text-xs px-3 py-1 bg-white/5 rounded-full border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-white/90 mb-6">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(skills).map(([category, skillList], index) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-white/70 font-medium text-sm uppercase tracking-wide">{category}</h3>
                  <div className="space-y-2">
                    {skillList.map((skill, idx) => (
                      <div 
                        key={idx}
                        className="text-white/50 text-sm py-2 px-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-white/90 mb-6">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  className="group relative p-6 bg-gradient-to-br from-white/5 to-white/2 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white/90 font-semibold">{project.name}</h3>
                    <span className="text-green-400 text-xs font-medium bg-green-400/10 px-2 py-1 rounded-full">
                      {project.status}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-3">{project.description}</p>
                  <span className="text-white/40 text-xs">{project.period}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ResumeSection 