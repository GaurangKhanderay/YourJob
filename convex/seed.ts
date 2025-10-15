import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedJobs = mutation({
  args: {},
  handler: async (ctx) => {
    const sampleJobs = [
      {
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        description: "We are looking for a passionate Senior Frontend Developer to join our team. You will be responsible for building user-facing features using React, TypeScript, and modern web technologies. The ideal candidate has 5+ years of experience and a strong portfolio of web applications.",
        location: "San Francisco, CA",
        salary: "$120,000 - $160,000",
        type: "full-time" as const,
        experience: "5+ years",
        skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
        postedBy: "admin_123" as any,
        postedAt: Date.now() - 86400000, // 1 day ago
        isActive: true,
        applicationsCount: 0,
      },
      {
        title: "Full Stack Engineer",
        company: "StartupXYZ",
        description: "Join our fast-growing startup as a Full Stack Engineer. You'll work on both frontend and backend systems, building scalable web applications. We use Node.js, React, and PostgreSQL. Remote work available.",
        location: "Remote",
        salary: "$90,000 - $130,000",
        type: "full-time" as const,
        experience: "3+ years",
        skills: ["Node.js", "React", "PostgreSQL", "AWS", "Docker"],
        postedBy: "admin_123" as any,
        postedAt: Date.now() - 172800000, // 2 days ago
        isActive: true,
        applicationsCount: 0,
      },
      {
        title: "UI/UX Designer",
        company: "DesignStudio",
        description: "We're seeking a creative UI/UX Designer to join our design team. You'll be responsible for creating beautiful, intuitive user interfaces and improving user experience across our products. Experience with Figma and user research is required.",
        location: "New York, NY",
        salary: "$80,000 - $110,000",
        type: "full-time" as const,
        experience: "2+ years",
        skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems"],
        postedBy: "admin_123" as any,
        postedAt: Date.now() - 259200000, // 3 days ago
        isActive: true,
        applicationsCount: 0,
      },
      {
        title: "DevOps Engineer",
        company: "CloudTech Solutions",
        description: "Looking for a DevOps Engineer to help us scale our infrastructure. You'll work with AWS, Kubernetes, and CI/CD pipelines. Experience with monitoring and automation tools is essential.",
        location: "Austin, TX",
        salary: "$100,000 - $140,000",
        type: "full-time" as const,
        experience: "4+ years",
        skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins"],
        postedBy: "admin_123" as any,
        postedAt: Date.now() - 345600000, // 4 days ago
        isActive: true,
        applicationsCount: 0,
      },
      {
        title: "Data Scientist",
        company: "DataInsights Co.",
        description: "Join our data science team to build machine learning models and analyze large datasets. You'll work with Python, TensorFlow, and cloud platforms. PhD in a quantitative field preferred.",
        location: "Seattle, WA",
        salary: "$130,000 - $180,000",
        type: "full-time" as const,
        experience: "3+ years",
        skills: ["Python", "TensorFlow", "Pandas", "SQL", "Machine Learning"],
        postedBy: "admin_123" as any,
        postedAt: Date.now() - 432000000, // 5 days ago
        isActive: true,
        applicationsCount: 0,
      },
      {
        title: "Product Manager",
        company: "InnovateLabs",
        description: "We're looking for a Product Manager to drive product strategy and work with cross-functional teams. Experience with agile methodologies and user research is required. MBA preferred.",
        location: "Boston, MA",
        salary: "$110,000 - $150,000",
        type: "full-time" as const,
        experience: "4+ years",
        skills: ["Product Strategy", "Agile", "User Research", "Analytics", "Leadership"],
        postedBy: "admin_123" as any,
        postedAt: Date.now() - 518400000, // 6 days ago
        isActive: true,
        applicationsCount: 0,
      },
      {
        title: "Backend Developer (Contract)",
        company: "TechConsulting",
        description: "6-month contract position for a Backend Developer. You'll work on microservices architecture using Go and PostgreSQL. Remote work available.",
        location: "Remote",
        salary: "$60 - $80 per hour",
        type: "contract" as const,
        experience: "3+ years",
        skills: ["Go", "PostgreSQL", "Microservices", "Docker", "REST APIs"],
        postedBy: "admin_123" as any,
        postedAt: Date.now() - 604800000, // 7 days ago
        isActive: true,
        applicationsCount: 0,
      },
      {
        title: "Marketing Intern",
        company: "GrowthMarketing",
        description: "Summer internship opportunity for a Marketing Intern. You'll work on digital marketing campaigns, social media, and content creation. Perfect for students or recent graduates.",
        location: "Chicago, IL",
        salary: "$20 - $25 per hour",
        type: "internship" as const,
        experience: "Entry level",
        skills: ["Social Media", "Content Creation", "Google Analytics", "Email Marketing", "SEO"],
        postedBy: "admin_123" as any,
        postedAt: Date.now() - 691200000, // 8 days ago
        isActive: true,
        applicationsCount: 0,
      },
    ];

    // Check if jobs already exist
    const existingJobs = await ctx.db.query("jobs").collect();
    if (existingJobs.length > 0) {
      console.log("Jobs already exist, skipping seed");
      return { message: "Jobs already exist" };
    }

    // Insert sample jobs
    for (const job of sampleJobs) {
      await ctx.db.insert("jobs", job);
    }

    return { message: `Successfully seeded ${sampleJobs.length} jobs` };
  },
});

export const seedUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const sampleUsers = [
      {
        email: "demo@yourjob.com",
        name: "Demo User",
        role: "user" as const,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      },
      {
        email: "admin@yourjob.com",
        name: "Admin User",
        role: "admin" as const,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      },
    ];

    // Check if users already exist
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0) {
      console.log("Users already exist, skipping seed");
      return { message: "Users already exist" };
    }

    // Insert sample users
    for (const user of sampleUsers) {
      await ctx.db.insert("users", user);
    }

    return { message: `Successfully seeded ${sampleUsers.length} users` };
  },
});
