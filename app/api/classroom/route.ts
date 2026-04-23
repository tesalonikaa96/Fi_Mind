import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simulasi data tugas yang diambil dari Google Classroom
    const mockAssignments = [
      {
        id: "1",
        course: "Second Language Acquisition",
        title: "Feature Hypothesis Review",
        dueDate: "Tomorrow",
        status: "Pending",
      },
      {
        id: "2",
        course: "Literature Analysis",
        title: '"The Story of an Hour" Draft',
        dueDate: "In 3 Days",
        status: "Pending",
      },
    ];

    // Mengembalikan data dalam format JSON
    return NextResponse.json({
      success: true,
      data: mockAssignments,
    });
    
  } catch (error) {
    console.error("Classroom API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch classroom data" },
      { status: 500 }
    );
  }
}