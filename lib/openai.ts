import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ResumeAnalysisResult {
  score: number;
  clarity: number;
  keywords: number;
  atsCompatibility: number;
  feedback: string[];
  suggestions: string[];
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysisResult> {
  try {
    const prompt = `
    Analyze this resume and provide a comprehensive evaluation. Return your response as a JSON object with the following structure:
    
    {
      "score": number (0-100, overall score),
      "clarity": number (0-100, how clear and well-structured the resume is),
      "keywords": number (0-100, how well it uses relevant keywords for the industry),
      "atsCompatibility": number (0-100, how well it will pass ATS systems),
      "feedback": string[] (array of specific feedback points),
      "suggestions": string[] (array of actionable improvement suggestions)
    }
    
    Resume text:
    ${resumeText}
    
    Please provide a detailed analysis focusing on:
    1. Overall structure and formatting
    2. Use of action verbs and quantifiable achievements
    3. Keyword optimization for ATS systems
    4. Contact information and professional summary
    5. Work experience descriptions
    6. Education and skills sections
    7. Grammar and spelling
    8. Length and conciseness
    
    Be specific and constructive in your feedback and suggestions.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume reviewer and career coach. Analyze resumes professionally and provide constructive feedback to help job seekers improve their chances of landing interviews.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const analysis = JSON.parse(response);
    
    // Validate the response structure
    if (
      typeof analysis.score !== "number" ||
      typeof analysis.clarity !== "number" ||
      typeof analysis.keywords !== "number" ||
      typeof analysis.atsCompatibility !== "number" ||
      !Array.isArray(analysis.feedback) ||
      !Array.isArray(analysis.suggestions)
    ) {
      throw new Error("Invalid response format from OpenAI");
    }

    return analysis;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    
    // Return a default analysis if OpenAI fails
    return {
      score: 0,
      clarity: 0,
      keywords: 0,
      atsCompatibility: 0,
      feedback: ["Unable to analyze resume at this time. Please try again later."],
      suggestions: ["Please ensure your resume is properly formatted and try uploading again."],
    };
  }
}

export async function generateJobDescription(jobTitle: string, company: string, requirements: string[]): Promise<string> {
  try {
    const prompt = `
    Generate a professional job description for the position of "${jobTitle}" at "${company}".
    
    Requirements: ${requirements.join(", ")}
    
    Include:
    1. A compelling job title and company overview
    2. Key responsibilities and duties
    3. Required qualifications and skills
    4. Preferred qualifications
    5. Company benefits and culture
    6. Application instructions
    
    Make it engaging and professional, suitable for a job board posting.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional HR specialist who writes compelling job descriptions that attract top talent.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || "Unable to generate job description.";
  } catch (error) {
    console.error("Error generating job description:", error);
    return "Unable to generate job description at this time.";
  }
}
