import { NextResponse } from "next/server";
import cloudinary from "@/app/config/cloudinaryConfig";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb"
    }
  }
};

export async function POST(req) {
  if (req.method !== "POST") {
    return new NextResponse(null, { status: 405, statusText: "Method Not Allowed" });
  }

  try {
    const { public_id, timestamp } = await req.json();

    if (!public_id || !timestamp) {
      return new NextResponse(JSON.stringify({ success: false, message: "Missing required parameters" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    const paramsToSign = { public_id, timestamp };
    const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

    return new NextResponse(
      JSON.stringify({
        success: true,
        timestamp,
        signature
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error generating signature:", error);
    return new NextResponse(JSON.stringify({ success: false, message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
