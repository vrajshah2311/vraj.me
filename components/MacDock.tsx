'use client'

import { motion } from 'framer-motion'
import { 
  Home, 
  Briefcase, 
  User, 
  Mail, 
  Github, 
  Linkedin, 
  Twitter 
} from 'lucide-react'

const MacDock = () => {
  const dockItems = [
    { icon: Home, label: 'Home', href: '#home' },
    { icon: Briefcase, label: 'Work', href: '#work' },
    { icon: User, label: 'About', href: '#about' },
    { icon: Mail, label: 'Contact', href: '#contact' },
    { icon: Github, label: 'GitHub', href: 'https://github.com' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-geist-9/80 backdrop-blur-md rounded-2xl px-4 py-3 border border-geist-8/50 shadow-2xl">
        <div className="flex items-center gap-2">
          {dockItems.map((item, index) => (
            <motion.div
              key={item.label}
              whileHover={{ 
                scale: 1.2,
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group relative"
            >
              <motion.div
                className="w-12 h-12 bg-geist-8/50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-geist-7/50 transition-colors duration-200"
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-6 h-6 text-geist-2" />
              </motion.div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-geist-10 text-geist-1 text-label-12 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default MacDock 