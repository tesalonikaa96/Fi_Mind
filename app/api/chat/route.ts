import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Ini adalah simulasi backend AI. 
    // Nantinya kamu bisa menyambungkan ini ke Google Gemini API atau OpenAI.
    
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    let aiResponse = "I'm here to support your academic journey. Could you tell me more about that?";

    // Logika sederhana untuk simulasi respons
    if (lastMessage.includes("anxious") || lastMessage.includes("cemas")) {
      aiResponse = "I understand that feeling. Take a deep breath. 😌 Remember, you've handled tough assignments before. Let's break this down together.";
    } else if (lastMessage.includes("sla") || lastMessage.includes("literature")) {
      aiResponse = "That sounds like an interesting topic! Should we start by reviewing your main notes or drafting the introduction?";
    } else if (lastMessage.includes("burnout")) {
      aiResponse = "You've been working hard. 😵‍💫 Maybe it's time to close the laptop for a bit? Your peace is more important than any deadline.";
    }

    return NextResponse.json({
      role: "ai",
      content: aiResponse,
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}