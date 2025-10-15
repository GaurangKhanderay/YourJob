#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables...');

const envContent = `# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
CONVEX_DEPLOYMENT=your-convex-deployment-url

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=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

# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyDeURe5yb85lZRazbZLHHK4zpbPoeMHZVU

# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3003

# OpenAI Configuration (Backup)
OPENAI_API_KEY=your-openai-api-key

# Database Configuration
DATABASE_URL=your-database-url

# Production URLs
NEXT_PUBLIC_APP_URL=http://localhost:3003
NEXT_PUBLIC_API_URL=http://localhost:3003/api
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created successfully!');
  console.log('📝 Please update the Convex URL and Google Client ID in .env.local');
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
}

console.log('\n🚀 Next steps:');
console.log('1. Update .env.local with your actual Convex URL');
console.log('2. Set up Google OAuth credentials');
console.log('3. Run: npm run dev');
