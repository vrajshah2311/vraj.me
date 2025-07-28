'use client'

import { motion } from 'framer-motion'
import { Code, Palette, Smartphone, Globe } from 'lucide-react'

const AboutSection = () => {
  const stats = [
    { number: '50+', label: 'Projects Completed' },
    { number: '3+', label: 'Years Experience' },
    { number: '100%', label: 'Client Satisfaction' },
  ]

  const skillCategories = [
    {
      icon: Code,
      title: 'Development',
      skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'SQL', 'Git'],
    },
    {
      icon: Palette,
      title: 'Design',
      skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'Design Systems', 'User Research'],
    },
    {
      icon: Smartphone,
      title: 'Mobile',
      skills: ['React Native', 'iOS Development', 'Android Development', 'Mobile UI Design', 'App Store Optimization'],
    },
    {
      icon: Globe,
      title: 'Web',
      skills: ['HTML/CSS', 'Tailwind CSS', 'Responsive Design', 'Performance Optimization', 'SEO', 'Accessibility'],
    },
  ]

  return (
    <section className="section-padding bg-geist-2">
      <div className="px-8">
        {/* About Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-heading-32 mb-8 text-geist-10">About Me</h2>
          <div className="space-y-6 text-copy-18 text-geist-6">
            <p>
              I'm a passionate designer and developer with a love for creating beautiful, functional, and user-centered digital experiences. My journey in tech started with curiosity and has evolved into a career focused on solving real problems through thoughtful design and clean code.
            </p>
            <p>
              I believe that great design is invisible - it should feel natural and intuitive. Whether I'm designing a user interface, building a web application, or crafting a mobile experience, my goal is always to create something that not only looks good but feels even better to use.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-heading-24 text-geist-10 mb-1">{stat.number}</div>
              <div className="text-label-12 text-geist-5">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-heading-20 text-geist-10 mb-8 text-center">Skills & Expertise</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                className="minimal-card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <category.icon size={18} className="text-geist-6" />
                  <h4 className="text-label-16 text-geist-10">{category.title}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-geist-2 text-geist-6 text-label-12 rounded-full border border-geist-3 px-3 py-1"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a href="#contact" className="minimal-button">
            Let's Work Together
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection 