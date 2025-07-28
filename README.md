# Vraj Portfolio

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features smooth animations, dark mode support, and a beautiful design inspired by modern portfolio websites.

## 🚀 Features

- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Dark Mode Support**: Built-in dark/light theme toggle
- **Performance Optimized**: Fast loading with Next.js optimizations
- **SEO Ready**: Meta tags and structured data for better search visibility
- **Contact Form**: Functional contact form with validation
- **Smooth Animations**: Framer Motion animations for enhanced user experience

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vraj-portfolio.git
   cd vraj-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and deploy

### Alternative: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `.next` folder to Netlify
   - Or connect your GitHub repository

## 📁 Project Structure

```
vraj-portfolio/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── Navigation.tsx       # Navigation component
│   ├── Hero.tsx            # Hero section
│   ├── WorkSection.tsx     # Projects section
│   ├── AboutSection.tsx    # About section
│   ├── ContactSection.tsx  # Contact form
│   └── Footer.tsx          # Footer component
├── public/                  # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎨 Customization

### Colors
Edit the color scheme in `tailwind.config.js`:
```javascript
colors: {
  primary: { /* your colors */ },
  accent: { /* your colors */ }
}
```

### Content
Update the content in each component:
- **Hero**: Update name, title, and description
- **WorkSection**: Add your projects
- **AboutSection**: Update your bio and skills
- **ContactSection**: Update contact information

### Images
Replace placeholder images with your own:
- Project images in `WorkSection.tsx`
- Profile image (if needed)

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for any API keys:
```env
NEXT_PUBLIC_CONTACT_EMAIL=your-email@example.com
```

### SEO
Update metadata in `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Name - Designer & Developer',
  description: 'Your portfolio description',
  // ... other meta tags
}
```

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: Optimized for all metrics
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Design inspiration from modern portfolio websites
- Icons from [Lucide React](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Contact: hello@vraj.me

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS 