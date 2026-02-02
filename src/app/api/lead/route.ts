import { NextRequest, NextResponse } from "next/server";

interface LeadPayload {
  name: string;
  email: string;
  company?: string;
  role?: string;
  roiPercentage?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadPayload = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Forward to webhook if configured
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...body,
            source: "roi-calculator",
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        // Log but don't fail the request
        console.error("Webhook delivery failed:", err);
      }
    } else {
      // No webhook configured — just log
      console.log("[Lead Capture]", JSON.stringify(body));
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
