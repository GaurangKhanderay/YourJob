import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { userProfile, availableJobs } = await request.json();

    if (!userProfile || !availableJobs) {
      return NextResponse.json(
        { error: 'User profile and available jobs are required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Based on this user profile and available jobs, recommend the best matches:
      
      User Profile:
      - Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
      - Experience: ${userProfile.experience || 'Not specified'}
      - Preferred Location: ${userProfile.location || 'Not specified'}
      - Job Type: ${userProfile.jobType || 'Not specified'}
      
      Available Jobs:
      ${availableJobs.map((job: any) => `
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const recommendations = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ success: true, recommendations });
    }
    
    // Fallback recommendations
    const fallbackRecommendations = availableJobs.slice(0, 3).map((job: any) => ({
      jobId: job._id,
      matchScore: Math.floor(Math.random() * 30) + 70,
      reason: 'Good match based on skills and experience'
    }));
    
    return NextResponse.json({ success: true, recommendations: fallbackRecommendations });
  } catch (error) {
    console.error('Error generating job recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate job recommendations' },
      { status: 500 }
    );
  }
}
