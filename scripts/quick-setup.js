#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 YourJob Quick Setup Script');
console.log('==============================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  const envContent = `# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
CONVEX_DEPLOYMENT=your-convex-deployment-url

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your-openai-api-key

# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created! Please update with your Convex URL.\n');
} else {
  console.log('✅ .env.local already exists\n');
}

console.log('📋 Setup Instructions:');
console.log('1. Run: npx convex dev');
console.log('2. Copy your Convex URL to .env.local');
console.log('3. Run: npm run dev');
console.log('4. Open: http://localhost:3000\n');

console.log('🔧 If you encounter errors:');
console.log('- Make sure Convex dev server is running');
console.log('- Check your .env.local file has correct URLs');
console.log('- Run: npm run setup (to seed database)');
console.log('- Clear .next folder: rm -rf .next\n');

console.log('🎉 Happy coding!');
