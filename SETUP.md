# YourJob Setup Guide

This guide will help you set up and run the YourJob application locally.

## 🚀 Quick Setup (5 minutes)

### 1. Prerequisites
- Node.js 18+ installed
- Git installed
- A Convex account (free at [convex.dev](https://convex.dev))

### 2. Clone and Install
```bash
git clone <your-repo-url>
cd yourjob
npm install
```

### 3. Set up Convex Backend
```bash
npx convex dev
```
- Follow the prompts to create a new Convex project
- Copy the deployment URL when prompted
- Keep the terminal running (it will sync your schema)

### 4. Configure Environment
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
CONVEX_DEPLOYMENT=your-convex-deployment-url
```

### 5. Seed the Database
```bash
npm run setup
```

### 6. Start the Application
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

## 🎯 What You'll See

### Landing Page
- Beautiful animated hero section
- Feature showcase with hover effects
- Call-to-action sections
- Responsive design

### Dashboard (after signup/login)
- Real-time job listings
- Application tracking
- Resume analysis with AI scoring
- Analytics and insights
- Mobile-optimized navigation

### Key Features Working
- ✅ User authentication
- ✅ Job browsing and filtering
- ✅ Application tracking
- ✅ Resume upload and AI analysis
- ✅ Real-time notifications
- ✅ Responsive design
- ✅ Smooth animations

## 🔧 Troubleshooting

### Common Issues

**1. Convex connection error**
- Make sure your `.env.local` file has the correct `NEXT_PUBLIC_CONVEX_URL`
- Ensure Convex dev server is running (`npx convex dev`)

**2. Database not seeded**
- Run `npm run setup` to populate sample data
- Check Convex dashboard to see if data was created

**3. Build errors**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**4. TypeScript errors**
- Run `npm run lint` to check for issues
- Make sure all imports are correct

### Getting Help
- Check the [README.md](README.md) for detailed documentation
- Look at the [Convex documentation](https://docs.convex.dev)
- Create an issue if you encounter problems

## 🎨 Customization

### Changing Colors
Edit `tailwind.config.js` to modify the color scheme:
```javascript
colors: {
  primary: {
    // Your custom primary colors
  }
}
```

### Adding New Features
1. Create components in `components/` directory
2. Add backend functions in `convex/` directory
3. Update navigation in `components/dashboard/DashboardLayout.tsx`

### Modifying Animations
All animations use Framer Motion. Edit the `motion` components in your files to customize.

## 📱 Mobile Testing

The app is fully responsive and includes PWA features:
- Test on mobile devices
- Use browser dev tools mobile view
- Install as PWA on mobile devices

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
- Netlify
- Railway
- AWS Amplify

## 🎉 You're All Set!

Your YourJob application is now running with:
- ✅ Modern, responsive UI
- ✅ Real-time backend
- ✅ AI-powered features
- ✅ Mobile optimization
- ✅ Professional animations

Start exploring and customizing your job portal!