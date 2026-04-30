// app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { message, major, role } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Instruksi khusus agar AI bertingkah seperti pewawancara
    const systemPrompt = `Kamu adalah rekruter profesional yang sedang mewawancarai kandidat dari jurusan ${major} untuk posisi ${role}. 
    Berikan respons yang singkat, profesional, dan menantang. Jangan terlalu ramah, bersikaplah seperti HRD sungguhan. 
    Komentari jawaban kandidat, lalu berikan 1 pertanyaan lanjutan. Jawab dalam bahasa Inggris.`;

    const result = await model.generateContent(`${systemPrompt}\n\nKandidat: ${message}`);
    const response = result.response.text();

    return NextResponse.json({ reply: response });
  } catch (error) {
    console.error('Error in AI Chat:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}