const { ConvexHttpClient } = require("convex/browser");

// This script helps set up the database with sample data
// Run this after setting up your Convex deployment

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://your-convex-url.convex.cloud";

async function setupDatabase() {
  const client = new ConvexHttpClient(CONVEX_URL);
  
  try {
    console.log("🌱 Setting up database...");
    
    // Seed users
    console.log("👥 Creating sample users...");
    await client.mutation("seed:seedUsers", {});
    
    // Seed jobs
    console.log("💼 Creating sample jobs...");
    await client.mutation("seed:seedJobs", {});
    
    // Create sample notifications
    console.log("🔔 Creating sample notifications...");
    await client.mutation("notifications:createNotification", {
      userId: "user_123",
      title: "Welcome to YourJob!",
      message: "Your account has been created successfully. Start by uploading your resume to get AI-powered analysis.",
      type: "success",
      actionUrl: "/dashboard/resumes"
    });
    
    await client.mutation("notifications:createNotification", {
      userId: "user_123",
      title: "New Job Matches",
      message: "We found 5 new jobs that match your profile. Check them out!",
      type: "info",
      actionUrl: "/dashboard/jobs"
    });
    
    await client.mutation("notifications:createNotification", {
      userId: "user_123",
      title: "Resume Analysis Complete",
      message: "Your resume has been analyzed. Check your score and suggestions.",
      type: "success",
      actionUrl: "/dashboard/resumes"
    });
    
    console.log("✅ Database setup complete!");
    console.log("\n📊 Sample data created:");
    console.log("- 2 users (demo user + admin)");
    console.log("- 8 sample jobs");
    console.log("- 3 sample notifications");
    console.log("\n🚀 You can now run 'npm run dev' to start the application!");
    
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
