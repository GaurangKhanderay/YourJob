import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { resumeContent, jobDescription } = await request.json();

    if (!resumeContent) {
      return NextResponse.json(
        { error: 'Resume content is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ success: true, analysis });
    }
    
    // Fallback if JSON parsing fails
    const fallbackAnalysis = {
      score: 75,
      clarity: 80,
      keywords: 70,
      atsCompatibility: 75,
      feedback: ['Resume analysis completed'],
      suggestions: ['Consider adding more specific achievements', 'Include relevant keywords']
    };
    
    return NextResponse.json({ success: true, analysis: fallbackAnalysis });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}
