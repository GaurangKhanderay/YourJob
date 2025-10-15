import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, userProfile, resumeContent } = await request.json();

    if (!jobDescription || !userProfile) {
      return NextResponse.json(
        { error: 'Job description and user profile are required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Generate a professional cover letter for this job:
      
      Job Description:
      ${jobDescription}
      
      User Profile:
      - Name: ${userProfile.name || 'Applicant'}
      - Skills: ${userProfile.skills?.join(', ') || 'Various skills'}
      - Experience: ${userProfile.experience || 'Relevant experience'}
      
      Resume Highlights:
      ${resumeContent?.substring(0, 500) || 'Relevant experience and skills'}
      
      Generate a professional, personalized cover letter that:
      1. Addresses the specific job requirements
      2. Highlights relevant skills and experience
      3. Shows enthusiasm for the role
      4. Is 3-4 paragraphs long
      5. Uses a professional tone
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const coverLetter = response.text();
    
    return NextResponse.json({ success: true, coverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
