'use client'

import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-geist-2 text-geist-10 py-12">
      <div className="px-8">
        <div className="text-center space-y-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-heading-20 text-geist-10 mb-4">Vraj</h3>
            <p className="text-copy-14 text-geist-6 mb-6">
              Creating beautiful digital experiences through thoughtful design and clean code.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="#"
                className="bg-white rounded-lg flex items-center justify-center hover:bg-geist-1 transition-colors border border-geist-3 p-3"
              >
                <Github size={16} className="text-geist-6" />
              </a>
              <a
                href="#"
                className="bg-white rounded-lg flex items-center justify-center hover:bg-geist-1 transition-colors border border-geist-3 p-3"
              >
                <Twitter size={16} className="text-geist-6" />
              </a>
              <a
                href="#"
                className="bg-white rounded-lg flex items-center justify-center hover:bg-geist-1 transition-colors border border-geist-3 p-3"
              >
                <Linkedin size={16} className="text-geist-6" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-heading-16 text-geist-10">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#work" className="text-copy-14 text-geist-6 hover:text-geist-9 transition-colors">
                  Work
                </a>
              </li>
              <li>
                <a href="#about" className="text-copy-14 text-geist-6 hover:text-geist-9 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-copy-14 text-geist-6 hover:text-geist-9 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            <h4 className="text-heading-16 text-geist-10">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#work" className="text-copy-14 text-geist-6 hover:text-geist-9 transition-colors">
                  Web Design
                </a>
              </li>
              <li>
                <a href="#work" className="text-copy-14 text-geist-6 hover:text-geist-9 transition-colors">
                  Development
                </a>
              </li>
              <li>
                <a href="#work" className="text-copy-14 text-geist-6 hover:text-geist-9 transition-colors">
                  UI/UX Design
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="border-t border-geist-3 pt-8"
          >
            <p className="text-copy-13 text-geist-5">
              © 2024 Vraj. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 