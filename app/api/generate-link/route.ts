import { encrypt } from "@/lib/jose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { environment } = await request.json();

    const encryptedHash = await encrypt(environment);
    const link = `${
      environment === "local"
        ? "http://localhost:3000"
        : environment === "production"
        ? "https://madmon.app"
        : environment === "preview"
        ? "https://development.madmon.app"
        : "https://dashboard.madmon.app"
    }/login/${encryptedHash}`;

    return NextResponse.json({ link });
  } catch (error) {
    console.error("Error generating link:", error);
    return NextResponse.json(
      { error: "Failed to generate link" },
      { status: 500 }
    );
  }
}
