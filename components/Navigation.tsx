'use client'

import { motion } from 'framer-motion'

const Navigation = () => {
  const primaryNavItems = [
    { name: 'Work', href: '#work' },
    { name: 'About', href: '#about' },
    { name: 'Collab', href: '#contact' },
    { name: 'Trust me bro', href: '#about' },
  ]

  const secondaryNavItems = [
    { name: 'Projects', href: '#work' },
    { name: 'AMA', href: '#contact' },
    { name: 'Tools', href: '#about' },
    { name: 'Blog', href: '#contact' },
    { name: 'Books', href: '#about' },
    { name: 'Homies', href: '#contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-white p-8">
      <div className="flex flex-col h-full">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-light text-gray-400 mb-12"
        >
          vraj.me
        </motion.div>

        {/* Primary Navigation */}
        <div className="space-y-6 mb-12">
          {primaryNavItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="block text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm"
            >
              {item.name}
            </motion.a>
          ))}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-4 mt-auto">
          {secondaryNavItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + primaryNavItems.length) * 0.1 }}
              className="block text-gray-400 hover:text-gray-600 transition-colors duration-200 text-sm"
            >
              {item.name}
            </motion.a>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation 