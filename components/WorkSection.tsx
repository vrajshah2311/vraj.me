'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'

const WorkSection = () => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce platform built with Next.js and Stripe integration. Features include product catalog, shopping cart, user authentication, and payment processing.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      tags: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS'],
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      tags: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      id: 3,
      title: 'Portfolio Website',
      description: 'A responsive portfolio website showcasing creative work with smooth animations and modern design principles.',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8b6a40?w=800&h=600&fit=crop',
      tags: ['Next.js', 'Framer Motion', 'Tailwind CSS'],
      liveUrl: '#',
      githubUrl: '#',
    },
  ]

  return (
    <section className="section-padding">
      <div className="px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-heading-32 mb-6 text-geist-10">Selected Work</h2>
          <p className="text-copy-18 text-geist-6">
            A collection of projects that showcase my skills in design and development
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Project Image */}
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Project Content */}
                <div className="space-y-4">
                  <h3 className="text-heading-24 text-geist-10">
                    {project.title}
                  </h3>
                  <p className="text-copy-16 leading-relaxed text-geist-6 max-w-2xl">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-geist-2 text-geist-6 text-label-12 rounded-full border border-geist-3 px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Project Links */}
                  <div className="flex gap-4 pt-2">
                    <a
                      href={project.liveUrl}
                      className="text-geist-6 hover:text-geist-9 text-label-14 flex items-center gap-2"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                    <a
                      href={project.githubUrl}
                      className="text-geist-6 hover:text-geist-9 text-label-14 flex items-center gap-2"
                    >
                      <Github size={14} />
                      Source Code
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="#work"
            className="minimal-button-outline"
          >
            View All Projects
            <ExternalLink size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default WorkSection 