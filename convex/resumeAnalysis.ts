import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Mock AI analysis function - in a real app, this would call OpenAI API
function analyzeResumeContent(content: string): {
  score: number;
  clarity: number;
  keywords: number;
  atsCompatibility: number;
  feedback: string[];
  suggestions: string[];
} {
  // Basic analysis logic
  const wordCount = content.split(/\s+/).length;
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(content);
  const hasPhone = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(content);
  const hasLinkedIn = /linkedin\.com\/in\/[a-zA-Z0-9-]+/.test(content);
  const hasGitHub = /github\.com\/[a-zA-Z0-9-]+/.test(content);
  
  // Check for common sections
  const hasSummary = /summary|profile|objective/i.test(content);
  const hasExperience = /experience|work history|employment/i.test(content);
  const hasEducation = /education|academic|degree/i.test(content);
  const hasSkills = /skills|technical skills|competencies/i.test(content);
  
  // Check for action verbs
  const actionVerbs = /achieved|developed|implemented|managed|led|created|designed|improved|increased|reduced|optimized/i;
  const actionVerbCount = (content.match(actionVerbs) || []).length;
  
  // Check for quantifiable results
  const hasNumbers = /\d+%|\$\d+|\d+\+|\d+ years?|\d+ months?/i.test(content);
  
  // Calculate scores
  let clarity = 0;
  let keywords = 0;
  let atsCompatibility = 0;
  
  // Clarity score (0-100)
  if (wordCount > 200 && wordCount < 800) clarity += 20;
  if (hasSummary) clarity += 15;
  if (hasExperience) clarity += 20;
  if (hasEducation) clarity += 15;
  if (hasSkills) clarity += 15;
  if (actionVerbCount > 5) clarity += 15;
  
  // Keywords score (0-100)
  const techKeywords = /javascript|python|react|node|sql|aws|docker|kubernetes|git|agile|scrum/i;
  const techKeywordCount = (content.match(techKeywords) || []).length;
  keywords = Math.min(techKeywordCount * 10, 100);
  
  // ATS Compatibility score (0-100)
  if (hasEmail) atsCompatibility += 20;
  if (hasPhone) atsCompatibility += 20;
  if (hasLinkedIn) atsCompatibility += 10;
  if (hasGitHub) atsCompatibility += 10;
  if (hasNumbers) atsCompatibility += 20;
  if (wordCount > 100 && wordCount < 1000) atsCompatibility += 20;
  
  // Overall score
  const score = Math.round((clarity + keywords + atsCompatibility) / 3);
  
  // Generate feedback
  const feedback: string[] = [];
  const suggestions: string[] = [];
  
  if (hasEmail) feedback.push("✓ Contact information is present");
  else suggestions.push("Add your email address");
  
  if (hasPhone) feedback.push("✓ Phone number is included");
  else suggestions.push("Include your phone number");
  
  if (hasLinkedIn) feedback.push("✓ LinkedIn profile is linked");
  else suggestions.push("Add your LinkedIn profile URL");
  
  if (hasGitHub) feedback.push("✓ GitHub profile is linked");
  else suggestions.push("Include your GitHub profile if you have one");
  
  if (hasSummary) feedback.push("✓ Professional summary is present");
  else suggestions.push("Add a professional summary section");
  
  if (hasExperience) feedback.push("✓ Work experience is detailed");
  else suggestions.push("Include detailed work experience");
  
  if (hasEducation) feedback.push("✓ Education section is included");
  else suggestions.push("Add your education background");
  
  if (hasSkills) feedback.push("✓ Skills section is present");
  else suggestions.push("Create a dedicated skills section");
  
  if (actionVerbCount > 5) feedback.push("✓ Strong use of action verbs");
  else suggestions.push("Use more action verbs to describe your achievements");
  
  if (hasNumbers) feedback.push("✓ Quantifiable achievements are highlighted");
  else suggestions.push("Add specific numbers and metrics to your achievements");
  
  if (techKeywordCount > 3) feedback.push("✓ Relevant technical keywords are present");
  else suggestions.push("Include more relevant technical keywords for your field");
  
  if (wordCount < 200) suggestions.push("Consider adding more detail to your resume");
  if (wordCount > 800) suggestions.push("Consider shortening your resume to 1-2 pages");
  
  return {
    score: Math.max(0, Math.min(100, score)),
    clarity: Math.max(0, Math.min(100, clarity)),
    keywords: Math.max(0, Math.min(100, keywords)),
    atsCompatibility: Math.max(0, Math.min(100, atsCompatibility)),
    feedback,
    suggestions,
  };
}

export const analyzeResume = mutation({
  args: {
    resumeId: v.id("resumes"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const { resumeId, content } = args;
      
      if (!content || content.trim().length === 0) {
        throw new ConvexError("Resume content is required");
      }
      
      // Perform AI analysis
      const analysis = analyzeResumeContent(content);
      
      // Update resume with analysis
      await ctx.db.patch(resumeId, {
        analysis: {
          ...analysis,
          analyzedAt: Date.now(),
        },
      });
      
      return { success: true, analysis };
    } catch (error) {
      console.error("Error analyzing resume:", error);
      throw error;
    }
  },
});

export const getResumeAnalysis = query({
  args: {
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    try {
      const resume = await ctx.db.get(args.resumeId);
      if (!resume) {
        throw new ConvexError("Resume not found");
      }
      
      return resume.analysis;
    } catch (error) {
      console.error("Error getting resume analysis:", error);
      return null;
    }
  },
});

export const getResumeInsights = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const resumes = await ctx.db
        .query("resumes")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();
      
      const analyzedResumes = resumes.filter(resume => resume.analysis);
      
      if (analyzedResumes.length === 0) {
        return {
          averageScore: 0,
          totalResumes: resumes.length,
          analyzedResumes: 0,
          insights: [],
        };
      }
      
      const averageScore = Math.round(
        analyzedResumes.reduce((sum, resume) => sum + (resume.analysis?.score || 0), 0) / analyzedResumes.length
      );
      
      const insights = [
        `You have ${analyzedResumes.length} analyzed resume${analyzedResumes.length > 1 ? 's' : ''}`,
        `Average score: ${averageScore}/100`,
        analyzedResumes.length > 1 ? "Consider using your highest-scoring resume for applications" : "Upload more resumes to compare scores",
      ];
      
      return {
        averageScore,
        totalResumes: resumes.length,
        analyzedResumes: analyzedResumes.length,
        insights,
      };
    } catch (error) {
      console.error("Error getting resume insights:", error);
      return {
        averageScore: 0,
        totalResumes: 0,
        analyzedResumes: 0,
        insights: [],
      };
    }
  },
});
