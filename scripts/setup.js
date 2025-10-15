#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up YourJob...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  const envContent = `# Convex Configuration
CONVEX_DEPLOYMENT=your-convex-deployment-url
NEXT_PUBLIC_CONVEX_URL=your-convex-url

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created successfully');
} else {
  console.log('✅ .env.local already exists');
}

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  console.log('Run: npm install');
} else {
  console.log('✅ Dependencies already installed');
}

console.log('\n🎉 Setup complete! Next steps:');
console.log('1. Run: npm install');
console.log('2. Run: npx convex dev');
console.log('3. Update .env.local with your API keys');
console.log('4. Run: npm run dev');
console.log('\n📚 Check README.md for detailed setup instructions');
