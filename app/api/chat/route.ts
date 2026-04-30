import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, major, role } = await req.json();
    
    // Kuncimu yang asli
    const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  return NextResponse.json({ error: 'API Key belum diatur di .env.local' }, { status: 500 });
}

    const systemPrompt = `You are a professional corporate recruiter interviewing a candidate from the ${major} major for a ${role} position. 
    Respond concisely, professionally, and challengingly. Do not be overly friendly; act like a real HR professional. 
    Briefly comment on the candidate's previous answer, then ask ONE follow-up question. ALWAYS respond in English.`;

    // Kita tembak server Groq langsung
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // 👇 INI YANG DIGANTI: Menggunakan model Llama 3.1 terbaru yang sangat cepat
        model: "llama-3.1-8b-instant", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("🔥 GROQ MENOLAK:", data.error?.message);
      throw new Error(data.error?.message || "Groq API error");
    }

    // Ambil teks balasan
    const reply = data.choices[0].message.content;
    
    console.log("✅ AI BERHASIL MENJAWAB!");
    return NextResponse.json({ reply: reply });

  } catch (error: any) {
    console.error('🔥 Error Internal Route:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}