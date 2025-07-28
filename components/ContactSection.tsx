'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Github, Twitter, Linkedin } from 'lucide-react'

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

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
          <h2 className="text-heading-32 mb-6 text-geist-10">Get In Touch</h2>
          <p className="text-copy-18 text-geist-6">
            Ready to start a project or just want to chat? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="minimal-card"
          >
            <h3 className="text-heading-20 text-geist-10 mb-8">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-label-14 text-geist-7 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-geist-4 rounded-lg focus:ring-2 focus:ring-geist-10 focus:border-transparent transition-colors text-copy-16"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-label-14 text-geist-7 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-geist-4 rounded-lg focus:ring-2 focus:ring-geist-10 focus:border-transparent transition-colors text-copy-16"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-label-14 text-geist-7 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-geist-4 rounded-lg focus:ring-2 focus:ring-geist-10 focus:border-transparent transition-colors resize-none text-copy-16"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="minimal-button w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send size={18} />
              </button>

              {submitStatus === 'success' && (
                <p className="text-green-600 text-copy-14">Message sent successfully!</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-600 text-copy-14">Failed to send message. Please try again.</p>
              )}
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <h3 className="text-heading-20 text-geist-10 mb-8">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="bg-geist-2 rounded-lg p-3">
                  <Mail size={20} className="text-geist-6" />
                </div>
                <div>
                  <h4 className="text-label-16 text-geist-10">Email</h4>
                  <p className="text-copy-14 text-geist-6">hello@vraj.me</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="bg-geist-2 rounded-lg p-3">
                  <Phone size={20} className="text-geist-6" />
                </div>
                <div>
                  <h4 className="text-label-16 text-geist-10">Phone</h4>
                  <p className="text-copy-14 text-geist-6">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="bg-geist-2 rounded-lg p-3">
                  <MapPin size={20} className="text-geist-6" />
                </div>
                <div>
                  <h4 className="text-label-16 text-geist-10">Location</h4>
                  <p className="text-copy-14 text-geist-6">San Francisco, CA</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="text-heading-16 text-geist-10 mb-4">Follow Me</h4>
              <div className="flex gap-4 justify-center">
                <a
                  href="#"
                  className="bg-geist-2 rounded-lg flex items-center justify-center hover:bg-geist-3 transition-colors border border-geist-3 p-3"
                >
                  <Github size={18} className="text-geist-6" />
                </a>
                <a
                  href="#"
                  className="bg-geist-2 rounded-lg flex items-center justify-center hover:bg-geist-3 transition-colors border border-geist-3 p-3"
                >
                  <Twitter size={18} className="text-geist-6" />
                </a>
                <a
                  href="#"
                  className="bg-geist-2 rounded-lg flex items-center justify-center hover:bg-geist-3 transition-colors border border-geist-3 p-3"
                >
                  <Linkedin size={18} className="text-geist-6" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection 