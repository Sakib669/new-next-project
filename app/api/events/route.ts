
import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 },
      );
    }

    const createdEvent = await Event.create(event);

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: error instanceof Error ? error.message : "Unknown",
      },
      {
        status: 400,
      },
    );
  }
};
