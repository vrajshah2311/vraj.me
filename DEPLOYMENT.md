# Deployment Guide

This guide will help you deploy your portfolio website to various platforms.

## 🚀 Vercel (Recommended)

Vercel is the easiest and most optimized platform for Next.js applications.

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/vraj-portfolio.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Environment Variables** (if needed)
   - Add any environment variables in the Vercel dashboard
   - Example: `NEXT_PUBLIC_CONTACT_EMAIL=your-email@example.com`

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your site
   - You'll get a URL like: `https://your-project.vercel.app`

### Step 3: Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your project settings in Vercel
   - Click "Domains"
   - Add your custom domain (e.g., `vraj.me`)

2. **Configure DNS**
   - Add the Vercel nameservers to your domain registrar
   - Or add the required DNS records

## 🌐 Alternative Platforms

### Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder
   - Or connect your GitHub repository

3. **Configure build settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

### GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add scripts to package.json**
   ```json
   {
     "scripts": {
       "export": "next build && next export",
       "deploy": "npm run export && gh-pages -d out"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## 🔧 Environment Variables

Create a `.env.local` file for local development:

```env
# Contact Form
NEXT_PUBLIC_CONTACT_EMAIL=your-email@example.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Social Links
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourusername
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/yourusername
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/yourusername
```

## 📊 Performance Optimization

### Vercel Analytics

1. **Enable Analytics**
   - Go to your Vercel project
   - Click "Analytics" tab
   - Enable Web Analytics

2. **Add to your app**
   ```bash
   npm install @vercel/analytics
   ```

3. **Import in layout.tsx**
   ```typescript
   import { Analytics } from '@vercel/analytics/react'

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <html lang="en">
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   ```

### Image Optimization

1. **Use Next.js Image component**
   ```typescript
   import Image from 'next/image'

   <Image
     src="/your-image.jpg"
     alt="Description"
     width={800}
     height={600}
     priority
   />
   ```

2. **Optimize images**
   - Use WebP format when possible
   - Compress images before uploading
   - Use appropriate sizes for different devices

## 🔒 Security

### HTTPS
- Vercel automatically provides HTTPS
- For other platforms, ensure SSL is enabled

### Environment Variables
- Never commit sensitive data to Git
- Use environment variables for API keys
- Add `.env.local` to `.gitignore`

## 📱 Testing

Before deploying, test your site:

1. **Build locally**
   ```bash
   npm run build
   npm start
   ```

2. **Check performance**
   - Use Lighthouse in Chrome DevTools
   - Test on different devices
   - Check mobile responsiveness

3. **Test contact form**
   - Ensure form submissions work
   - Test validation
   - Check email delivery

## 🚨 Troubleshooting

### Common Issues

1. **Build fails**
   - Check for TypeScript errors
   - Ensure all dependencies are installed
   - Verify Node.js version compatibility

2. **Images not loading**
   - Check image paths
   - Ensure images are in the public folder
   - Verify image URLs are correct

3. **Contact form not working**
   - Check API route configuration
   - Verify environment variables
   - Test API endpoint directly

### Getting Help

- Check Vercel documentation
- Review Next.js deployment guide
- Check browser console for errors
- Use Vercel's built-in debugging tools

## 🎉 Post-Deployment

1. **Test everything**
   - Navigation
   - Contact form
   - Responsive design
   - Performance

2. **Set up monitoring**
   - Enable Vercel Analytics
   - Set up error tracking
   - Monitor performance

3. **Share your work**
   - Update your social media
   - Share with potential clients
   - Add to your resume

---

Your portfolio is now live! 🎉 