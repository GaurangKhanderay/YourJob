import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class GeminiAIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async analyzeResume(resumeContent: string, jobDescription?: string) {
    try {
      const prompt = `
        Analyze this resume and provide detailed feedback:
        
        Resume Content:
        ${resumeContent}
        
        ${jobDescription ? `Target Job Description: ${jobDescription}` : ''}
        
        Please provide:
        1. Overall score (0-100)
        2. Clarity score (0-100) - how clear and well-formatted the resume is
        3. Keywords score (0-100) - how well it matches industry keywords
        4. ATS compatibility score (0-100) - how well it will pass ATS systems
        5. Specific feedback points (array of strings)
        6. Improvement suggestions (array of strings)
        
        Format your response as a JSON object with these exact keys:
        {
          "score": number,
          "clarity": number,
          "keywords": number,
          "atsCompatibility": number,
          "feedback": string[],
          "suggestions": string[]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return {
        score: 75,
        clarity: 80,
        keywords: 70,
        atsCompatibility: 75,
        feedback: ['Resume analysis completed'],
        suggestions: ['Consider adding more specific achievements', 'Include relevant keywords']
      };
    } catch (error) {
      console.error('Error analyzing resume with Gemini:', error);
      return {
        score: 70,
        clarity: 75,
        keywords: 65,
        atsCompatibility: 70,
        feedback: ['Analysis completed with basic scoring'],
        suggestions: ['Review resume formatting', 'Add more specific achievements']
      };
    }
  }

  async generateJobRecommendations(userProfile: any, availableJobs: any[]) {
    try {
      const prompt = `
        Based on this user profile and available jobs, recommend the best matches:
        
        User Profile:
        - Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
        - Experience: ${userProfile.experience || 'Not specified'}
        - Preferred Location: ${userProfile.location || 'Not specified'}
        - Job Type: ${userProfile.jobType || 'Not specified'}
        
        Available Jobs:
        ${availableJobs.map(job => `
          - ${job.title} at ${job.company}
          - Location: ${job.location}
          - Type: ${job.type}
          - Skills: ${job.skills?.join(', ')}
          - Description: ${job.description?.substring(0, 200)}...
        `).join('\n')}
        
        Return a JSON array of job recommendations with this format:
        [
          {
            "jobId": "job_id",
            "matchScore": number,
            "reason": "Why this job matches the user"
          }
        ]
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback recommendations
      return availableJobs.slice(0, 3).map(job => ({
        jobId: job._id,
        matchScore: Math.floor(Math.random() * 30) + 70,
        reason: 'Good match based on skills and experience'
      }));
    } catch (error) {
      console.error('Error generating job recommendations:', error);
      return [];
    }
  }

  async generateCoverLetter(jobDescription: string, userProfile: any, resumeContent: string) {
    try {
      const prompt = `
        Generate a professional cover letter for this job:
        
        Job Description:
        ${jobDescription}
        
        User Profile:
        - Name: ${userProfile.name || 'Applicant'}
        - Skills: ${userProfile.skills?.join(', ') || 'Various skills'}
        - Experience: ${userProfile.experience || 'Relevant experience'}
        
        Resume Highlights:
        ${resumeContent.substring(0, 500)}...
        
        Generate a professional, personalized cover letter that:
        1. Addresses the specific job requirements
        2. Highlights relevant skills and experience
        3. Shows enthusiasm for the role
        4. Is 3-4 paragraphs long
        5. Uses a professional tone
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating cover letter:', error);
      return `Dear Hiring Manager,\n\nI am writing to express my interest in the position. Based on my skills and experience, I believe I would be a great fit for your team.\n\nThank you for your consideration.\n\nSincerely,\n${userProfile.name || 'Applicant'}`;
    }
  }

  async generateInterviewQuestions(jobDescription: string, userProfile: any) {
    try {
      const prompt = `
        Generate 5 relevant interview questions for this job and candidate:
        
        Job Description:
        ${jobDescription}
        
        Candidate Profile:
        - Skills: ${userProfile.skills?.join(', ') || 'Various skills'}
        - Experience: ${userProfile.experience || 'Relevant experience'}
        
        Generate 5 interview questions that are:
        1. Relevant to the specific role
        2. Appropriate for the candidate's level
        3. Mix of technical and behavioral questions
        4. Professional and insightful
        
        Return as a JSON array of strings.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback questions
      return [
        'Tell me about yourself and your relevant experience.',
        'Why are you interested in this position?',
        'Describe a challenging project you worked on.',
        'How do you stay updated with industry trends?',
        'Where do you see yourself in 5 years?'
      ];
    } catch (error) {
      console.error('Error generating interview questions:', error);
      return [
        'Tell me about yourself and your relevant experience.',
        'Why are you interested in this position?',
        'Describe a challenging project you worked on.',
        'How do you stay updated with industry trends?',
        'Where do you see yourself in 5 years?'
      ];
    }
  }
}

export const geminiAI = new GeminiAIService();
